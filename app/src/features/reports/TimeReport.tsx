import React from "react";
import { Grid } from "@material-ui/core";
import { MadLib, PhraseSelections } from "../../utils/MadLibs";
import LineChart from "../charts/LineChart";

function TimeReport() {
  return (
    <Grid container spacing={1} alignItems="flex-start">
      <Grid item xs={12}>
        <LineChart />
      </Grid>
    </Grid>
  );
}

export default TimeReport;
