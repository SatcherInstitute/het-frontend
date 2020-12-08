import React from "react";
import UsaChloroplethMap from "../charts/UsaChloroplethMap";
import { USA_FIPS, USA_DISPLAY_NAME, Fips } from "../../utils/Fips";
import Alert from "@material-ui/lab/Alert";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import { VariableId } from "../../utils/variableProviders";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import { CardContent } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import styles from "./Card.module.scss";
import {
  LinkWithStickyParams,
  DATASET_PRE_FILTERS,
  DATA_CATALOG_PAGE_LINK,
} from "../../utils/urlutils";

function GeographyBreadcrumb(props: {
  text: string;
  isClickable: boolean;
  onClick?: () => void;
}) {
  return (
    <>
      {props.isClickable && (
        <Button color="primary" style={{ padding: "3px" }}>
          <Link color="inherit" onClick={() => props.onClick!()}>
            {props.text}
          </Link>
        </Button>
      )}
      {!props.isClickable && (
        <Button style={{ padding: "3px" }} disabled>
          {props.text}
        </Button>
      )}
    </>
  );
}

function MapNavCard(props: {
  fips: Fips;
  datasetIds: string[];
  varField: VariableId;
  varFieldDisplayName: string;
  data: Record<string, any>[];
  updateFipsCallback: (fips: Fips) => void;
}) {
  const signalListeners: any = {
    click: (...args: any) => {
      const clickedData = args[1];
      props.updateFipsCallback(new Fips(clickedData.id));
    },
  };

  return (
    <Card raised={true} className={styles.ChartCard}>
      <CardContent>
        <Typography variant="h6">
          {props.varFieldDisplayName} in {props.fips.getFullDisplayName()}
        </Typography>
      </CardContent>
      <Divider />
      <CardContent className={styles.Breadcrumbs}>
        <Breadcrumbs separator="›" aria-label="breadcrumb">
          <GeographyBreadcrumb
            text={USA_DISPLAY_NAME}
            isClickable={!props.fips.isUsa()}
            onClick={() => {
              props.updateFipsCallback(new Fips(USA_FIPS));
            }}
          />
          {!props.fips.isUsa() && (
            <GeographyBreadcrumb
              text={props.fips.getStateDisplayName()}
              isClickable={!props.fips.isState()}
              onClick={() => {
                props.updateFipsCallback(props.fips.getParentFips());
              }}
            />
          )}
          {props.fips.isCounty() && (
            <GeographyBreadcrumb
              text={props.fips.getDisplayName()}
              isClickable={false}
            />
          )}
        </Breadcrumbs>
      </CardContent>
      <Divider />
      <CardContent>
        {!props.fips.isUsa() /* TODO - don't hardcode */ && (
          <Alert severity="error">
            This dataset does not provide county level data
          </Alert>
        )}
      </CardContent>
      <CardContent>
        <UsaChloroplethMap
          signalListeners={signalListeners}
          varField={props.varField}
          legendTitle={props.varFieldDisplayName}
          data={props.data}
          hideLegend={!props.fips.isUsa()} // TODO - update logic here when we have county level data
          fips={props.fips}
        />
        <LinkWithStickyParams
          target="_blank"
          to={`${DATA_CATALOG_PAGE_LINK}?${DATASET_PRE_FILTERS}=${props.datasetIds.join(
            ","
          )}`}
        >
          View Data Sources
        </LinkWithStickyParams>
      </CardContent>
    </Card>
  );
}

export default MapNavCard;