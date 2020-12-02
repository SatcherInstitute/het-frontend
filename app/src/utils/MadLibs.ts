//@ts-nocheck

import { STATE_FIPS_MAP } from "./Fips";
import { VariableId } from "./variableProviders";

// Map of phrase segment index to its selected value
export type PhraseSelections = Record<number, string>;

// Map of phrase selection ID to the display value
export type PhraseSelector = Record<string, string>;

// Each phrase segment of the mad lib is either a string of text
// or a map of IDs to string options that can fill in a blank
export type PhraseSegment = string | PhraseSelector;

export type MadLibId = "diabetes" | "compare" | "dump" | "covid";
export interface MadLib {
  readonly id: MadLibId;
  readonly phrase: PhraseSegment[];
  readonly defaultSelections: PhraseSelections;
  readonly activeSelections: PhraseSelections;
}

function getMadLibPhraseText(madLib: MadLib): string {
  let madLibText = "";
  madLib.phrase.forEach((phraseSegment, index) => {
    if (typeof phraseSegment === "string") {
      madLibText += phraseSegment;
    } else {
      const phraseSelector = phraseSegment as PhraseSelector;
      let selectionKey: string = madLib.activeSelections[index]
        ? madLib.activeSelections[index]
        : madLib.defaultSelections[index];
      madLibText += " " + phraseSelector[selectionKey] + " ";
    }
  });
  console.log(madLibText);
  return madLibText;
}

/*const COVID_VARIABLES: Record<string, VariableId> = {
  "0": "covid_cases",
  "1": "covid_deaths",
  "2": "covid_hosp",
  "3": "covid_cases_pct_of_geo",
  "4": "covid_deaths_pct_of_geo",
  "5": "covid_hosp_pct_of_geo",
  "6": "covid_deaths_per_100k",
  "7": "covid_cases_per_100k",
  "8": "covid_hosp_per_100k",
};*/

const COVID_VARIABLES: Record<VariableId, string> = {
  covid_cases: "COVID Cases",
  covid_deaths: "COVID Deaths",
  covid_hosp: "COVID Hospitalizations",
  covid_cases_pct_of_geo: "COVID Cases % of Geo",
  covid_deaths_pct_of_geo: "COVID Deaths % of Geo",
  covid_hosp_pct_of_geo: "COVID Hospitalizations % of Geo",
  covid_deaths_per_100k: "COVID Deaths per 100k",
  covid_cases_per_100k: "COVID Cases per 100k",
  covid_hosp_per_100k: "COVID Hospitalizations per 100k",
};

const DIABETES_VARIABLES: Record<VariableId, string> = {
  diabetes_count: "Diabetes Count",
  diabetes_per_100k: "Diabetes per 100k",
};

const MADLIB_LIST: MadLib[] = [
  {
    id: "covid",
    phrase: ["Tell me about", COVID_VARIABLES, " in ", STATE_FIPS_MAP],
    defaultSelections: { 1: "covid_cases", 3: "00" },
    activeSelections: { 1: "covid_cases", 3: "00" },
  },
  {
    id: "diabetes",
    phrase: ["Tell me about", DIABETES_VARIABLES, "in the USA."],
    defaultSelections: { 1: "diabetes_count" },
    activeSelections: { 1: "diabetes_count" },
  },
  {
    id: "compare",
    phrase: [
      "Compare",
      { diabetes_per_100k: "Diabetes per 100k" },
      " in ",
      STATE_FIPS_MAP,
      " compared to ",
      STATE_FIPS_MAP,
    ],
    defaultSelections: { 1: "diabetes_per_100k", 3: "13", 5: "00" },
    activeSelections: { 1: "diabetes_per_100k", 3: "13", 5: "00" },
  },
  {
    id: "dump",
    phrase: ["Show me ALL THE CHARTS!!!!"],
    defaultSelections: {},
    activeSelections: {},
  },
];

export { MADLIB_LIST, getMadLibPhraseText };
