import React from "react";
import WithDatasets from "../../utils/WithDatasets";
import { LinkWithStickyParams } from "../../utils/urlutils";
import VerticalGroupedBarChart from "../charts/VerticalGroupedBarChart";
import StackedBarChart from "../charts/StackedBarChart";
import { Button, Grid } from "@material-ui/core";
import useDatasetStore from "../../utils/useDatasetStore";
import variableProviders, {
  VariableProvider,
} from "../../utils/variableProviders";
import { Breakdowns } from "../../utils/DatasetTypes";

function getUniqueDatasetIds(providers: VariableProvider[]): string[] {
  return Array.from(new Set(providers.map((p) => p.datasetIds).flat()));
}

const ByStateAndRace: Breakdowns = {
  geography: "state",
  demographic: "race",
};

const ByRace: Breakdowns = {
  geography: "national",
  demographic: "race",
};

function CompareStatesForVariableReport(props: {
  state1: string;
  state2: string;
  variable: string;
}) {
  const datasetStore = useDatasetStore();
  const variableProvider = variableProviders[props.variable];
  const acsProvider = variableProviders["population_pct"];
  const selectedStates = [props.state1, props.state2];
  const requiredDatasets = getUniqueDatasetIds([variableProvider, acsProvider]);
  return (
    <WithDatasets datasetIds={requiredDatasets}>
      {() => (
        <>
          <Grid container spacing={1} alignItems="flex-start">
            <Grid item xs={12} sm={12} md={6}>
              <strong>{variableProvider.description}</strong>
              <VerticalGroupedBarChart
                data={variableProvider
                  .getData(datasetStore.datasets, ByStateAndRace)
                  .concat(
                    variableProvider.getData(datasetStore.datasets, ByRace)
                  )
                  .filter((r) => selectedStates.includes(r.state_name))}
                measure={variableProvider.variableId}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <strong>{acsProvider.description}</strong>
              <StackedBarChart
                data={acsProvider
                  .getData(datasetStore.datasets, ByStateAndRace)
                  .concat(acsProvider.getData(datasetStore.datasets, ByRace))
                  .filter((r) => selectedStates.includes(r.state_name))}
                measure={acsProvider.variableId}
              />
            </Grid>
          </Grid>
          <Button>
            <LinkWithStickyParams
              to={`/datacatalog?dpf=${requiredDatasets.join(",")}`}
            >
              View Data Sources
            </LinkWithStickyParams>
          </Button>
        </>
      )}
    </WithDatasets>
  );
}

export default CompareStatesForVariableReport;
