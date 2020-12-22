import React, { useState } from "react";
import UsaChloroplethMap from "../charts/UsaChloroplethMap";
import { Fips } from "../utils/madlib/Fips";
import Alert from "@material-ui/lab/Alert";
import Divider from "@material-ui/core/Divider";
import { CardContent } from "@material-ui/core";
import styles from "./Card.module.scss";
import MenuItem from "@material-ui/core/MenuItem";
import MapBreadcrumbs from "./MapBreadcrumbs";
import CardWrapper from "./CardWrapper";
import useDatasetStore from "../data/useDatasetStore";
import { getDependentDatasets } from "../data/variableProviders";
import { MetricQuery } from "../data/MetricQuery";
import { MetricConfig } from "../data/MetricConfig";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Menu from "@material-ui/core/Menu";
import { Grid } from "@material-ui/core";
import { Breakdowns, BreakdownVar } from "../data/Breakdowns";

function MapCard(props: {
  fips: Fips;
  metricConfig: MetricConfig;
  nonstandardizedRace: boolean /* TODO- ideally wouldn't go here, could be calculated based on dataset */;
  updateFipsCallback: (fips: Fips) => void;
  enableFilter?: boolean;
  currentBreakdown: BreakdownVar | "all";
}) {
  const signalListeners: any = {
    click: (...args: any) => {
      const clickedData = args[1];
      props.updateFipsCallback(new Fips(clickedData.id));
    },
  };

  // TODO - make sure the legends are all the same
  // TODO - pull these from the data itself
  const RACES = props.nonstandardizedRace
    ? [
        "Total",
        "American Indian and Alaska Native alone",
        "American Indian and Alaska Native alone (Non-Hispanic)",
        "Asian alone",
        "Asian alone (Non-Hispanic)",
        "Black or African American alone",
        "Black or African American alone (Non-Hispanic)",
        "Hispanic or Latino",
        "Native Hawaiian and Other Pacific Islander alone",
        "Native Hawaiian and Other Pacific Islander alone (Non-Hispanic)",
        "Some other race alone",
        "Some other race alone (Non-Hispanic)",
        "Two or more races",
        "Two or more races (Non-Hispanic)",
        "White alone",
        "White alone (Non-Hispanic)",
      ]
    : [
        "American Indian/Alaskan Native, Non-Hispanic",
        "Asian, Non-Hispanic",
        "Black, Non-Hispanic",
        "Hispanic",
        "Other race, Non-Hispanic",
        "White, Non-Hispanic",
      ];

  const [breakdownFilter, setBreakdownFilter] = useState<string>(RACES[0]);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const datasetStore = useDatasetStore();

  const raceBreakdown = Breakdowns.byState().andRace(props.nonstandardizedRace);
  const ageBreakdown = Breakdowns.byState().andAge();
  const sexBreakdown = Breakdowns.byState().andGender();

  const raceQuery = new MetricQuery(props.metricConfig.metricId, raceBreakdown);
  const ageQuery = new MetricQuery(props.metricConfig.metricId, ageBreakdown);
  const sexQuery = new MetricQuery(props.metricConfig.metricId, sexBreakdown);

  let queries = [];
  if (
    props.currentBreakdown === "all" ||
    props.currentBreakdown === "race_and_ethnicity"
  ) {
    queries.push(raceQuery);
  }
  if (props.currentBreakdown === "all" || props.currentBreakdown === "age") {
    queries.push(ageQuery);
  }
  if (props.currentBreakdown === "all" || props.currentBreakdown === "sex") {
    queries.push(sexQuery);
  }

  let query = raceQuery;

  return (
    <CardWrapper
      queries={queries}
      datasetIds={getDependentDatasets([props.metricConfig.metricId])}
      titleText={`${
        props.metricConfig.fullCardTitleName
      } in ${props.fips.getFullDisplayName()}`}
    >
      {() => {
        const queryResponse = datasetStore.getMetrics(query);
        const dataset = queryResponse.data.filter(
          (row) => row.race_and_ethnicity !== "Not Hispanic or Latino"
        );

        let mapData = dataset.filter(
          (r) =>
            r[props.metricConfig.metricId] !== undefined &&
            r[props.metricConfig.metricId] !== null
        );
        if (!props.fips.isUsa()) {
          // TODO - this doesn't consider county level data
          mapData = mapData.filter((r) => r.state_fips === props.fips.code);
        }
        if (props.enableFilter) {
          mapData = mapData.filter(
            (r) => r.race_and_ethnicity === breakdownFilter
          );
        }

        return (
          <>
            <CardContent className={styles.SmallMarginContent}>
              <MapBreadcrumbs
                fips={props.fips}
                updateFipsCallback={props.updateFipsCallback}
              />
            </CardContent>

            {props.enableFilter && (
              <>
                <Divider />
                <CardContent
                  className={styles.SmallMarginContent}
                  style={{ textAlign: "left" }}
                >
                  <Grid container>
                    <Grid item style={{ lineHeight: "64px", fontSize: "20px" }}>
                      Filtered by:
                    </Grid>
                    <Grid item>
                      <List component="nav" aria-label="Device settings">
                        <ListItem
                          button
                          aria-haspopup="true"
                          aria-controls="lock-menu"
                          aria-label="when device is locked"
                          onClick={(event: React.MouseEvent<HTMLElement>) =>
                            setAnchorEl(event.currentTarget)
                          }
                        >
                          <ListItemText primary={breakdownFilter} />
                        </ListItem>
                      </List>
                      <Menu
                        id="lock-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={() => {
                          setAnchorEl(null);
                        }}
                      >
                        {(props.currentBreakdown === "age" ||
                          props.currentBreakdown === "all") && (
                          <MenuItem disabled={true}>Age [unavailable]</MenuItem>
                        )}
                        {(props.currentBreakdown === "sex" ||
                          props.currentBreakdown === "all") && (
                          <MenuItem disabled={true}>Sex [unavailable]</MenuItem>
                        )}
                        {(props.currentBreakdown === "race_and_ethnicity" ||
                          props.currentBreakdown === "all") && (
                          <>
                            <MenuItem disabled={true}>Races</MenuItem>
                            {RACES.map((option, index) => (
                              <MenuItem
                                key={option}
                                onClick={(e) => {
                                  setAnchorEl(null);
                                  setBreakdownFilter(option);
                                }}
                              >
                                {option}
                              </MenuItem>
                            ))}
                          </>
                        )}
                      </Menu>
                    </Grid>
                  </Grid>
                </CardContent>
              </>
            )}

            <Divider />
            <CardContent>
              {mapData.length !== 0 &&
                !props.fips.isUsa() /* TODO - don't hardcode */ && (
                  <Alert severity="warning">
                    This dataset does not provide county level data
                  </Alert>
                )}
              {queryResponse.isError() && (
                <Alert severity="error">No data available</Alert>
              )}
            </CardContent>
            <CardContent>
              {props.metricConfig && (
                <UsaChloroplethMap
                  signalListeners={signalListeners}
                  varField={props.metricConfig.metricId}
                  varFieldDisplayName={props.metricConfig.shortVegaLabel}
                  legendTitle={props.metricConfig.fullCardTitleName}
                  data={mapData}
                  hideLegend={!props.fips.isUsa()} // TODO - update logic here when we have county level data
                  showCounties={props.fips.isUsa() ? false : true}
                  fips={props.fips}
                />
              )}
            </CardContent>
          </>
        );
      }}
    </CardWrapper>
  );
}

export default MapCard;
