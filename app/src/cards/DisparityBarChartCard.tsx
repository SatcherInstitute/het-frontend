import React, { useState } from "react";
import DisparityBarChart from "../charts/DisparityBarChart";
import styles from "./Card.module.scss";
import { Alert } from "@material-ui/lab";
import { CardContent } from "@material-ui/core";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import SimpleHorizontalBarChart from "../charts/SimpleHorizontalBarChart";
import { Fips } from "../utils/madlib/Fips";
import { METRIC_DISPLAY_NAMES } from "../utils/madlib/DisplayNames";
import useDatasetStore from "../data/useDatasetStore";
import {
  Breakdowns,
  BreakdownVar,
  BREAKDOWN_VAR_DISPLAY_NAMES,
} from "../data/Breakdowns";
import { getDependentDatasets, MetricId } from "../data/variableProviders";
import { MetricQuery } from "../data/MetricQuery";
import { MetricConfig, VariableConfig } from "../data/MetricConfig";

import CardWrapper from "./CardWrapper";

const VALID_METRIC_TYPES = ["pct_share", "per100k"];

function getInitalMetricConfig(variableConfig: VariableConfig) {
  return variableConfig.metrics["pct_share"]
    ? variableConfig.metrics["pct_share"]
    : variableConfig.metrics["per100k"];
}

function DisparityBarChartCard(props: {
  key: string;
  breakdownVar: BreakdownVar;
  variableConfig: VariableConfig;
  nonstandardizedRace: boolean /* TODO- ideally wouldn't go here, could be calculated based on dataset */;
  fips: Fips;
}) {
  const [metricConfig, setMetricConfig] = useState<MetricConfig>(
    getInitalMetricConfig(props.variableConfig)
  );

  const datasetStore = useDatasetStore();

  // TODO need to handle race categories standard vs non-standard for covid vs
  // other demographic.
  const breakdown = Breakdowns.forFips(props.fips).addBreakdown(
    props.breakdownVar,
    props.nonstandardizedRace
  );

  const metricIds = Object.values(props.variableConfig.metrics).map(
    (metricConfig: MetricConfig) => metricConfig.metricId
  );
  const metrics: MetricId[] = [...metricIds, "population", "population_pct"];

  const query = new MetricQuery(metrics, breakdown);

  // TODO - what if there are no valid types at all? What do we show?
  const validDisplayMetricConfigs: MetricConfig[] = Object.values(
    props.variableConfig.metrics
  ).filter((metricConfig) => VALID_METRIC_TYPES.includes(metricConfig.type));

  // TODO - we want to bold the breakdown name in the card title
  return (
    <CardWrapper
      datasetIds={getDependentDatasets(metrics)}
      queries={[query]}
      titleText={`${metricConfig.fullCardTitleName} by ${
        BREAKDOWN_VAR_DISPLAY_NAMES[props.breakdownVar]
      } in ${props.fips.getFullDisplayName()}`}
    >
      {() => {
        const queryResponse = datasetStore.getMetrics(query);
        console.log(queryResponse);
        const dataset = queryResponse.data
          ? queryResponse.data.filter(
              (row) =>
                !["Not Hispanic or Latino", "Total"].includes(
                  row.race_and_ethnicity
                )
            )
          : [];
        return (
          <>
            {queryResponse.isError() && (
              <CardContent className={styles.Breadcrumbs}>
                <Alert severity="warning">
                  Missing data means that we don't know the full story.
                </Alert>
              </CardContent>
            )}
            {!queryResponse.isError() && validDisplayMetricConfigs.length > 1 && (
              <CardContent className={styles.Breadcrumbs}>
                <ToggleButtonGroup
                  value={metricConfig.type}
                  exclusive
                  onChange={(e, metricType) => {
                    if (metricType !== null) {
                      setMetricConfig(
                        props.variableConfig.metrics[metricType] as MetricConfig
                      );
                    }
                  }}
                >
                  {validDisplayMetricConfigs.map((metricConfig) => (
                    <ToggleButton value={metricConfig.type}>
                      {metricConfig.type === "pct_share" &&
                        props.variableConfig.variableId + " and Population"}
                      {metricConfig.type === "per100k" && "per 100,000 people"}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </CardContent>
            )}

            <CardContent className={styles.Breadcrumbs}>
              {!queryResponse.isError() && (
                <>
                  {metricConfig.type === "pct_share" && (
                    <DisparityBarChart
                      data={dataset}
                      thickMeasure={"population_pct" as MetricId}
                      thickMeasureDisplayName={
                        METRIC_DISPLAY_NAMES["population_pct" as MetricId]
                      }
                      thinMeasure={metricConfig.metricId}
                      thinMeasureDisplayName={metricConfig.shortVegaLabel}
                      breakdownVar={props.breakdownVar as BreakdownVar}
                      metricDisplayName={metricConfig.shortVegaLabel}
                    />
                  )}
                  {metricConfig.type === "per100k" && (
                    <SimpleHorizontalBarChart
                      data={dataset}
                      breakdownVar={props.breakdownVar as BreakdownVar}
                      measure={metricConfig.metricId}
                      measureDisplayName={metricConfig.shortVegaLabel}
                      showLegend={false}
                    />
                  )}
                </>
              )}
            </CardContent>
          </>
        );
      }}
    </CardWrapper>
  );
}
export default DisparityBarChartCard;
