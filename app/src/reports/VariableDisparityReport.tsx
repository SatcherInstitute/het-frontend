import React, { useState, useEffect } from "react";
import { Grid } from "@material-ui/core";
import { VariableId } from "../data/variableProviders";
import {
  MetricToggle,
  VARIABLE_DISPLAY_NAMES,
  BREAKDOWN_VAR_DISPLAY_NAMES,
  BreakdownVar,
  shareOf,
  per100k,
  METRICS_FOR_VARIABLE,
} from "../utils/madlib/DisplayNames";
import DisparityBarChartCard from "../cards/DisparityBarChartCard";
import MapCard from "../cards/MapCard";
import TableCard from "../cards/TableCard";
import { DropdownVarId } from "../utils/madlib/MadLibs";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import Alert from "@material-ui/lab/Alert";
import { Fips } from "../utils/madlib/Fips";
import {
  METRIC_CONFIG,
  VariableConfig,
  MetricConfig,
} from "../data/MetricConfig";

const SUPPORTED_BREAKDOWNS: BreakdownVar[] = [
  "race_and_ethnicity",
  "age",
  "sex",
];

function VariableDisparityReport(props: {
  dropdownVarId: DropdownVarId;
  fips: Fips;
  updateFipsCallback: Function;
  vertical?: boolean;
}) {
  // TODO Remove hard coded fail safe value
  const [variableConfig, setVariableConfig] = useState<VariableConfig | null>(
    Object.keys(METRIC_CONFIG).includes(props.dropdownVarId)
      ? METRIC_CONFIG[props.dropdownVarId as string][0]
      : null
  );

  useEffect(() => {
    setVariableConfig(
      Object.keys(METRIC_CONFIG).includes(props.dropdownVarId)
        ? METRIC_CONFIG[props.dropdownVarId as string][0]
        : null
    );
  }, [props.dropdownVarId]);

  const fields: VariableId[] = [];
  if (variableConfig && variableConfig.metrics["per100k"]) {
    fields.push(variableConfig.metrics["per100k"].metricId as VariableId);
  }
  if (variableConfig && variableConfig.metrics["pct_share"]) {
    fields.push(variableConfig.metrics["pct_share"].metricId as VariableId);
  }

  const tableFields = variableConfig
    ? [...fields, "population" as VariableId, "population_pct" as VariableId]
    : [];
  const [breakdown, setBreakdown] = useState<BreakdownVar | "all">("all");

  return (
    <>
      {!variableConfig && (
        <Grid container xs={12} spacing={1} justify="center">
          <Grid item xs={5}>
            <Alert severity="error">Data not currently available</Alert>
          </Grid>
        </Grid>
      )}

      {variableConfig && (
        <Grid container spacing={1} justify="center">
          <Grid item xs={12}>
            <ToggleButtonGroup
              exclusive
              value={breakdown}
              onChange={(e, v) => {
                if (v !== null) {
                  setBreakdown(v);
                }
              }}
              aria-label="text formatting"
            >
              <ToggleButton value="all" key="all">
                All
              </ToggleButton>
              {SUPPORTED_BREAKDOWNS.map((breakdownVar) => (
                <ToggleButton value={breakdownVar} key={breakdownVar}>
                  {BREAKDOWN_VAR_DISPLAY_NAMES[breakdownVar]}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Grid>
          <Grid item xs={12}>
            {!!METRIC_CONFIG[props.dropdownVarId as string] &&
              METRIC_CONFIG[props.dropdownVarId as string].length > 1 && (
                <ToggleButtonGroup
                  exclusive
                  value={variableConfig.variableId}
                  onChange={(e, variableId) => {
                    if (
                      variableId !== null &&
                      METRIC_CONFIG[props.dropdownVarId]
                    ) {
                      setVariableConfig(
                        METRIC_CONFIG[props.dropdownVarId].find(
                          (variableConfig) =>
                            variableConfig.variableId === variableId
                        ) as VariableConfig
                      );
                    }
                  }}
                  aria-label="text formatting"
                >
                  {METRIC_CONFIG[props.dropdownVarId as string].map(
                    (variable: VariableConfig, key: number) => (
                      <ToggleButton value={variable.variableId} key={key}>
                        {variable.variableId}
                      </ToggleButton>
                    )
                  )}
                </ToggleButtonGroup>
              )}
          </Grid>
          <Grid item xs={props.vertical ? 12 : 6}>
            <MapCard
              metricConfig={variableConfig.metrics["per100k"] as MetricConfig}
              fips={props.fips}
              updateFipsCallback={(fips: Fips) => {
                props.updateFipsCallback(fips);
              }}
              enableFilter={props.fips.isUsa()}
              nonstandardizedRace={
                props.dropdownVarId === "covid" ? true : false
              }
            />
            <TableCard
              fips={props.fips}
              variableIds={tableFields}
              breakdownVar={"race_and_ethnicity" as BreakdownVar}
              nonstandardizedRace={
                props.dropdownVarId === "covid" ? true : false
              }
            />
          </Grid>
          <Grid item xs={props.vertical ? 12 : 6}>
            {SUPPORTED_BREAKDOWNS.map((breakdownVar) => (
              <>
                {" "}
                {(breakdown === "all" || breakdown === breakdownVar) && (
                  <DisparityBarChartCard
                    metricId={metric}
                    breakdownVar={breakdownVar as BreakdownVar}
                    nonstandardizedRace={
                      props.dropdownVarId === "covid" ? true : false
                    }
                    fips={props.fips}
                  />
                )}
              </>
            ))}
          </Grid>
        </Grid>
      )}
    </>
  );
}

export default VariableDisparityReport;
