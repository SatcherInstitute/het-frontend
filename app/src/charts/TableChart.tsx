import React from "react";
import { Paper } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { Row } from "../data/DatasetTypes";
import { withStyles, Theme, createStyles } from "@material-ui/core/styles";
import {
  getFieldDisplayName,
  formatFieldValue,
} from "../utils/madlib/DisplayNames";
import WarningRoundedIcon from "@material-ui/icons/WarningRounded";

const StyledTableHeader = withStyles((theme: Theme) =>
  createStyles({
    head: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
    },
  })
)(TableCell);

function TableChart(props: { data: Row[]; fields?: string[] }) {
  const tableColumns: string[] | undefined =
    !props.fields && props.data.length > 0
      ? Object.keys(props.data[0])
      : props.fields;

  return (
    <>
      {!tableColumns ? (
        <h1>No Data provided</h1>
      ) : (
        <TableContainer component={Paper} style={{ maxHeight: "500px" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {tableColumns.map((field, i) => (
                  <StyledTableHeader key={i}>
                    {getFieldDisplayName(field)}
                  </StyledTableHeader>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {props.data.map((row, i) => (
                <TableRow key={i}>
                  {tableColumns.map((field, j) => (
                    <TableCell key={j}>
                      {formatFieldValue(field, row[field])}
                      {!row[field] && row[field] !== 0 && (
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
