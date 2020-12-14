import React from "react";
import { Grid } from "@material-ui/core";
import TableCard from "../cards/TableCard";
import styles from "./Report.module.scss";
import { WithVariables } from "../data/WithLoadingOrErrorUI";
import useDatasetStore from "../data/useDatasetStore";
import { DropdownVarId } from "../utils/madlib/MadLibs";
import { VARIABLE_DISPLAY_NAMES } from "../utils/madlib/DisplayNames";
import { getDependentDatasets, VariableId } from "../data/variableProviders";
import { Breakdowns } from "../data/Breakdowns";
import { Fips } from "../utils/madlib/Fips";
import MapCard from "../cards/MapCard";
import Alert from "@material-ui/lab/Alert";
import VariableQuery from "../data/VariableQuery";

// TODO - remove hardcoded values when we have full support
const SUPPORTED_MADLIB_VARIABLES: DropdownVarId[] = ["diabetes"];
const METRIC_VARIABLES: Record<string, string> = {
  diabetes: "diabetes",
};

function VarGeoReport(props: {
  variable: DropdownVarId;
  fips: Fips;
  updateFipsCallback: Function;
  vertical?: boolean;
}) {
  // TODO Remove hard coded fail safe value
  const variableId: VariableId = SUPPORTED_MADLIB_VARIABLES.includes(
    props.variable
  )
    ? (METRIC_VARIABLES[props.variable] as VariableId)
    : ("diabetes" as VariableId);

  const datasetStore = useDatasetStore();

  const geoFilteredBreakdowns = Breakdowns.forFips(props.fips).andRace();
  const geoFilteredQuery = new VariableQuery(variableId, geoFilteredBreakdowns);

  return (
    <>
      {!SUPPORTED_MADLIB_VARIABLES.includes(props.variable) && (
        <Grid container xs={12} spacing={1} justify="center">
          <Grid item xs={5}>
            <Alert severity="error">Data not currently available</Alert>
          </Grid>
        </Grid>
      )}
      {SUPPORTED_MADLIB_VARIABLES.includes(props.variable) && (
        <Grid container spacing={1} alignItems="flex-start">
          <Grid
            item
            xs={12}
            sm={12}
            md={props.vertical ? 12 : 6}
            className={styles.PaddedGrid}
          >
            <MapCard
              variable={"diabetes"}
              fips={props.fips}
              updateFipsCallback={(fips: Fips) => {
                props.updateFipsCallback(fips);
              }}
              showCounties={props.fips.isUsa() ? false : true}
              nonstandardizedRace={false}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={props.vertical ? 12 : 6}
            className={styles.PaddedGrid}
          >
            <WithVariables queries={[geoFilteredQuery]}>
              {() => (
                <TableCard
                  data={datasetStore.getVariables(geoFilteredQuery)}
                  datasetIds={getDependentDatasets([variableId])}
                  fields={["race_and_ethnicity", variableId]}
                />
              )}
            </WithVariables>
          </Grid>
        </Grid>
      )}
    </>
  );
}

export default VarGeoReport;
