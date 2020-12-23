import React from "react";
import { Paper } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { Row } from "../data/DatasetTypes";
import WarningRoundedIcon from "@material-ui/icons/WarningRounded";
import { BreakdownVar, BREAKDOWN_VAR_DISPLAY_NAMES } from "../data/Breakdowns";
import { MetricConfig } from "../data/MetricConfig";

// Prints a formatted version of a field value based on the type specified by the field name
function formatFieldValue(nameOfField: string, value: any): string {
  if (value === null || value === undefined) {
    return "";
  }
  const formattedValue =
    typeof value === "number" ? value.toLocaleString("en") : value;
  const suffix =
    nameOfField.endsWith("_pct") || nameOfField.endsWith("_pct_of_geo")
      ? "%"
      : "";
  return `${formattedValue}${suffix}`;
}

function TableChart(props: {
  data: Row[];
  breakdownVar: BreakdownVar;
  metrics: MetricConfig[];
}) {
  return (
    <>
      {!(props.data.length > 0 || props.metrics.length > 0) ? (
        <h1>No Data provided</h1>
      ) : (
        <TableContainer component={Paper} style={{ maxHeight: "500px" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>
                  {BREAKDOWN_VAR_DISPLAY_NAMES[props.breakdownVar]}
                </TableCell>
                {props.metrics.map((metricConfig, i) => (
                  <TableCell key={i}>
                    {metricConfig.fullCardTitleName}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {props.data.map((row, i) => (
                <TableRow key={i}>
                  <TableCell>{row[props.breakdownVar]}</TableCell>
                  {props.metrics.map((metricConfig, j) => (
                    <TableCell key={j}>
                      {formatFieldValue(
                        metricConfig.metricId,
                        row[metricConfig.metricId]
                      )}
                      {(row[metricConfig.metricId] === null ||
                        row[metricConfig.metricId] === undefined) && (
                        <WarningRoundedIcon />
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
}

export default TableChart;
