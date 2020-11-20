//@ts-nocheck

import React, { useState, useEffect } from "react";
import { Vega } from "react-vega";
import { stocks, raceTime } from "./stock.ts";

const VAR_DATASET = "dataset";

function LineChart(props: {}) {
  const [spec, setSpec] = useState({});

  let stockSet = {
    data: stocks,
    category: "symbol",
    variable: "price",
    dateField: "date",
  };

  let covidSet = {
    data: raceTime(),
    category: "race",
    variable: "rate",
    dateField: "start_week",
  };

  let chosenSet = covidSet;

  let category = chosenSet.category;
  let variable = chosenSet.variable;
  let data = chosenSet.data;
  let dateField = chosenSet.dateField;

  console.log(raceTime());
  const liteSpec = {
    $schema: "https://vega.github.io/schema/vega-lite/v4.json",
    data: data,
    width: 400,
    height: 300,
    encoding: {
      x: {
        field: dateField,
        type: "temporal",
      },
    },
    layer: [
      {
        encoding: {
          color: {
            field: category,
            type: "nominal",
          },
          y: {
            field: variable,
            type: "quantitative",
          },
        },
        layer: [
          {
            mark: "line",
          },
          {
            transform: [
              {
                filter: {
                  selection: "hover",
                },
              },
            ],
            mark: "point",
          },
        ],
      },
      {
        transform: [
          {
            pivot: category,
            value: variable,
            groupby: [dateField],
          },
        ],
        mark: "rule",
        encoding: {
          opacity: {
            condition: {
              value: 0.3,
              selection: "hover",
            },
            value: 0,
          },
          tooltip: [
            {
              field: "AAPL",
              type: "quantitative",
            },
            {
              field: "AMZN",
              type: "quantitative",
            },
            {
              field: "GOOG",
              type: "quantitative",
            },
            {
              field: "IBM",
              type: "quantitative",
            },
            {
              field: "MSFT",
              type: "quantitative",
            },
          ],
        },
        selection: {
          hover: {
            type: "single",
            fields: [dateField],
            nearest: true,
            on: "mouseover",
            empty: "none",
            clear: "mouseout",
          },
        },
      },
    ],
  };
  /*
  let vegaLiteSpec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
    "description": "Stock prices of 5 Tech Companies over Time.",
    "data": [{"url": "data/stocks.csv"}],
    "mark": "line",
    "encoding": {
      "x": {"field": "date", "type": "temporal"},
      "y": {"field": variable, "type": "quantitative"},
      "color": {"field": category, "type": "nominal"}
    }
  };
   let vegaLite = vegaLiteImport;
  let vega = vegaLite.compile(vegaLiteSpec);
  console.log(JSON.stringify(vega));*/

  useEffect(() => {
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

    let legend = {
      title: "Title",
      stroke: "color",
    };

    let colorScale2 = {
      name: "color",
      type: "ordinal",
      range: "category",
      domain: {
        fields: [
          { data: "dataset", field: "non_hispanic_black" },
          { data: "dataset", field: "hispanic" },
          { data: "dataset", field: "non_hispanic_asian" },
        ],
      },
    };
    let colorScale = {
      name: "color",
      type: "ordinal",
      domain: {
        data: VAR_DATASET,
        field: "hispanic",
        sort: true,
      },
      range: "category",
    };

    setSpec({
      $schema: "https://vega.github.io/schema/vega/v5.json",
      description: "A basic line chart example.",
      width: 500,
      height: 200,
      padding: 5,
      // legends: [legend],
      legends: [
        {
          stroke: "color",
          symbolType: "stroke",
          title: category,
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
        colorScale,
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
      data: [
        {
          name: VAR_DATASET,
          values: [
            {
              footnote: null,
              hispanic: "0.041",
              non_hispanic_asian: "0.009",
              non_hispanic_black: "0.21",
              urban_rural_description: "Small metro",
              non_hispanic_white: "0.716",
              end_week: "2020-11-07",
              total_deaths: "1246",
              other: "0.019",
              fips_county: "15",
              fips_code: "1015",
              non_hispanic_american_indian_or_alaska_native: "0.004",
              fips_state: "1",
              indicator: "Distribution of population (%)",
              state: "AL",
              urban_rural_code: "4",
              ingestion_time: "2020-11-12 20:31:23.083780 UTC",
              county_name: "Calhoun County",
              non_hispanic_native_hawaiian_or_other_pacific_islander: "0.1",
              covid_19_deaths: "109",
              start_week: "2020-02-01",
              data_as_of: "2020-11-12",
            },
            {
              footnote: null,
              hispanic: "0.061",
              non_hispanic_asian: "0.015",
              non_hispanic_black: "0.11",
              urban_rural_description: "Small metro",
              non_hispanic_white: "0.716",
              end_week: "2020-11-07",
              total_deaths: "1446",
              other: "0.019",
              fips_county: "15",
              fips_code: "1015",
              non_hispanic_american_indian_or_alaska_native: "0.004",
              fips_state: "1",
              indicator: "Distribution of population (%)",
              state: "AL",
              urban_rural_code: "4",
              ingestion_time: "2020-11-12 20:31:23.083780 UTC",
              county_name: "Calhoun County",
              non_hispanic_native_hawaiian_or_other_pacific_islander: "0.1",
              covid_19_deaths: "109",
              start_week: "2020-02-08",
              data_as_of: "2020-11-12",
            },
            {
              footnote: null,
              hispanic: "0.091",
              non_hispanic_asian: "0.02",
              non_hispanic_black: "0.31",
              urban_rural_description: "Small metro",
              non_hispanic_white: "0.716",
              end_week: "2020-11-07",
              total_deaths: "1646",
              other: "0.019",
              fips_county: "15",
              fips_code: "1015",
              non_hispanic_american_indian_or_alaska_native: "0.004",
              fips_state: "1",
              indicator: "Distribution of population (%)",
              state: "AL",
              urban_rural_code: "4",
              ingestion_time: "2020-11-12 20:31:23.083780 UTC",
              county_name: "Calhoun County",
              non_hispanic_native_hawaiian_or_other_pacific_islander: "0.1",
              covid_19_deaths: "109",
              start_week: "2020-02-15",
              data_as_of: "2020-11-12",
            },
          ],
          /*  url: "covid_time_sample2.json",
          format: {
            type: "json",
            parse: { varX: "date" },
          },*/
        },
      ],
    });
  }, [category]);

  return (
    <div
      style={{
        width: "80%",
        margin: "auto",
      }}
    >
      <Vega spec={liteSpec} width={500} />
    </div>
  );
}

export default LineChart;
