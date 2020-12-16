import { MetricId } from "../data/variableProviders";

// The type of metric indicates where and how this a MetricConfig is represented in the frontend:
// What chart types are applicable, what metrics are shown together, display names, etc.
export type MetricType =
  | "count"
  | "pct_share"
  | "pct_share_to_pop_ratio"
  | "per100k"
  | "percentile"
  | "index";

export type MetricConfig = {
  metricId: MetricId;
  fullCardTitleName: string;
  shortVegaLabel: string;
  type: MetricType;
};

export type VariableConfig = {
  variableId: string; // TODO - strongly type key
  metrics: Record<string, MetricConfig>; // TODO - strongly type key
};

// TODO - strongly type key
export const METRIC_CONFIG: Record<string, VariableConfig[]> = {
  covid: [
    {
      variableId: "cases",
      metrics: {
        count: {
          metricId: "covid_cases",
          fullCardTitleName: "COVID-19 cases",
          shortVegaLabel: "cases",
          type: "count",
        },
        pct_share: {
          metricId: "covid_cases_pct_of_geo",
          fullCardTitleName: "Share of COVID-19 cases",
          shortVegaLabel: "% of cases",
          type: "pct_share",
        },
        per100k: {
          metricId: "covid_cases_per_100k",
          fullCardTitleName: "COVID-19 cases per 100,000 people",
          shortVegaLabel: "cases per 100k",
          type: "per100k",
        },
      },
    },
    {
      variableId: "deaths",
      metrics: {
        count: {
          metricId: "covid_deaths",
          fullCardTitleName: "COVID-19 deaths",
          shortVegaLabel: "deaths",
          type: "count",
        },
        pct_share: {
          metricId: "covid_deaths_pct_of_geo",
          fullCardTitleName: "Share of COVID-19 deaths",
          shortVegaLabel: "% of deaths",
          type: "pct_share",
        },
        per100k: {
          metricId: "covid_deaths_per_100k",
          fullCardTitleName: "COVID-19 deaths per 100,000 people",
          shortVegaLabel: "deaths per 100k",
          type: "per100k",
        },
      },
    },
    {
      variableId: "hospitalizations",
      metrics: {
        count: {
          metricId: "covid_hosp",
          fullCardTitleName: "COVID-19 hospitalizations",
          shortVegaLabel: "hospitalizations",
          type: "count",
        },
        pct_share: {
          metricId: "covid_hosp_pct_of_geo",
          fullCardTitleName: "Share of COVID-19 hospitalizations",
          shortVegaLabel: "% of hospitalizations",
          type: "pct_share",
        },
        per100k: {
          metricId: "covid_hosp_per_100k",
          fullCardTitleName: "COVID-19 hospitalizations per 100,000 people",
          shortVegaLabel: "hospitalizations per 100k",
          type: "per100k",
        },
      },
    },
  ],
  diabetes: [
    {
      variableId: "cases",
      metrics: {
        count: {
          metricId: "diabetes_count",
          fullCardTitleName: "Count of diabetes cases",
          shortVegaLabel: "cases",
          type: "count",
        },
        per100k: {
          metricId: "diabetes_per_100k",
          fullCardTitleName: "Diabetes cases per 100,000 people",
          shortVegaLabel: "cases per 100k",
          type: "per100k",
        },
      },
    },
  ],
  copd: [
    {
      variableId: "cases",
      metrics: {
        count: {
          metricId: "copd_count",
          fullCardTitleName: "Count of COPD cases",
          shortVegaLabel: "cases",
          type: "count",
        },
        per100k: {
          metricId: "copd_per_100k",
          fullCardTitleName: "COPD cases per 100,000 people",
          shortVegaLabel: "cases per 100k",
          type: "per100k",
        },
      },
    },
  ],
};
