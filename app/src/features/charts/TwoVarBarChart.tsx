import React from "react";
import { Vega } from "react-vega";
import { Row } from "../../utils/DatasetTypes";

const RAW_DATASET = "raw_dataset";

function getSpec(
  data: Record<string, any>[],
  dim: string,
  thickMeasure: string,
  thinMeasure: string
): any {
  const BAR_HEIGHT = 40;
  const THICK_MEASURE_COLOR = "#4c78a8";
  const THIN_MEASURE_COLOR = "#89B7D5";

  return {
    $schema: "https://vega.github.io/schema/vega/v5.json",
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
      { name: "y_step", value: BAR_HEIGHT },
      {
        name: "height",
        update: "bandspace(domain('y').length, 0.1, 0.05) * y_step",
      },
    ],
    marks: [
      {
        name: "thickMeasure_bars",
        type: "rect",
        style: ["bar"],
        from: { data: RAW_DATASET },
        encode: {
          enter: {
            tooltip: {
              signal: `datum. ${dim} + ', ${thickMeasure}: ' + datum. ${thickMeasure}+'%'`,
            },
          },
          update: {
            fill: { value: THICK_MEASURE_COLOR },
            ariaRoleDescription: { value: "bar" },
            x: { scale: "x", field: thickMeasure },
            x2: { scale: "x", value: 0 },
            y: { scale: "y", field: dim },
            height: { scale: "y", band: 1 },
          },
        },
      },
      {
        name: "thinMeasure_bars",
        type: "rect",
        style: ["bar"],
        from: { data: RAW_DATASET },
        encode: {
          enter: {
            tooltip: {
              signal: `datum. ${dim} + ', ${thinMeasure}: ' + datum. ${thinMeasure}+'%'`,
            },
          },
          update: {
            fill: { value: THIN_MEASURE_COLOR },
            ariaRoleDescription: { value: "bar" },
            x: { scale: "x", field: thinMeasure },
            x2: { scale: "x", value: 0 },
            yc: { scale: "y", field: dim, offset: BAR_HEIGHT / 2 },
            height: { scale: "y", band: 0.2 },
          },
        },
      },
      {
        name: "thickMeasure_text_labels",
        type: "text",
        style: ["text"],
        from: { data: RAW_DATASET },
        encode: {
          update: {
            align: { value: "left" },
            baseline: { value: "middle" },
            dx: { value: 3 },
            fill: { value: "black" },
            x: { scale: "x", field: thickMeasure },
            y: { scale: "y", field: dim, band: 0.8 },
            text: {
              signal: `format(datum["${thickMeasure}"], "") + "%"`,
            },
          },
        },
      },
      {
        name: "thinMeasure_text_labels",
        type: "text",
        style: ["text"],
        from: { data: RAW_DATASET },
        encode: {
          update: {
            align: { value: "left" },
            baseline: { value: "middle" },
            dx: { value: 3 },
            fill: { value: "black" },
            x: { scale: "x", field: thinMeasure },
            y: { scale: "y", field: dim, band: 0.3 },
            text: {
              signal: `format(datum["${thinMeasure}"], "") + "%"`,
            },
          },
        },
      },
    ],
    scales: [
      {
        name: "x",
        type: "linear",
        domain: { data: RAW_DATASET, field: thickMeasure },
        range: [0, { signal: "width" }],
        nice: true,
        zero: true,
      },
      {
        name: "y",
        type: "band",
        domain: {
          data: RAW_DATASET,
          field: dim,
          sort: { op: "min", field: thickMeasure, order: "descending" },
        },
        range: { step: { signal: "y_step" } },
        paddingInner: 0.1,
        paddingOuter: 0.05,
      },
      {
        name: "variables",
        type: "ordinal",
        domain: [thickMeasure, thinMeasure],
        range: [THICK_MEASURE_COLOR, THIN_MEASURE_COLOR],
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
        title: `${thickMeasure} and ${thinMeasure} `,
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
    legends: [
      {
        stroke: "variables",
        title: "Variables",
        padding: 4,
        encode: {
          symbols: {
            enter: {
              strokeWidth: { value: 2 },
              size: { value: 50 },
            },
          },
        },
      },
    ],
  };
}

function TwoVarBarChart(props: {
  data: Row[];
  thickMeasure: string;
  thinMeasure: string;
  breakdownVar: string;
}) {
  console.log(props);
  return (
    <Vega
      spec={getSpec(
        props.data,
        props.breakdownVar,
        props.thickMeasure,
        props.thinMeasure
      )}
    />
  );
}

export default TwoVarBarChart;
