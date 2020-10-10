import React, { useState } from "react";
import DatasetFilter from "./DatasetFilter";
import DataFetcher from "./DataFetcher";
import DataTable from "./DataTable";
import CssBaseline from "@material-ui/core/CssBaseline";
import DatasetListing from "./DatasetListing";
import styles from "./DatasetExplorer.module.scss";

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

function DatasetExplorer() {
  const [loading, setLoading] = useState(false);
  const [activeSource, setActiveSource] = useState("");
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [activeFilter, setActiveFilter] = useState<Array<string>>([]);

  const loadPreview = async (sourceId: string) => {
    setActiveSource("");
    setLoading(true);
    const fetcher = new DataFetcher();
    // TODO error handling
    const source = await fetcher.loadDataset(sourceId);
    setData(source.data);
    setColumns(source.columns);
    setActiveSource(sourceId);
    setLoading(false);
  };

  function filterSources(filtered: Array<string>) {
    setActiveFilter(filtered);
  }

  let table;
  if (activeSource) {
    table = <DataTable columns={columns} data={data} />;
  } else if (loading) {
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
          <DatasetFilter sources={sources} onSelectionChange={filterSources} />
          {sources
            .filter(
              (source) =>
                activeFilter.length === 0 || activeFilter.includes(source.id)
            )
            .map((source) => (
              <div className={styles.Dataset}>
                <DatasetListing
                  source={source}
                  onPreview={() => loadPreview(source.id)}
                />
              </div>
            ))}
        </div>
        <div className={styles.Table}>{table}</div>
      </div>
    </>
  );
}

export default DatasetExplorer;
