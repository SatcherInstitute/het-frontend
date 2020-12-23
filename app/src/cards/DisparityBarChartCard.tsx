import React, { useState } from "react";
import DisparityBarChart from "../charts/DisparityBarChart";
import styles from "./Card.module.scss";
import { Alert } from "@material-ui/lab";
import { CardContent } from "@material-ui/core";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import SimpleHorizontalBarChart from "../charts/SimpleHorizontalBarChart";
import { Fips } from "../utils/madlib/Fips";
import {
  Breakdowns,
  BreakdownCol,
  BREAKDOWN_VAR_DISPLAY_NAMES,
} from "../data/Breakdowns";
import useDatasetStore from "../data/useDatasetStore";
import { getDependentDatasets, MetricId } from "../data/variableProviders";
import MetricQuery from "../data/MetricQuery";
import { MetricConfig, VariableConfig } from "../data/MetricConfig";
import { POPULATION_VARIABLE_CONFIG } from "../data/MetricConfig";

import CardWrapper from "./CardWrapper";

const VALID_METRIC_TYPES = ["pct_share", "per100k"];

function getInitalMetricConfig(variableConfig: VariableConfig) {
  return variableConfig.metrics["pct_share"]
    ? variableConfig.metrics["pct_share"]
    : variableConfig.metrics["per100k"];
}

function DisparityBarChartCard(props: {
  key: string;
  breakdownCol: BreakdownCol;
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
  const breakdowns = Breakdowns.forFips(props.fips).andRace(
    props.nonstandardizedRace
  );

  const metricIds = Object.values(props.variableConfig.metrics).map(
    (metricConfig: MetricConfig) => metricConfig.metricId
  );
  const metrics: MetricId[] = [...metricIds, "population", "population_pct"];

  const query = new MetricQuery(metrics, breakdowns);

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
        BREAKDOWN_VAR_DISPLAY_NAMES[props.breakdownCol]
      } in ${props.fips.getFullDisplayName()}`}
    >
      {() => {
        const dataset = datasetStore
          .getMetrics(query)
          .filter(
            (row) =>
              !["Not Hispanic or Latino", "Total"].includes(
                row.race_and_ethnicity
              )
          );
        return (
          <>
            <CardContent className={styles.Breadcrumbs}>
              {props.breakdownCol !==
                ("race_and_ethnicity" as BreakdownCol) && (
                <Alert severity="warning">
                  Missing data means that we don't know the full story.
                </Alert>
              )}
              {props.breakdownCol === ("race_and_ethnicity" as BreakdownCol) &&
                validDisplayMetricConfigs.length > 1 && (
                  <ToggleButtonGroup
                    value={metricConfig.type}
                    exclusive
                    onChange={(e, metricType) => {
                      if (metricType !== null) {
                        setMetricConfig(
                          props.variableConfig.metrics[
                            metricType
                          ] as MetricConfig
                        );
                      }
                    }}
                  >
                    {validDisplayMetricConfigs.map((metricConfig) => (
                      <ToggleButton value={metricConfig.type}>
                        {metricConfig.type === "pct_share" &&
                          props.variableConfig.variableDisplayName +
                            " and Population"}
                        {metricConfig.type === "per100k" &&
                          "per 100,000 people"}
                      </ToggleButton>
                    ))}
                  </ToggleButtonGroup>
                )}
            </CardContent>
            <CardContent className={styles.Breadcrumbs}>
              {props.breakdownCol ===
                ("race_and_ethnicity" as BreakdownCol) && (
                <>
                  {metricConfig.type === "pct_share" && (
                    <DisparityBarChart
                      data={dataset}
                      thickMetric={POPULATION_VARIABLE_CONFIG.metrics.pct_share}
                      thinMetric={metricConfig}
                      breakdownCol={props.breakdownCol}
                      metricDisplayName={metricConfig.shortVegaLabel}
                    />
                  )}
                  {metricConfig.type === "per100k" && (
                    <SimpleHorizontalBarChart
                      data={dataset}
                      breakdownCol={props.breakdownCol}
                      metric={metricConfig}
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
