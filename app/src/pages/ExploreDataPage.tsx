import React, { useState, useEffect } from "react";
import Carousel from "react-material-ui-carousel";
import { Paper } from "@material-ui/core";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import DemoReport from "../features/reports/DemoReport";
import TellMeAboutReport from "../features/reports/TellMeAboutReport";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import ShareIcon from "@material-ui/icons/Share";
import { getMadLibPhraseText } from "../utils/MadLibs";

import {
  MADLIB_LIST,
  MadLib,
  PhraseSegment,
  PhraseSelections,
} from "../utils/MadLibs";
import styles from "./ExploreDataPage.module.scss";
import {
  clearSearchParams,
  MADLIB_PHRASE_PARAM,
  MADLIB_SELECTIONS_PARAM,
  useSearchParams,
  linkToMadLib,
} from "../utils/urlutils";

function ExploreDataPage() {
  const [shareModalOpen, setShareModalOpen] = React.useState(false);
  const params = useSearchParams();
  useEffect(() => {
    // TODO - it would be nice to have the params stay and update when selections are made
    // Until then, it's best to just clear them so they can't become mismatched
    clearSearchParams([MADLIB_PHRASE_PARAM, MADLIB_SELECTIONS_PARAM]);
  }, []);
  const [phraseIndex, setPhraseIndex] = useState<number>(
    Number(params[MADLIB_PHRASE_PARAM]) | 0
  );

  let defaultValuesWithOverrides = MADLIB_LIST[phraseIndex].defaultSelections;
  if (params[MADLIB_SELECTIONS_PARAM]) {
    params[MADLIB_SELECTIONS_PARAM].split(",").forEach((override) => {
      const [key, value] = override.split(":");
      // Validate that key is in valid range
      if (!Object.keys(MADLIB_LIST[phraseIndex].phrase).includes(key)) return;
      // Validate that value is in valid range
      if (
        !Object.keys(MADLIB_LIST[phraseIndex].phrase[Number(key)]).includes(
          value
        )
      )
        return;
      defaultValuesWithOverrides[Number(key)] = Number(value);
    });
  }
  const [phraseSelections, setPhraseSelections] = useState<PhraseSelections>(
    defaultValuesWithOverrides
  );

  useEffect(() => {
    setPhraseSelections({ ...MADLIB_LIST[phraseIndex].defaultSelections });
  }, [phraseIndex]);

  return (
    <React.Fragment>
      <Dialog
        open={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Link to this Report</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {linkToMadLib(phraseIndex, phraseSelections, true)}
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <div className={styles.CarouselContainer}>
        <Carousel
          className={styles.Carousel}
          timeout={200}
          autoPlay={false}
          indicators={false}
          animation="slide"
          navButtonsAlwaysVisible={true}
          index={phraseIndex}
          onChange={setPhraseIndex}
        >
          {MADLIB_LIST.map((madlib: MadLib, i) => (
            <Paper elevation={3} className={styles.CarouselItem} key={i}>
              <CarouselMadLib
                madlib={madlib}
                phraseSelections={phraseSelections}
                setPhraseSelections={setPhraseSelections}
                key={i}
              />
            </Paper>
          ))}
        </Carousel>
      </div>
      <div className={styles.ReportContainer}>
        <h1>
          {getMadLibPhraseText(MADLIB_LIST[phraseIndex], phraseSelections)}
          <IconButton
            aria-label="delete"
            color="primary"
            onClick={() => setShareModalOpen(true)}
          >
            <ShareIcon />
          </IconButton>
        </h1>
        {phraseIndex === 0 && (
          <DemoReport
            madlib={MADLIB_LIST[0]}
            phraseSelections={phraseSelections}
          />
        )}
        {phraseIndex === 1 && (
          <TellMeAboutReport
            madlib={MADLIB_LIST[1]}
            phraseSelections={phraseSelections}
          />
        )}
      </div>
    </React.Fragment>
  );
}

function CarouselMadLib(props: {
  madlib: MadLib;
  phraseSelections: PhraseSelections;
  setPhraseSelections: (newArray: PhraseSelections) => void;
}) {
  return (
    <React.Fragment>
      {props.madlib.phrase.map(
        (phraseSegment: PhraseSegment, index: number) => (
          <React.Fragment key={index}>
            {typeof phraseSegment === "string" ? (
              <React.Fragment>{phraseSegment}</React.Fragment>
            ) : (
              <FormControl>
                <Select
                  className={styles.MadLibSelect}
                  name={index.toString()}
                  defaultValue={props.madlib.defaultSelections[index]}
                  value={props.phraseSelections[index]}
                  onChange={(event) => {
                    let phraseIndex: number = Number(event.target.name);
                    let updatedArray: PhraseSelections = {
                      ...props.phraseSelections,
                    };
                    updatedArray[phraseIndex] = Number(event.target.value);
                    props.setPhraseSelections(updatedArray);
                  }}
                >
                  {Object.keys(phraseSegment).map((key: string) => (
                    <MenuItem key={key} value={Number(key)}>
                      {phraseSegment[Number(key)]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </React.Fragment>
        )
      )}
    </React.Fragment>
  );
}

export default ExploreDataPage;
