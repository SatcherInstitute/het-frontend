import React from "react";
import { Alert } from "@material-ui/lab";
import CardWrapper from "./CardWrapper";
import useDatasetStore from "../data/useDatasetStore";
import { Breakdowns } from "../data/Breakdowns";
import { getDependentDatasets, MetricId } from "../data/variableProviders";
import MetricQuery from "../data/MetricQuery";
import { Fips } from "../utils/madlib/Fips";
import { CardContent } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import styles from "./Card.module.scss";

function PopulationCard(props: { fips: Fips }) {
  const datasetStore = useDatasetStore();

  const variableIds: MetricId[] = ["population", "population_pct"];
  const query = new MetricQuery(
    variableIds,
    Breakdowns.forFips(props.fips).andRace()
  );

  return (
    <CardWrapper
      queries={[query]}
      datasetIds={getDependentDatasets(variableIds)}
      hideFooter={true}
    >
      {() => {
        const dataset = datasetStore.getMetrics(query);
        const totalPopulation = dataset.find(
          (r) => r.race_and_ethnicity === "Total"
        );
        const totalPopulationSize = totalPopulation
          ? totalPopulation["population"].toLocaleString("en")
          : "Data retrieval error";

        console.log(dataset);

        const populationMetrics = [
          { label: "Median age", value: "38.2" },
          { label: "White alone", value: "72%" },
          { label: "Black or African American, alone", value: "12.8%" },
          { label: "Asian alone", value: "5.7%" },
          { label: "American Indian & Alaskan Native alone", value: "0.9%" },
          { label: "Two or more races", value: "3.4%" },
        ];

        return (
          <>
            {dataset.length < 1 && (
              <Alert severity="warning">
                Missing data means that we don't know the full story.
              </Alert>
            )}
            {dataset.length > 0 && (
              <>
                <CardContent>
                  <CardContent>
                    <span className={styles.PopulationCardTitle}>
                      {props.fips.getFullDisplayName()}
                    </span>
                  </CardContent>
                  <Grid
                    container
                    className={styles.PopulationCard}
                    justify="space-around"
                  >
                    <Grid item>
                      <span>Total Population</span>
                      <span className={styles.TotalPopulationValue}>
                        {totalPopulationSize}
                      </span>
                    </Grid>
                    {/* TODO- calculate median age */}
                    <Grid item className={styles.PopulationMetric}>
                      <span>Median Age</span>
                      <span className={styles.PopulationMetricValue}>??</span>
                    </Grid>
                    {dataset
                      .filter((r) => r.race_and_ethnicity !== "Total")
                      .map((row) => (
                        <Grid item className={styles.PopulationMetric}>
                          <span>{row.race_and_ethnicity}</span>
                          <span className={styles.PopulationMetricValue}>
                            {row.population_pct}%
                          </span>
                        </Grid>
                      ))}
                  </Grid>
                </CardContent>
              </>
            )}
          </>
        );
      }}
    </CardWrapper>
  );
}

export default PopulationCard;
