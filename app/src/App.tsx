import React, { useState, useEffect } from "react";
import styles from "./App.module.scss";
import MaterialTheme from "./styles/MaterialTheme";
import DataCatalogPage from "./pages/DataCatalogPage";
import ExploreDataPage from "./pages/ExploreDataPage";
import LandingPage from "./pages/LandingPage";
import NotFoundPage from "./pages/NotFoundPage";
import Footer from "./Footer";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Toolbar from "@material-ui/core/Toolbar";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import { ThemeProvider } from "@material-ui/styles";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import {
  useDatasetStoreProvider,
  DatasetProvider,
  startMetadataLoad,
} from "./utils/useDatasetStore";
import { LinkWithStickyParams } from "./utils/urlutils";
import AboutUsPage from "./pages/AboutUsPage";

startMetadataLoad();

function MobileAppToolbar() {
  const [open, setOpen] = useState(false);

  function ListItemLink(props: any) {
    return <ListItem button component="a" {...props} />;
  }

  return (
    <Toolbar>
      <IconButton onClick={() => setOpen(true)}>
        <MenuIcon />
      </IconButton>
      <Drawer variant="persistent" anchor="left" open={open}>
        <Button onClick={() => setOpen(false)}>
          <ChevronLeftIcon />
        </Button>
        <List>
          <ListItemLink href="/">
            <ListItemText primary="Homepage" />
          </ListItemLink>
          <ListItemLink href="/aboutus">
            <ListItemText primary="About Us" />
          </ListItemLink>
          <ListItemLink href="/datacatalog">
            <ListItemText primary="Data Sources & Methodology" />
          </ListItemLink>
          <ListItemLink href="/exploredata">
            <ListItemText primary="Explore the Data" />
          </ListItemLink>
        </List>
      </Drawer>
    </Toolbar>
  );
}

function AppToolbar() {
  return (
    <Toolbar>
      <Typography variant="h6" className={styles.HomeLogo}>
        <LinkWithStickyParams to="/">
          Health Equity Tracker
        </LinkWithStickyParams>
      </Typography>
      <Button className={styles.NavButton}>
        <LinkWithStickyParams to="/aboutus">About us</LinkWithStickyParams>
      </Button>
      <Button className={styles.NavButton}>
        <LinkWithStickyParams to="/datacatalog">
          Data Sources & Methodology
        </LinkWithStickyParams>
      </Button>
      <Button className={styles.NavButton}>
        <LinkWithStickyParams to="/exploredata">
          Explore the Data
        </LinkWithStickyParams>
      </Button>
      <Button className={styles.NavButton}>
        <a href="https://satcherinstitute.github.io/data-visualization/02_covid19_death_disparities/">
          Prototypes
        </a>
      </Button>
    </Toolbar>
  );
}

function App() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    /* Inside of a "useEffect" hook add an event listener that updates
           the "width" state variable when the window size changes */
    window.addEventListener("resize", () => setWidth(window.innerWidth));

    /* passing an empty array as the dependencies of the effect will cause this
           effect to only run when the component mounts, and not each time it updates.
           We only want the listener to be added once */
  }, []);
  const breakpoint = 600;

  const datasetStore = useDatasetStoreProvider();
  return (
    <ThemeProvider theme={MaterialTheme}>
      <DatasetProvider value={datasetStore}>
        <div className={styles.App}>
          <div className={styles.Content}>
            <Router>
              <AppBar position="static">
                {width > breakpoint ? <AppToolbar /> : <MobileAppToolbar />}
              </AppBar>

              <Switch>
                <Route path="/aboutus" component={AboutUsPage} />
                <Route path="/datacatalog" component={DataCatalogPage} />
                <Route path="/exploredata" component={ExploreDataPage} />
                <Route exact path="/" component={LandingPage} />
                <Route component={NotFoundPage} />
              </Switch>
            </Router>
          </div>
          <Footer />
        </div>
      </DatasetProvider>
    </ThemeProvider>
  );
}

export default App;
