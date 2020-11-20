import { Button } from "@material-ui/core";
import React, { useEffect } from "react";
import { LoadStatus } from "../utils/DatasetTypes";
import useDatasetStore from "../utils/useDatasetStore";

function getJointLoadStatus(statuses: LoadStatus[]) {
  if (statuses.includes("error")) {
    return "error";
  }
  if (statuses.includes("loading") || statuses.includes("unloaded")) {
    return "loading";
  }
  return "loaded";
}

/**
 * Provides a wrapper around a UI component that requires some datasets, and
 * displays loading and error indicators.
 */
function WithDatasets(props: {
  datasetIds: string[];
  children: () => JSX.Element;
}) {
  const datasetStore = useDatasetStore();
  // No need to make sure this only loads once, since the dataset store handles
  // making sure it's not loaded too many times.
  useEffect(() => {
    props.datasetIds.forEach((id) => {
      datasetStore.loadDataset(id);
    });
  });
  const statuses = props.datasetIds.map((id) =>
    datasetStore.getDatasetLoadStatus(id)
  );
  switch (getJointLoadStatus(statuses)) {
    case "loaded":
      return props.children();
    case "loading":
      return <p>Loading...</p>;
    default:
      return (
        <div>
          <p>Oops, something went wrong.</p>
          <Button onClick={() => window.location.reload()}>reload</Button>
        </div>
      );
  }
}

export default WithDatasets;
