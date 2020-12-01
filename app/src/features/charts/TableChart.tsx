import React from "react";
import { Paper, Grid } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { Row } from "../../utils/DatasetTypes";

function TableChart(props: { data: Row[]; columns?: string[] }) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {Object.keys(props.data[0])
              .filter(
                (columnName) =>
                  props.columns == undefined ||
                  props.columns.includes(columnName)
              )
              .map((columnName) => (
                <TableCell>{columnName}</TableCell>
              ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {props.data.map((row) => (
            <TableRow>
              {Object.keys(row)
                .filter(
                  (columnName) =>
                    props.columns == undefined ||
                    props.columns.includes(columnName)
                )
                .map((columnName) => (
                  <TableCell>
                    {Number.isInteger(row[columnName])
                      ? row[columnName].toLocaleString("en")
                      : row[columnName]}
                  </TableCell>
                ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default TableChart;
