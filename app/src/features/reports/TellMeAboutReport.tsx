import React, { useState, useEffect } from "react";
import { Paper, Grid } from "@material-ui/core";
import UsaChloroplethMap from "../charts/UsaChloroplethMap";
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
import { MadLib } from "../../utils/MadLibs";
import WithDatasets from "../../utils/WithDatasets";
import useDatasetStore from "../../utils/useDatasetStore";
import variableProviders, {
  VariableProvider,
} from "../../utils/variableProviders";
import { Breakdowns } from "../../utils/Breakdowns";

/*
Corresponds to:
Tell me about {0:"copd", 1:"diabetes"} in USA ?
*/

interface County {
  id: string;
  name: string;
  value: number;
}

function CountyLevelTable(countyList: County[]) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Cases</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {countyList.map((county: County) => (
            <TableRow key={county.name}>
              <TableCell>{county.name}</TableCell>
              <TableCell>{county.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function TellMeAboutReport(props: { madlib: MadLib; variable: string }) {
  const datasetStore = useDatasetStore();
  const variableProvider = variableProviders[props.variable];
  console.log("variableProvider", variableProvider);
  const requiredDatasets = VariableProvider.getUniqueDatasetIds([
    variableProvider,
  ]);

  const [countyList, setCountyList] = useState<County[]>([]);
  const [race, setRace] = useState<string>("All");

  useEffect(() => {
    setCountyList([]);
    setRace("All");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.variable]);

  const signalListeners: any = {
    click: (...args: any) => {
      const clickedData = args[1];
      let countyIds = countyList.map((datum: County) => datum.id);
      if (!countyIds.includes(args[1].id)) {
        console.log(clickedData);
        let newCountyDatum = {
          id: clickedData.id,
          name: clickedData.properties.name,
          value: clickedData[FIELDS[props.variable].field],
        };
        setCountyList([...countyList, newCountyDatum]);
      }
    },
    shiftClick: () => {
      setCountyList([]);
    },
  };

  const FIELDS: Record<string, any> = {
    //  "COPD": { field: "COPD_YES", legend: "# COPD cases" },
    diabetes_count: { field: "diabetes_count", legend: "# Diabetes cases" },
  };

  const RACES = [
    "All",
    "American Indian/Alaskan Native, Non-Hispanic",
    "Asian, Non-Hispanic",
    "Black, Non-Hispanic",
    "Hispanic",
    "Other race, Non-Hispanic",
    "White, Non-Hispanic",
  ];

  return (
    <WithDatasets datasetIds={requiredDatasets}>
      {() => (
        <Grid container spacing={1} alignItems="flex-start">
          <Grid item xs={12} sm={12} md={6}>
            Filter results by race:
            <FormControl>
              <Select
                name="raceSelect"
                value={race}
                onChange={(e) => {
                  setRace(e.target.value as string);
                  setCountyList([]);
                }}
              >
                {RACES.map((race) => (
                  <MenuItem key={race} value={race}>
                    {race}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <UsaChloroplethMap
              signalListeners={signalListeners}
              varField={FIELDS[props.variable].field}
              legendTitle={FIELDS[props.variable].legend}
              filterVar="race"
              filterValue={race}
              data={variableProvider.getData(
                datasetStore.datasets,
                Breakdowns.byState().andRace()
              )}
              dataUrl="tmp/brfss.json"
              operation="sum"
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} className={styles.PaddedGrid}>
            <p>
              Click on some states to see data in this table, shift click on map
              to reset.
            </p>
            {CountyLevelTable(countyList)}
          </Grid>
        </Grid>
      )}
    </WithDatasets>
  );
}

export default TellMeAboutReport;
