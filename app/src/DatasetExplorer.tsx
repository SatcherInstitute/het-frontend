import React, { useState } from "react";
import DatasetFilter from "./DatasetFilter";
import DataFetcher from "./DataFetcher";
import DataTable from "./DataTable";
import CssBaseline from "@material-ui/core/CssBaseline";
import DatasetListing from "./DatasetListing";
import styles from "./DatasetExplorer.module.scss";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

const sources = [
  {
    id: "state_names",
    displayName: "State Names",
    description: "List of states and their FIPS codes.",
  },
  {
    id: "county_names",
    displayName: "County Names",
    description: "List of counties and their FIPS codes.",
  },
  {
    id: "pop_by_race",
    displayName: "County Population by Race",
    description: "The population of each county broken down by race.",
  },
];

type LoadStatus = "unloaded" | "loading" | "loaded";

function DatasetExplorer() {
  const [loadStatus, setLoadStatus] = useState<LoadStatus>("unloaded");
  const [previewedSourceId, setPreviewedSourceId] = useState("");
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [activeFilter, setActiveFilter] = useState<Array<string>>([]);

  const loadPreview = async (sourceId: string) => {
    setLoadStatus("loading");
    setPreviewedSourceId(sourceId);
    const fetcher = new DataFetcher();
    // TODO error handling
    const source = await fetcher.loadDataset(sourceId);
    setData(source.data);
    setColumns(source.columns);
    setLoadStatus("loaded");
  };

  function filterSources(filtered: Array<string>) {
    setActiveFilter(filtered);
  }

  let table;
  if (loadStatus === "loaded") {
    table = <DataTable columns={columns} data={data} />;
  } else if (loadStatus === "loading") {
    table = <p>Loading...</p>;
  } else {
    table = <p>Select a data source to view.</p>;
  }
  // TODO move CssBaseline up to root, or don't use it.
  return (
    <>
      <CssBaseline />
      <div className={styles.DatasetExplorer}>
        <div className={styles.DatasetList}>
          <div className={styles.DatasetListItem}>
            <DatasetFilter
              sources={sources}
              onSelectionChange={filterSources}
            />
          </div>
          {sources
            .filter(
              (source) =>
                activeFilter.length === 0 || activeFilter.includes(source.id)
            )
            .map((source) => (
              <div className={styles.Dataset}>
                <div className={styles.DatasetListItem}>
                  <DatasetListing
                    source={source}
                    onPreview={() => loadPreview(source.id)}
                  />
                </div>
                {previewedSourceId === source.id ? <ChevronRightIcon /> : null}
              </div>
            ))}
        </div>
        <div className={styles.Table}>{table}</div>
      </div>
    </>
  );
}

export default DatasetExplorer;
