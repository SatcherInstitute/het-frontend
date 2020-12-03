import React from "react";
import styles from "./LandingPage.module.scss";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { LinkWithStickyParams } from "../utils/urlutils";
import { linkToMadLib } from "../utils/urlutils";
import ButtonBase from "@material-ui/core/ButtonBase";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  image: {
    position: "relative",
    height: "300px",
    width: "100%",
    [theme.breakpoints.down("xs")]: {
      width: "100% !important", // Overrides inline-style
      height: 100,
    },
    "&:hover, &$focusVisible": {
      zIndex: 1,
      "& $imageBackdrop": {
        opacity: 0.15,
      },
      "& $imageMarked": {
        opacity: 0,
      },
      "& $imageTitle": {
        border: "4px solid currentColor",
      },
    },
  },
  focusVisible: {},
  imageButton: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: theme.palette.common.white,
  },
  imageSrc: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundSize: "cover",
    backgroundPosition: "center 40%",
  },
  imageBackdrop: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: theme.palette.common.black,
    opacity: 0.4,
    transition: theme.transitions.create("opacity"),
  },
  imageTitle: {
    position: "relative",
    padding: `${theme.spacing(2)}px ${theme.spacing(4)}px ${
      theme.spacing(1) + 6
    }px`,
  },
  imageMarked: {
    height: 3,
    width: 18,
    backgroundColor: theme.palette.common.white,
    position: "absolute",
    bottom: -2,
    left: "calc(50% - 9px)",
    transition: theme.transitions.create("opacity"),
  },
}));

function ImageButton(props: { imageUrl: string; text: string; link: string }) {
  const classes = useStyles();

  return (
    <LinkWithStickyParams to={props.link}>
      <ButtonBase
        focusRipple
        key={props.text}
        className={classes.image}
        focusVisibleClassName={classes.focusVisible}
        style={{
          height: "300px",
          width: "100%",
        }}
      >
        <span
          className={classes.imageSrc}
          style={{
            backgroundImage: `url(${props.imageUrl})`,
          }}
        />
        <span className={classes.imageBackdrop} />
        <span className={classes.imageButton}>
          <Typography
            component="span"
            variant="subtitle1"
            color="inherit"
            className={classes.imageTitle}
          >
            {props.text}
            <span className={classes.imageMarked} />
          </Typography>
        </span>
      </ButtonBase>
    </LinkWithStickyParams>
  );
}

function LandingPage() {
  const classes = useStyles();

  return (
    <div className={styles.LandingPage}>
      <Grid container justify="space-around" className={styles.Grid}>
        <Grid item xs={12} sm={4} className={styles.GreySquare}>
          <img
            height="200px"
            width="200px"
            alt="placeholder"
            src="https://upload.wikimedia.org/wikipedia/commons/5/56/David_Satcher_official_photo_portrait.jpg"
          />
          <Typography variant="h6" align="left">
            Our Initiative
          </Typography>
          <p>
            We convene staff from all divisions who help streamline coordination
            and foster collaboration of health equity efforts within the agency.
          </p>
        </Grid>
        <Grid item xs={12} sm={4} className={styles.GreySquare}>
          <img
            height="200px"
            width="200px"
            alt="placeholder"
            src="https://d2gg9evh47fn9z.cloudfront.net/800px_COLOURBOX3311922.jpg"
          />
          <Typography variant="h6" align="left">
            Our Project
          </Typography>
          <p>
            Social determinants of health are conditions which influence
            individual and population health. For a health equity analysis, one
            must describe the connection between SDOH and health using
            well-documented research.
          </p>
        </Grid>
        <Grid item xs={12} sm={4} className={styles.GreySquare}>
          <img
            height="200px"
            width="200px"
            alt="placeholder"
            src="https://www.aamc.org/sites/default/files/Research-laboratory-993475228.jpg"
          />
          <Typography variant="h6" align="left">
            Our Impact
          </Typography>
          <p>
            We bring together health equity leaders, organizations and
            institutions from across the states, share best practices and
            identify common goals to advance health equity.
          </p>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5" align="left">
            Join our Efforts
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} className={styles.BlueLandingSquare}>
          <Typography variant="h6" className={styles.HomeLogo}>
            COPD in the USA
          </Typography>
          <p>Florida has the highest cases of COPD in the united states.</p>
        </Grid>
        <Grid item xs={12} sm={6} className={styles.LandingSquare}>
          <ImageButton
            imageUrl="img/copd_usa.png"
            text="Explore the Data"
            link={linkToMadLib("compare", { 3: 12 })}
          />
        </Grid>
        <Grid item xs={12} sm={6} className={styles.LandingSquare}>
          <ImageButton
            imageUrl="img/penn_unemp.png"
            text="Explore the Data"
            link={linkToMadLib("covid", { 3: 42 })}
          />
        </Grid>
        <Grid item xs={12} sm={6} className={styles.GreenLandingSquare}>
          <Typography variant="h6" className={styles.HomeLogo}>
            COVID-19 in Pennsylvania
          </Typography>
          <p>
            Look at where the highest rates of COVID-19 are in the state of
            Pennsylvania
          </p>
        </Grid>
        <Grid item xs={12} sm={6} className={styles.BlueLandingSquare}>
          <Typography variant="h6" className={styles.HomeLogo}>
            Diabetes in American Indian/Alaska Native, non hispanic population
          </Typography>
          <p>Explore racial breakdowns of Diabetes data in the United States</p>
        </Grid>
        <Grid item xs={12} sm={6} className={styles.LandingSquare}>
          <ImageButton
            imageUrl="img/diabetes_amin.png"
            text="Explore the Data"
            link={linkToMadLib("diabetes", { 1: 0 })}
          />
        </Grid>
        <Grid item xs={12} container className={styles.GreenLandingSquare}>
          <Grid item xs={12} sm={6}>
            <img
              height="300px"
              alt="placeholder"
              src="https://images-na.ssl-images-amazon.com/images/I/41dnPeFppOL._SX353_BO1,204,203,200_.jpg"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" className={styles.HomeLogo}>
              The Political Determints of Health
            </Typography>
            <p>
              Daniel Dawes argues that political determinants of health create
              the social drivers that affect all other dynamics of health. By
              understanding these determinants, we will be better equipped to
              implement actionable solutions to close the health gap.
              <Button variant="outlined">Explore Data</Button>
            </p>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default LandingPage;
