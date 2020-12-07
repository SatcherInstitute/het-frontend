import React from "react";
import { VariableId } from "../../utils/variableProviders";
import TwoVarBarChart from "../charts/TwoVarBarChart";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import styles from "./Card.module.scss";
import { Alert } from "@material-ui/lab";
import { Row } from "../../utils/DatasetTypes";
import {
  LinkWithStickyParams,
  DATASET_PRE_FILTERS,
  DATA_CATALOG_PAGE_LINK,
} from "../../utils/urlutils";

function DisparityBarChartCard(props: {
  dataset?: Row[];
  datasetIds: string[];
  variableId: VariableId;
  variableDisplayName: string;
  breakdownVar: string;
  breakdownVarDisplayName: string;
}) {
  return (
    <Card raised={true} className={styles.ChartCard}>
      <Typography gutterBottom className={styles.CardHeader}>
        Disparities in {props.variableDisplayName} for{" "}
        <b>{props.breakdownVarDisplayName}</b>
      </Typography>
      {!props.dataset && (
        <Alert severity="warning">
          Missing data means that we don't know the full story.
        </Alert>
      )}
      {props.dataset && (
        <>
          <TwoVarBarChart
            data={props.dataset}
            thickMeasure="population_pct"
            thinMeasure={props.variableId}
            thickMeasureDisplayName="Population %"
            thinMeasureDisplayName={props.variableDisplayName + " as % of Geo"}
            breakdownVar={props.breakdownVar}
            breakdownVarDisplayName={props.breakdownVarDisplayName}
          />
          <LinkWithStickyParams
            to={`${DATA_CATALOG_PAGE_LINK}?${DATASET_PRE_FILTERS}=${props.datasetIds.join(
              ","
            )}`}
          >
            View Data Sources
          </LinkWithStickyParams>
        </>
      )}
    </Card>
  );
}
export default DisparityBarChartCard;
