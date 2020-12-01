import { Breakdowns } from "../Breakdowns";
import { Dataset, Row } from "../DatasetTypes";
import { per100k } from "../datasetutils";
import { THE_USA_STRING } from "../Fips";
import { VariableId } from "../variableProviders";
import VariableProvider from "./VariableProvider";

class DiabetesProvider extends VariableProvider {
  constructor(
    variableId: VariableId,
    variableName: string,
    description: string
  ) {
    super(variableId, variableName, description, ["brfss_diabetes"]);
  }

  getDataInternal(
    datasets: Record<string, Dataset>,
    breakdowns: Breakdowns
  ): Row[] {
    const brfss_diabetes = datasets["brfss_diabetes"];
    const diabetesFrame = brfss_diabetes.toDataFrame();

    let df = diabetesFrame;
    if (
      breakdowns.geography === "national" &&
      breakdowns.demographic === "race"
    ) {
      df = df.pivot("race", {
        state_name: (series) => THE_USA_STRING,
        diabetes_count: (series) => series.sum(),
        diabetes_no: (series) => series.sum(),
      });
    }
    if (!breakdowns.demographic) {
      df = df.pivot(["state_name", "state_fips_code"], {
        race: (series) => THE_USA_STRING,
        diabetes_count: (series) => series.sum(),
        diabetes_no: (series) => series.sum(),
      });
    }

    return df
      .generateSeries({
        diabetes_per_100k: (row) =>
          per100k(row.diabetes_count, row.diabetes_count + row.diabetes_no),
        copd_per_100k: (row) =>
          per100k(row.copd_count, row.copd_count + row.copd_no),
      })
      .toArray();
  }

  allowsBreakdowns(breakdowns: Breakdowns): boolean {
    return (
      !breakdowns.time &&
      (breakdowns.geography === "state" ||
        breakdowns.geography === "national") &&
      (!breakdowns.demographic || breakdowns.demographic === "race")
    );
  }
}

export default DiabetesProvider;
