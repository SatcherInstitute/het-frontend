import React from "react";
import useSearchParams from "./useSearchParams";
import { Link } from "react-router-dom";

export const STICKY_VERSION_PARAM = "sv";

function LinkWithStickyParams(props: {
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

export default LinkWithStickyParams;
