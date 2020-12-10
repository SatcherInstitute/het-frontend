import { VariableId } from "../variableProviders";

export const VARIABLE_DISPLAY_NAMES: Record<VariableId, string> = {
  diabetes_count: "Diabetes case count",
  diabetes_per_100k: "Diabetes cases per 100,000 people",
  copd_count: "COPD case count",
  population: "Population Size",
  population_pct: "Population Share",
  covid_cases: "COVID-19 cases",
  covid_deaths: "COVID-19 deaths",
  covid_hosp: "COVID-19 hospitalizations",
  covid_cases_pct_of_geo: "Share of COVID-19 cases",
  covid_deaths_pct_of_geo: "Share of COVID-19 deaths",
  covid_hosp_pct_of_geo: "Share of COVID-19 hospitalizations",
  covid_deaths_per_100k: "COVID-19 deaths per 100,000 people",
  covid_cases_per_100k: "COVID-19 cases per 100,000 people",
  covid_hosp_per_100k: "COVID-19 hospitalizations per 100,000 people",
};

export type BreakdownVar = "race_and_ethnicity" | "age" | "gender";

export const BREAKDOWN_VAR_DISPLAY_NAMES: Record<BreakdownVar, string> = {
  race_and_ethnicity: "Race and Ethnicity",
  age: "age",
  gender: "gender",
};

export type MetricToggle = "covid_cases" | "covid_deaths" | "covid_hosp";

export const METRIC_FULL_NAMES: Record<MetricToggle, string> = {
  covid_cases: "COVID-19 Cases",
  covid_deaths: "COVID-19 Deaths",
  covid_hosp: "COVID-19 Hospitalizations",
};

export const METRIC_SHORT_NAMES: Record<MetricToggle, string> = {
  covid_cases: "cases",
  covid_deaths: "deaths",
  covid_hosp: "hospitalizations",
};

export function shareOf(metric: string): VariableId {
  return (metric + "_pct_of_geo") as VariableId;
}

export function per100k(metric: string): VariableId {
  return (metric + "_per_100k") as VariableId;
}

export const METRICS_FOR_VARIABLE: Record<string, MetricToggle[]> = {
  covid: ["covid_cases", "covid_deaths", "covid_hosp"],
};
