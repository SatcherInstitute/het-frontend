import React from "react";
import TableChart from "../charts/TableChart";
import Card from "@material-ui/core/Card";
import cardStyles from "./Card.module.scss";
import { Row } from "../../utils/DatasetTypes";
import { Alert } from "@material-ui/lab";

function TableCard(props: { data: Row[]; fields?: string[] }) {
  // TODO- would be nice if the header row didn't scroll with content
  return (
    <>
      {props.data.length === 0 && (
        <Alert severity="warning">
          Missing data means that we don't know the full story.
        </Alert>
      )}
      {props.data.length > 0 && (
        <Card raised={true} className={cardStyles.ChartCard}>
          <div className={cardStyles.TableContainer}>
            <TableChart data={props.data} fields={props.fields} />
          </div>
        </Card>
      )}
    </>
  );
}

export default TableCard;
