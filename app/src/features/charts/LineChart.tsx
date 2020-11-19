import React, { useState, useEffect } from "react";
import { Vega } from "react-vega";

const VAR_DATASET = "dataset";

function LineChart(props: {}) {
  const [spec, setSpec] = useState({});

  let varX = "start_week";
  let varY = "hispanic";
  let varY2 = "non_hispanic_asian";
  let varY3 = "non_hispanic_black";

  const lines = [
    { field: varY3, color: "blue" },
    { field: varY2, color: "red" },
    { field: varY, color: "green" },
  ].map((item) => {
    return {
      type: "line",
      timeUnit: "yearmonthdate",
      from: { data: "series" },
      encode: {
        enter: {
          x: { scale: varX, field: varX },
          y: { scale: varY, field: item.field },
          strokeWidth: { value: 2 },
          stroke: { value: item.color },
        },
        update: {
          interpolate: "linear",
          strokeOpacity: { value: 1 },
        },
        hover: {
          strokeOpacity: { value: 0.5 },
        },
      },
    };
  });

  useEffect(() => {
    setSpec({
      $schema: "https://vega.github.io/schema/vega/v5.json",
      description: "A basic line chart example.",
      width: 500,
      height: 200,
      padding: 5,

      data: [
        {
          name: VAR_DATASET,
          url: "covid_time_sample2.json",
          format: {
            type: "json",
            parse: { varX: "date" },
          },
        },
      ],

      scales: [
        {
          name: varX,
          type: "point",
          range: "width",
          domain: { data: VAR_DATASET, field: varX },
        },
        {
          name: varY,
          type: "linear",
          range: "height",
          nice: true,
          zero: true,
          domain: [0, 0.4],
          //  domain: { data: VAR_DATASET, field: varY },
        },
        {
          name: "color",
          type: "ordinal",
          range: "category",
          domain: { data: VAR_DATASET, field: "c" },
        },
      ],

      axes: [
        { orient: "bottom", scale: varX },
        { orient: "left", scale: varY },
      ],

      marks: [
        {
          type: "group",
          from: {
            facet: {
              name: "series",
              data: VAR_DATASET,
              groupby: "c",
            },
          },
          marks: lines,
        },
      ],
    });
  }, [lines, varX, varY]);

  return (
    <div
      style={{
        width: "80%",
        margin: "auto",
      }}
    >
      <Vega spec={spec} width={500} />
    </div>
  );
}

export default LineChart;
