import React, { useState } from "react";
import { DatasetMetadata } from "../../utils/DatasetTypes";
import styles from "./DatasetListing.module.scss";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import Collapse from "@material-ui/core/Collapse";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import Typography from "@material-ui/core/Typography";
import CardHeader from "@material-ui/core/CardHeader";

function DatasetListing(props: { dataset: DatasetMetadata }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card elevation={3} className={styles.DatasetListing}>
      <Typography variant="h5" className={styles.DataTitle} align="left">
        {props.dataset.name}
      </Typography>
      <Typography className={styles.DataSubtitle} align="left">
        <a href={props.dataset.data_source_link}>
          {props.dataset.data_source_name}
        </a>
      </Typography>
      <table className={styles.MetadataTable}>
        <tr>
          <td>
            <b>Geographic Level</b>
          </td>
          <td>{props.dataset.geographic_level}</td>
        </tr>
        <tr>
          <td>
            <b>Demographic Granularity</b>
          </td>
          <td>{props.dataset.demographic_granularity}</td>
        </tr>
        <tr>
          <td>
            <b>Update Frequency</b>
          </td>
          <td>{props.dataset.update_frequency}</td>
        </tr>
        <tr>
          <td>
            <b>Latest Update Time</b>
          </td>
          <td>{props.dataset.update_time}</td>
        </tr>
      </table>
      <Collapse in={expanded} timeout="auto" className={styles.MoreInfo}>
        <p className={styles.Description}>{props.dataset.description}</p>
      </Collapse>
      <div className={styles.Footer}>
        <div className={styles.CardFooterRight}>
          <Button
            aria-label="expand dataset"
            onClick={() => alert("unimplemented")}
            size="small"
          >
            Download CSV
          </Button>
        </div>
        <div className={styles.CardFooterLeft}>
          <Button
            aria-label="expand dataset"
            onClick={() => setExpanded(!expanded)}
            data-testid={"expand-" + props.dataset.id}
            className={styles.ExpandButton}
            size="small"
          >
            {expanded ? "Less" : "More"}
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default DatasetListing;
