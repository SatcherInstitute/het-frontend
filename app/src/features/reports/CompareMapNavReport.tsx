import React, { useState, useEffect } from "react";
import { Grid } from "@material-ui/core";
import UsaChloroplethMap from "../charts/UsaChloroplethMap";
import TableChart from "../charts/TableChart";
import WithDatasets from "../../utils/WithDatasets";
import useDatasetStore from "../../utils/useDatasetStore";
import variableProviders from "../../utils/variableProviders";
import { Breakdowns } from "../../utils/Breakdowns";
import VariableProvider from "../../utils/variables/VariableProvider";
import { USA_FIPS, STATE_FIPS_MAP } from "../../utils/Fips";
import Alert from "@material-ui/lab/Alert";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";

interface Geo {
  fips: string;
  name: string;
}

function Map(props: {
  fipsGeo: string;
  data: Record<string, any>[];
  updateGeoCallback: Function;
}) {
  function getStateGeoFromPropFips() {
    return props.fipsGeo === USA_FIPS
      ? undefined
      : { fips: props.fipsGeo, name: STATE_FIPS_MAP[props.fipsGeo] };
  }

  const [state, setState] = useState<Geo | undefined>(
    getStateGeoFromPropFips()
  );
  const [county, setCounty] = useState<Geo | undefined>();

  useEffect(() => {
    props.updateGeoCallback(state ? state.fips : USA_FIPS);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  useEffect(() => {
    setState(getStateGeoFromPropFips());
    setCounty(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.fipsGeo]);

  const signalListeners: any = {
    click: (...args: any) => {
      // Is this a county or a state??
      const clickedData = args[1];
      console.log(clickedData);
      if (clickedData.id.length === 2) {
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
        legendTitle="Diabetes Count"
        data={dataset}
        hideLegend={state ? true : false}
        stateFips={state ? state.fips : undefined}
        countyFips={county ? county.fips : undefined}
      />
      {state !== undefined && (
        <Alert severity="error">
          This dataset does not provide county level data
        </Alert>
      )}
      {county === undefined && <TableChart data={dataset} />}
    </div>
  );
}

function CompareMapNavReport(props: {
  fipsGeo1: string;
  fipsGeo2: string;
  updateGeo1Callback: Function;
  updateGeo2Callback: Function;
}) {
  const datasetStore = useDatasetStore();
  const variableProvider = variableProviders["diabetes_count"];
  const requiredDatasets = VariableProvider.getUniqueDatasetIds([
    variableProvider,
  ]);

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
