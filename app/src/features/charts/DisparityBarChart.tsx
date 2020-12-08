import React, { RefObject } from "react";
import { Vega } from "react-vega";
import { Row } from "../../utils/DatasetTypes";
import { useResponsiveWidth } from "../../utils/useResponsiveWidth";

function getSpec(
  data: Record<string, any>[],
  width: number,
  breakdownVar: string,
  breakdownVarDisplayName: string,
  thickMeasure: string,
  thickMeasureDisplayName: string,
  thinMeasure: string,
  thinMeasureDisplayName: string
): any {
  const BAR_HEIGHT = 40;
  const BAR_PADDING = 0.1;
  const THIN_RATIO = 0.3;
  const THIN_MEASURE_COLOR = "#4c78a8";
  const THICK_MEASURE_COLOR = "#89B7D5";
  const DATASET = "DATASET";
  const WIDTH_PADDING_FOR_SNOWMAN_MENU = 50;

  return {
    $schema: "https://vega.github.io/schema/vega/v5.json",
    background: "white",
    padding: 5,
    autosize: { resize: true, type: "fit-x" },
    width: width - WIDTH_PADDING_FOR_SNOWMAN_MENU,
    style: "cell",
    data: [
      {
        name: DATASET,
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
        from: { data: DATASET },
        encode: {
          enter: {
            tooltip: {
              signal: `datum. ${breakdownVar} + ', ${thickMeasureDisplayName}: ' + datum. ${thickMeasure}+'%'`,
            },
          },
          update: {
            fill: { value: THICK_MEASURE_COLOR },
            ariaRoleDescription: { value: "bar" },
            x: { scale: "x", field: thickMeasure },
            x2: { scale: "x", value: 0 },
            y: { scale: "y", field: breakdownVar },
            height: { scale: "y", band: 1 },
          },
        },
      },
      {
        name: "thinMeasure_bars",
        type: "rect",
        style: ["bar"],
        from: { data: DATASET },
        encode: {
          enter: {
            tooltip: {
              signal: `datum. ${breakdownVar} + ', ${thinMeasureDisplayName}: ' + datum. ${thinMeasure}+'%'`,
            },
          },
          update: {
            fill: { value: THIN_MEASURE_COLOR },
            ariaRoleDescription: { value: "bar" },
            x: { scale: "x", field: thinMeasure },
            x2: { scale: "x", value: 0 },
            yc: {
              scale: "y",
              field: breakdownVar,
              offset: (BAR_HEIGHT - BAR_HEIGHT * BAR_PADDING) / 2,
            },
            height: { scale: "y", band: THIN_RATIO },
          },
        },
      },
      {
        name: "thickMeasure_text_labels",
        type: "text",
        style: ["text"],
        from: { data: DATASET },
        encode: {
          update: {
            align: { value: "left" },
            baseline: { value: "middle" },
            dx: { value: 3 },
            fill: { value: "black" },
            x: { scale: "x", field: thickMeasure },
            y: { scale: "y", field: breakdownVar, band: 0.8 },
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
        from: { data: DATASET },
        encode: {
          update: {
            align: { value: "left" },
            baseline: { value: "middle" },
            dx: { value: 3 },
            fill: { value: "black" },
            x: { scale: "x", field: thinMeasure },
            y: { scale: "y", field: breakdownVar, band: 0.3 },
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
        domain: { data: DATASET, field: thickMeasure },
        range: [0, { signal: "width" }],
        nice: true,
        zero: true,
      },
      {
        name: "y",
        type: "band",
        domain: {
          data: DATASET,
          field: breakdownVar,
          sort: { op: "min", field: thickMeasure, order: "descending" },
        },
        range: { step: { signal: "y_step" } },
        paddingInner: BAR_PADDING,
      },
      {
        name: "variables",
        type: "ordinal",
        domain: [thickMeasureDisplayName, thinMeasureDisplayName],
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
        title: `${thickMeasureDisplayName} and ${thinMeasureDisplayName} `,
        labelFlush: true,
        labelOverlap: true,
        tickCount: { signal: "ceil(width/40)" },
        zindex: 0,
      },
      {
        scale: "y",
        orient: "left",
        grid: false,
        title: breakdownVarDisplayName,
        zindex: 0,
      },
    ],
    legends: [
      {
        stroke: "variables",
        title: "Variables",
        orient: "top",
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

function DisparityBarChart(props: {
  data: Row[];
  thickMeasure: string;
  thinMeasure: string;
  thickMeasureDisplayName: string;
  thinMeasureDisplayName: string;
  breakdownVar: string;
  breakdownVarDisplayName: string;
}) {
  const [ref, width] = useResponsiveWidth();
  return (
    <div ref={ref as RefObject<HTMLDivElement>}>
      <Vega
        spec={getSpec(
          props.data,
          width ? width : 100, // Set a default value until width is set
          props.breakdownVar,
          props.breakdownVarDisplayName,
          props.thickMeasure,
          props.thickMeasureDisplayName,
          props.thinMeasure,
          props.thinMeasureDisplayName
        )}
      />
    </div>
  );
}

export default DisparityBarChart;