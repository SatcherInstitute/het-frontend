import React from "react";
import { Paper } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { Row } from "../../utils/DatasetTypes";
import { withStyles, Theme, createStyles } from "@material-ui/core/styles";

export interface Field {
  readonly name: string;
  readonly displayName: string;
}

const StyledTableHeader = withStyles((theme: Theme) =>
  createStyles({
    head: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
    },
  })
)(TableCell);

function TableChart(props: { data: Row[]; fields?: Field[] }) {
  let tableColumns: Field[] | undefined = undefined;
  if (props.data.length > 0) {
    tableColumns =
      props.fields === undefined
        ? Object.keys(props.data[0]).map((name) => ({
            name: name,
            displayName: name,
          }))
        : props.fields;
  }

  return (
    <>
      {!tableColumns ? (
        <h1>No Data provided</h1>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {tableColumns.map((field, i) => (
                  <StyledTableHeader key={i}>
                    {field.displayName}
                  </StyledTableHeader>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {props.data.map((row, i) => (
                <TableRow key={i}>
                  {tableColumns!.map((field, j) => (
                    <TableCell key={j}>
                      {Number.isInteger(row[field.name])
                        ? row[field.name].toLocaleString("en")
                        : row[field.name]}
                      {field.name.endsWith("_pct") && <span>%</span>}
                      {field.name.endsWith("_pct_of_geo") && <span>%</span>}
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
