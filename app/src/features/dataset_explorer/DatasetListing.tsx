import React, { useState } from "react";
import { DatasetMetadata } from "../../utils/DatasetTypes";
import styles from "./DatasetListing.module.scss";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import Collapse from "@material-ui/core/Collapse";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import CardHeader from "@material-ui/core/CardHeader";

function DatasetListing(props: { dataset: DatasetMetadata }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card elevation={3}>
      <CardHeader
        title={props.dataset.name}
        subheader={props.dataset.data_source_name}
      />
      <Table size="small" aria-label="dataset field descriptions">
        <TableBody>
          <TableRow>
            <TableCell width="21%">
              <b>Data Source</b>
            </TableCell>
            <TableCell>
              <b>Geographic Level</b>
            </TableCell>
            <TableCell>
              <b>Demographic Granularity</b>
            </TableCell>
            <TableCell>
              <b>Update Frequency</b>
            </TableCell>
            <TableCell>
              <b>Latest Update Time</b>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <a href={props.dataset.data_source_link}>
                {props.dataset.data_source_name}
              </a>
            </TableCell>
            <TableCell>{props.dataset.geographic_level}</TableCell>
            <TableCell>{props.dataset.demographic_granularity}</TableCell>
            <TableCell>{props.dataset.update_frequency}</TableCell>
            <TableCell>{props.dataset.update_time}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Collapse in={expanded} timeout="auto" className={styles.MoreInfo}>
        <p className={styles.descriptionParagraph}>
          {props.dataset.description}
        </p>
      </Collapse>
      <div className={styles.FirstCardFooter}>
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
            {expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            {expanded ? "Less" : "More"}
          </Button>
        </div>
      </div>
      <div className={styles.SecondCardFooter}>
        <Typography
          variant="body2"
          component="p"
          className={styles.CardFooterRight}
        >
          Updated: {props.dataset.update_time}
        </Typography>
        <Typography
          variant="body2"
          component="p"
          className={styles.CardFooterLeft}
        ></Typography>
      </div>
    </Card>
  );
}

export default DatasetListing;
