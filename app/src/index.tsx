import React from "react";
import ReactDOM from "react-dom";
import "./styles/index.scss";
import App from "./App";
require("typeface-hind");
require("typeface-montserrat");

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
