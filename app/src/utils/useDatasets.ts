import { createContext, useContext, useEffect, useState } from "react";
import DataFetcher from "./DataFetcher";
import { AllMetadata, Dataset, DatasetStore, LoadStatus } from "./DatasetTypes";
import Logger from "./Logger";

const METADATA_KEY = "all_metadata";
const fetcher = new DataFetcher();
const logger = new Logger(false);

const metadataLoadPromise: Promise<AllMetadata> = fetcher.getMetadata();

interface ResourceCache<R> {
  resources: Record<string, R>;
  statuses: Record<string, LoadStatus>;
}

interface ResourceCacheManager<R> {
  cache: ResourceCache<R>;
  setLoadStatus: (resourceId: string, status: LoadStatus) => void;
  setLoaded: (resourceId: string, resource: R) => void;
}

/**
 * Loads a resource and tracks its load state by updating the
 * ResourceCacheManager.
 * @param resourceId A unique id to identify the resource. If the same resource
 *     id is requested multiple times, it will only be fetched once.
 * @param cacheManager The ResourceCacheManager that tracks that resource.
 * @param loadFunction A function that loads the resource when called.
 */
async function loadResource<R>(
  resourceId: string,
  cacheManager: ResourceCacheManager<R>,
  loadFunction: () => Promise<R>
) {
  try {
    if (cacheManager.cache.statuses[resourceId]) {
      logger.debugLog("Already loaded or loading " + resourceId);
      return;
    }

    logger.debugLog("Loading " + resourceId);
    cacheManager.setLoadStatus(resourceId, "loading");
    const result = await loadFunction();
    logger.debugLog("Loaded " + resourceId);
    cacheManager.setLoaded(resourceId, result);
  } catch (e) {
    cacheManager.setLoadStatus(resourceId, "error");
    await logger.logError(e, "WARNING", {
      error_type: "resource_load_failure",
      resource_id: resourceId,
    });
  }
}

/**
 * Hook that exposes a cache of resources and their load statuses. Provides
 * functions to update the state of a resource.
 */
function useResourceCache<R>(): ResourceCacheManager<R> {
  const [cache, setCache] = useState<ResourceCache<R>>({
    resources: {},
    statuses: {},
  });

  function setLoadStatus(resourceId: string, status: LoadStatus) {
    setCache((prevCache) => ({
      ...prevCache,
      statuses: { ...prevCache.statuses, [resourceId]: status },
    }));
  }

  function setLoaded(resourceId: string, resource: R) {
    setCache((prevCache) => ({
      resources: { ...prevCache.resources, [resourceId]: resource },
      statuses: { ...prevCache.statuses, [resourceId]: "loaded" },
    }));
  }

  return { cache, setLoadStatus, setLoaded };
}

/**
 * Hook that exposes a single DatasetStore to the application. Should only be
 * called once at the root app level, and provided via context to the rest of
 * the app.
 *
 * Note: This solution roughly mirrors what a state management library would do,
 * but using a hook and context. This works fine for our purposes because our
 * global state is fairly simple and rarely changes. If we find the need for
 * more complex or dynamic global state, we should consider using a state
 * management library.
 */
export function useDatasetStoreProvider(): DatasetStore {
  const metadataCacheManager = useResourceCache<AllMetadata>();
  const datasetCacheManager = useResourceCache<Dataset>();

  function trackMetadataLoad() {
    loadResource<AllMetadata>(
      METADATA_KEY,
      metadataCacheManager,
      async () => metadataLoadPromise
    );
  }

  useEffect(() => {
    trackMetadataLoad();
    // We only want this to run once, on initial render.
    // eslint-disable-next-line
  }, []);

  function loadDataset(datasetId: string) {
    loadResource<Dataset>(datasetId, datasetCacheManager, async () => {
      const promise = fetcher.loadDataset(datasetId);
      const [response, metadata] = await Promise.all([
        promise,
        metadataLoadPromise,
      ]);
      return new Dataset(response.data, metadata[datasetId]);
    });
  }

  function getDatasetLoadStatus(id: string): LoadStatus {
    return datasetCacheManager.cache.statuses[id] || "unloaded";
  }

  return {
    loadDataset,
    getDatasetLoadStatus,
    metadataLoadStatus:
      metadataCacheManager.cache.statuses[METADATA_KEY] || "unloaded",
    metadata: metadataCacheManager.cache.resources[METADATA_KEY] || {},
    datasets: datasetCacheManager.cache.resources,
  };
}

const DatasetStoreContext = createContext<DatasetStore>({} as DatasetStore);
export const DatasetProvider = DatasetStoreContext.Provider;

/**
 * Hook that allows components to access the DatasetStore. A parent component
 * must provide the DatasetStore via the DatasetProvider
 */
export function useDatasetStore(): DatasetStore {
  return useContext(DatasetStoreContext);
}
