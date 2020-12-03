import React, { useState, useEffect } from "react";
import { Grid } from "@material-ui/core";
import UsaChloroplethMap from "../charts/UsaChloroplethMap";
import TableChart from "../charts/TableChart";
import WithDatasets from "../../utils/WithDatasets";
import useDatasetStore from "../../utils/useDatasetStore";
import variableProviders from "../../utils/variableProviders";
import { Breakdowns } from "../../utils/Breakdowns";
import VariableProvider from "../../utils/variables/VariableProvider";
import { USA_FIPS, USA_DISPLAY_NAME, STATE_FIPS_MAP } from "../../utils/Fips";
import Alert from "@material-ui/lab/Alert";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";

type UpdateGeoCallback = (message: string) => void;

function Map(props: {
  fipsGeo: string;
  data: Record<string, any>[];
  updateGeoCallback: UpdateGeoCallback;
}) {
  const [stateFips, setStateFips] = useState<string>(props.fipsGeo);
  const [countyFips, setCountyFips] = useState<string>();
  const [countyName, setCountyName] = useState<string>();

  useEffect(() => {
    props.updateGeoCallback(stateFips);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateFips]);

  useEffect(() => {
    setStateFips(props.fipsGeo);
    setCountyFips(undefined);
    setCountyName(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.fipsGeo]);

  const signalListeners: any = {
    click: (...args: any) => {
      // Is this a countyFips or a state??
      const clickedData = args[1];
      if (clickedData.id.length === 2) {
        setStateFips(clickedData.id);
      } else {
        setCountyFips(clickedData.id);
        setCountyName(clickedData.properties.name);
      }
    },
  };

  let dataset =
    stateFips === USA_FIPS
      ? props.data
      : props.data.filter((r) => r.state_fips_code === stateFips);

  // TODO - make the mouse turn into a pointer when you hover over
  return (
    <div>
      <Breadcrumbs aria-label="breadcrumb">
        {stateFips !== USA_FIPS && (
          <Link
            color="inherit"
            onClick={() => {
              setStateFips(USA_FIPS);
              setCountyFips(undefined);
              setCountyName(undefined);
            }}
          >
            {USA_DISPLAY_NAME}
          </Link>
        )}
        {!stateFips && (
          <Typography color="textPrimary">{USA_DISPLAY_NAME}</Typography>
        )}
        {stateFips && countyFips && (
          <Link
            color="inherit"
            onClick={() => {
              setCountyFips(undefined);
            }}
          >
            {STATE_FIPS_MAP[stateFips]}
          </Link>
        )}
        {stateFips && !countyFips && (
          <Typography color="textPrimary">
            {STATE_FIPS_MAP[stateFips]}
          </Typography>
        )}
        {countyFips && (
          <Typography color="textPrimary">{countyName}</Typography>
        )}
      </Breadcrumbs>

      <UsaChloroplethMap
        signalListeners={signalListeners}
        varField={"diabetes_count"}
        legendTitle="Diabetes Count"
        data={dataset}
        hideLegend={stateFips ? true : false}
        stateFips={stateFips === USA_FIPS ? undefined : stateFips}
        countyFips={countyFips ? countyFips : undefined}
      />
      {stateFips !== USA_FIPS && (
        <Alert severity="error">
          This dataset does not provide county level data
        </Alert>
      )}
      {countyFips === undefined && <TableChart data={dataset} />}
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
                updateGeoCallback={(e: string) => props.updateGeo1Callback(e)}
              />
            </Grid>
            <Grid item xs={6}>
              <Map
                data={dataset}
                fipsGeo={props.fipsGeo2}
                updateGeoCallback={(e: string) => props.updateGeo2Callback(e)}
              />
            </Grid>
          </Grid>
        );
      }}
    </WithDatasets>
  );
}

export default CompareMapNavReport;
