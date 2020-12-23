export type BreakdownVar = "race_and_ethnicity" | "age" | "sex";

export const BREAKDOWN_VAR_DISPLAY_NAMES: Record<BreakdownVar, string> = {
  race_and_ethnicity: "Race and Ethnicity",
  age: "Age",
  sex: "Sex",
};

export const ALL_RACES_DISPLAY_NAME = "All races";

// Prints a formatted version of a field value based on the type specified by the field name
export function formatFieldValue(nameOfField: string, value: any): string {
  if (value === null || value === undefined) {
    return "";
  }
  const formattedValue =
    typeof value === "number" ? value.toLocaleString("en") : value;
  const suffix =
    nameOfField.endsWith("_pct") || nameOfField.endsWith("_pct_of_geo")
      ? "%"
      : "";
  return `${formattedValue}${suffix}`;
}
