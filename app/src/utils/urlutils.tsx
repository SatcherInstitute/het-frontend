import React from "react";
import { Link, useLocation } from "react-router-dom";
import { PhraseSelections } from "../utils/MadLibs";
export const STICKY_VERSION_PARAM = "sv";

// Value is a comma-separated list of dataset ids. Dataset ids cannot have
// commas in them.
export const DATASET_PRE_FILTERS = "dpf";

// Value is index of the phrase to jump to
export const MADLIB_PHRASE = "mlp";

// Value is a comma-separated list mapping indicies to values with : delimiter
// Values are applied on top of defaults so you only need to specify those that differ
// mls=0:1,2:5
export const MADLIB_SELECTIONS = "mls";

export function LinkWithStickyParams(props: {
  to: string;
  children: React.ReactNode;
}) {
  let params = useSearchParams();
  let newUrl = props.to;
  if (params[STICKY_VERSION_PARAM]) {
    // Note: doesn't handle urls that already have params on them.
    newUrl =
      newUrl + `?${STICKY_VERSION_PARAM}=${params[STICKY_VERSION_PARAM]}`;
  }
  return <Link to={newUrl}>{props.children}</Link>;
}

export function useSearchParams() {
  // Note: URLSearchParams doesn't support IE, if we keep this code and we want
  // to support IE we'll need to change it.
  const params = new URLSearchParams(useLocation().search);
  return Object.fromEntries(params.entries());
}

/**
 * Removes the provided search params from the displayed url, so that the user
 * doesn't see them and so that reloads will not include the params.
 */
export function clearSearchParams(params: string[]) {
  const originalUrl = window.location.href;
  const url = new URL(originalUrl);
  params.forEach((param) => {
    url.searchParams.delete(param);
  });
  const newUrl = url.toString();
  if (newUrl !== originalUrl) {
    window.history.replaceState(null /* state */, "" /* title */, newUrl);
  }
}

export function buildMadLibSelectionParams(phraseSelections: PhraseSelections) {
  const overrides = Object.keys(phraseSelections).map(
    (key) => key + ":" + phraseSelections[Number(key)]
  );
  return MADLIB_SELECTIONS + "=" + overrides.join(",");
}
