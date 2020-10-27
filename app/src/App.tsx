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
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
} from "react-router-dom";
import NotFoundPage from "./pages/NotFoundPage";
import {
  useDatasetStoreProvider,
  DatasetProvider,
  startMetadataLoad,
} from "./utils/useDatasetStore";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";

startMetadataLoad();

function App() {
  const datasetStore = useDatasetStoreProvider();

  const theme = createMuiTheme({
    typography: {
      fontFamily: `"Hind", "Roboto", "Helvetica", "Arial", sans-serif`,
      fontSize: 14,
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 500,
    },
  });

  return (
    <ThemeProvider theme={theme}>
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
                    <NavLink to="/" activeClassName="ActiveNavButton">
                      Home
                    </NavLink>
                  </Button>
                  <Button className={styles.NavButton}>
                    <NavLink
                      to="/datacatalog"
                      activeClassName="ActiveNavButton"
                    >
                      Data Catalog
                    </NavLink>
                  </Button>
                  <Button className={styles.NavButton}>
                    <a href="https://satcherinstitute.github.io/data-visualization/02_covid19_death_disparities/">
                      Explore the Data
                    </a>
                  </Button>
                  <Button className={styles.NavButton}>
                    <NavLink
                      to="/exploredata"
                      activeClassName="ActiveNavButton"
                    >
                      (Ignore me)
                    </NavLink>
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
    </ThemeProvider>
  );
}

export default App;
