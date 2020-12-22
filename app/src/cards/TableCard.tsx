import React from "react";
import TableChart from "../charts/TableChart";
import { Alert } from "@material-ui/lab";
import CardWrapper from "./CardWrapper";
import useDatasetStore from "../data/useDatasetStore";
import { getDependentDatasets, MetricId } from "../data/variableProviders";
import { MetricQuery } from "../data/MetricQuery";
import { Fips } from "../utils/madlib/Fips";
import {
  Breakdowns,
  BreakdownVar,
  BREAKDOWN_VAR_DISPLAY_NAMES,
} from "../data/Breakdowns";

function TableCard(props: {
  fips: Fips;
  breakdownVar: BreakdownVar;
  metricIds: MetricId[];
  nonstandardizedRace: boolean /* TODO- ideally wouldn't go here, could be calculated based on dataset */;
}) {
  const datasetStore = useDatasetStore();

  // TODO need to handle race categories standard vs non-standard for covid vs
  // other demographic.
  const breakdowns = Breakdowns.forFips(props.fips).addBreakdown(
    props.breakdownVar,
    props.nonstandardizedRace
  );

  const query = new MetricQuery(props.metricIds, breakdowns);

  const datasetIds = getDependentDatasets(props.metricIds);

  return (
    <CardWrapper
      queries={[query]}
      datasetIds={datasetIds}
      titleText={`${
        BREAKDOWN_VAR_DISPLAY_NAMES[props.breakdownVar]
      } in ${props.fips.getFullDisplayName()}`}
    >
      {() => {
        const queryResponse = datasetStore.getMetrics(query);
        const dataset = queryResponse.data.filter(
          (row) =>
            !["Not Hispanic or Latino", "Total"].includes(
              row.race_and_ethnicity
            )
        );

        return (
          <>
            {queryResponse.showErrorMessage(props.metricIds) && (
              <Alert severity="warning">
                Missing data means that we don't know the full story.
              </Alert>
            )}
            {!queryResponse.isError() && (
              <TableChart
                data={dataset}
                fields={[props.breakdownVar as string].concat(props.metricIds)}
              />
            )}
          </>
        );
      }}
    </CardWrapper>
  );
}

export default TableCard;
