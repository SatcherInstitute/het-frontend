import React from "react";
import DataFetcher from "../data/DataFetcher";
import {
  DatasetProvider,
  useDatasetStoreProvider,
} from "../data/useDatasetStore";
import { initGlobals } from "../utils/globals";
import Logger from "../utils/Logger";

initGlobals(new Logger(false), new DataFetcher());

/** A fake app context that sets up global context for use in tests. */
function AppContext(props: { children: React.ReactNode }) {
  const datasetStore = useDatasetStoreProvider();
  return (
    <DatasetProvider value={datasetStore}>{props.children}</DatasetProvider>
  );
}

export default AppContext;
