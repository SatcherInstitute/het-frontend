import React from "react";
import VegaTest from "../features/VegaTest";
import LeaftletTest from "../features/LeafletTest";

function ExploreDataPage() {
  return (
    <React.Fragment>
      Research questions; explore key relationships across datasets, chosen by
      us; explore the data freely
      <h1>Leaflet Example</h1>
      <LeaftletTest />
      <h1>Vega Example</h1>
      <VegaTest />
    </React.Fragment>
  );
}

export default ExploreDataPage;
