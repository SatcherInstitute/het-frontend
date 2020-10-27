import React from "react";
import styles from "./App.module.scss";
import DataCatalogPage from "./pages/DataCatalogPage";
import ExploreDataPage from "./pages/ExploreDataPage";
import LandingPage from "./pages/LandingPage";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import NotFoundPage from "./pages/NotFoundPage";
import {
  useDatasetStoreProvider,
  DatasetProvider,
  startMetadataLoad,
} from "./utils/useDatasetStore";

startMetadataLoad();

function App() {
  const datasetStore = useDatasetStoreProvider();
  return (
    <DatasetProvider value={datasetStore}>
      <CssBaseline />
      <div className={styles.App}>
        <Router>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" className={styles.HomeLogo}>
                Health Equity Tracker
              </Typography>
              <div>
                <Button className={styles.NavButton}>
                  <Link to="/">Home</Link>
                </Button>
                <Button className={styles.NavButton}>
                  <Link to="/datacatalog">Data Catalog</Link>
                </Button>
                <Button className={styles.NavButton}>
                  <Link to="/exploredata">Explore the Data</Link>
                </Button>
              </div>
            </Toolbar>
          </AppBar>
          <Switch>
            <Route path="/datacatalog" component={DataCatalogPage} />
            <Route path="/exploredata" component={ExploreDataPage} />
            <Route exact path="/" component={LandingPage} />
            <Route component={NotFoundPage} />
          </Switch>
        </Router>
      </div>
    </DatasetProvider>
  );
}

export default App;
