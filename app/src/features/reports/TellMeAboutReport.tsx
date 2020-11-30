import React, { useState, useEffect } from "react";
import { Paper, Grid } from "@material-ui/core";
import UsaChloroplethMap from "../charts/UsaChloroplethMap";
import TwoVarBarChart from "../charts/TwoVarBarChart";
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
import variableProviders, {
  VariableProvider,
} from "../../utils/variableProviders";
import { Breakdowns } from "../../utils/Breakdowns";

interface County {
  id: string;
  name: string;
  value: number;
}

function CountyLevelTable(countyList: County[], valueName: string) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>{valueName}</TableCell>
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

function TellMeAboutReport(props: { variable: string }) {
  const datasetStore = useDatasetStore();
  const variableProvider = variableProviders[props.variable];
  let requiredDatasets = VariableProvider.getUniqueDatasetIds([
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
          value: clickedData[props.variable],
        };
        setCountyList([...countyList, newCountyDatum]);
      }
    },
    shiftClick: () => {
      setCountyList([]);
    },
  };

  // TODO - filter from the dataset provider instead of here
  const RACES = [
    "All",
    "American Indian/Alaskan Native, Non-Hispanic",
    "Asian, Non-Hispanic",
    "Black, Non-Hispanic",
    "Hispanic",
    "Other race, Non-Hispanic",
    "White, Non-Hispanic",
  ];

  console.log(datasetStore.datasets);

  return (
    <WithDatasets datasetIds={requiredDatasets}>
      {() => (
        <Grid container spacing={1} alignItems="flex-start">
          <Grid item xs={12}>
            <TwoVarBarChart
              data={variableProvider.getData(
                datasetStore.datasets,
                Breakdowns.national().andRace()
              )}
              measure={variableProvider.variableId}
              compareMeasure="population"
            />
          </Grid>
        </Grid>
      )}
    </WithDatasets>
  );
}

export default TellMeAboutReport;
