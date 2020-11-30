import React from "react";
import { Vega, VisualizationSpec } from "react-vega";
import { Row } from "../../utils/DatasetTypes";

const RAW_DATASET = "raw_dataset";

function getSpec(
  data: Record<string, any>[],
  dim: string,
  measure: string,
  compareMeasure: string
): any {
  measure = "population";
  compareMeasure = "diabetes_count";

  return {
    $schema: "https://vega.github.io/schema/vega/v5.json",
    description:
      "Bar chart with text labels. Apply scale padding to make the frame cover the labels.",
    background: "white",
    padding: 5,
    height: 500,
    width: 500,
    style: "cell",
    data: [
      {
        name: RAW_DATASET,
        values: data,
      },
    ],
    signals: [
      { name: "y_step", value: 20 },
      {
        name: "height",
        update: "bandspace(domain('y').length, 0.1, 0.05) * y_step",
      },
    ],
    marks: [
      {
        name: "layer1_measure_bars",
        type: "rect",
        style: ["bar"],
        from: { data: RAW_DATASET },
        encode: {
          update: {
            fill: { value: "#4c78a8" },
            ariaRoleDescription: { value: "bar" },
            x: { scale: "x", field: measure },
            x2: { scale: "x", value: 0 },
            y: { scale: "y", field: dim },
            height: { scale: "y", band: 1 },
          },
        },
      },
      {
        name: "layer2_compare_measure_bars",
        type: "rect",
        style: ["bar"],
        from: { data: RAW_DATASET },
        encode: {
          update: {
            fill: { value: "red" },
            ariaRoleDescription: { value: "bar" },
            x: { scale: "x", field: compareMeasure },
            x2: { scale: "x", value: 0 },
            y: { scale: "y", field: dim },
            height: { scale: "y", band: 0.2 },
          },
        },
      },
      {
        name: "layer3_text_labels",
        type: "text",
        style: ["text"],
        from: { data: RAW_DATASET },
        encode: {
          update: {
            align: { value: "left" },
            baseline: { value: "middle" },
            dx: { value: 3 },
            fill: { value: "black" },
            description: {
              signal:
                '"' +
                dim +
                ': " + (isValid(datum["' +
                dim +
                '"]) ? datum["' +
                dim +
                '"] : ""+datum["' +
                dim +
                '"]) + "; ' +
                measure +
                ': " + (format(datum["' +
                measure +
                '"], ""))',
            },
            x: { scale: "x", field: measure },
            y: { scale: "y", field: dim, band: 0.5 },
            text: { signal: 'format(datum["' + measure + '"], "")' },
          },
        },
      },
    ],
    scales: [
      {
        name: "x",
        type: "linear",
        domain: { data: RAW_DATASET, field: measure },
        range: [0, { signal: "width" }],
        padding: 10,
        nice: true,
        zero: true,
      },
      {
        name: "y",
        type: "band",
        domain: {
          data: RAW_DATASET,
          field: dim,
          sort: { op: "min", field: measure, order: "descending" },
        },
        range: { step: { signal: "y_step" } },
        paddingInner: 0.1,
        paddingOuter: 0.05,
      },
    ],
    axes: [
      {
        scale: "x",
        orient: "bottom",
        gridScale: "y",
        grid: true,
        tickCount: { signal: "ceil(width/40)" },
        domain: false,
        labels: false,
        aria: false,
        maxExtent: 0,
        minExtent: 0,
        ticks: false,
        zindex: 0,
      },
      {
        scale: "x",
        orient: "bottom",
        grid: false,
        title: measure,
        labelFlush: true,
        labelOverlap: true,
        tickCount: { signal: "ceil(width/40)" },
        zindex: 0,
      },
      {
        scale: "y",
        orient: "left",
        grid: false,
        title: dim,
        zindex: 0,
      },
    ],
    config: {},
  };
}

function TwoVarBarChart(props: {
  data: Row[];
  measure: string;
  compareMeasure: string;
}) {
  console.log(props);
  return (
    <Vega
      spec={getSpec(props.data, "race", props.measure, props.compareMeasure)}
    />
  );
}

export default TwoVarBarChart;
