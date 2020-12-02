import React, { useState, useEffect } from "react";
import { Paper, Grid } from "@material-ui/core";
import UsaChloroplethMap from "../charts/UsaChloroplethMap";
import TableChart from "../charts/TableChart";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import styles from "./Report.module.scss";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import WithDatasets from "../../utils/WithDatasets";
import useDatasetStore from "../../utils/useDatasetStore";
import variableProviders, { VariableId } from "../../utils/variableProviders";
import { Breakdowns } from "../../utils/Breakdowns";
import VariableProvider from "../../utils/variables/VariableProvider";
import { ALL_RACES_DISPLAY_NAME, STATE_FIPS_MAP } from "../../utils/Fips";
import Alert from "@material-ui/lab/Alert";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";

interface Geo {
  fips: number;
  name: string;
}

function Map(props: {
  fipsGeo: number;
  data: Record<string, any>[];
  updateGeoCallback: Function;
}) {
  function getStateGeoFromPropFips() {
    return props.fipsGeo === 0
      ? undefined
      : { fips: props.fipsGeo, name: STATE_FIPS_MAP[props.fipsGeo] };
  }

  console.log(props.fipsGeo);

  useEffect(() => {
    console.log("use effect props.fipsGeo");
    setState(getStateGeoFromPropFips());
  }, [getStateGeoFromPropFips, props.fipsGeo]);

  const [state, setState] = useState<Geo | undefined>(
    getStateGeoFromPropFips()
  );
  const [county, setCounty] = useState<Geo | undefined>();

  useEffect(() => {
    props.updateGeoCallback(state ? state.fips : 0);
    console.log("use effect state");
  }, [props, state]);

  const signalListeners: any = {
    click: (...args: any) => {
      // Is this a county or a state??
      const clickedData = args[1];
      console.log(clickedData);
      if (clickedData.id.length == 2) {
        setState({ fips: clickedData.id, name: clickedData.properties.name });
      } else {
        setCounty({ fips: clickedData.id, name: clickedData.properties.name });
      }
    },
  };

  let dataset =
    state === undefined
      ? props.data
      : props.data.filter((r) => r.state_fips_code === state.fips.toString());

  return (
    <div>
      <Breadcrumbs aria-label="breadcrumb">
        {state && (
          <Link
            color="inherit"
            onClick={() => {
              setState(undefined);
              setCounty(undefined);
            }}
          >
            United States
          </Link>
        )}
        {!state && <Typography color="textPrimary">United States</Typography>}
        {state && county && (
          <Link
            color="inherit"
            onClick={() => {
              setCounty(undefined);
            }}
          >
            {state.name}
          </Link>
        )}
        {state && !county && (
          <Typography color="textPrimary">{state.name}</Typography>
        )}
        {county && <Typography color="textPrimary">{county.name}</Typography>}
      </Breadcrumbs>

      <UsaChloroplethMap
        signalListeners={signalListeners}
        varField={"diabetes_count"}
        legendTitle="variableProvider.variableName"
        data={dataset}
        stateFips={state ? state.fips : undefined}
        countyFips={county ? county.fips : undefined}
        maxGeoSelection={1}
      />
      {county === undefined && <TableChart data={dataset} />}
      {county !== undefined && (
        <Alert severity="error">
          This dataset does not provide county level data
        </Alert>
      )}
    </div>
  );
}

function CompareMapNavReport(props: {
  fipsGeo1: number;
  fipsGeo2: number;
  updateGeo1Callback: Function;
  updateGeo2Callback: Function;
}) {
  const datasetStore = useDatasetStore();
  const variableProvider = variableProviders["diabetes_count"];
  const requiredDatasets = VariableProvider.getUniqueDatasetIds([
    variableProvider,
  ]);

  console.log(props.fipsGeo1);

  return (
    <WithDatasets datasetIds={requiredDatasets}>
      {() => {
        let dataset = variableProvider.getData(
          datasetStore.datasets,
          Breakdowns.byState()
        );

        return (
          <Grid container spacing={1} alignItems="flex-start">
            <Grid item xs={6}>
              <Map
                data={dataset}
                fipsGeo={props.fipsGeo1}
                updateGeoCallback={(e: number) => props.updateGeo1Callback(e)}
              />
            </Grid>
            <Grid item xs={6}>
              <Map
                data={dataset}
                fipsGeo={props.fipsGeo2}
                updateGeoCallback={(e: number) => props.updateGeo2Callback(e)}
              />
            </Grid>
          </Grid>
        );
      }}
    </WithDatasets>
  );
}

export default CompareMapNavReport;
