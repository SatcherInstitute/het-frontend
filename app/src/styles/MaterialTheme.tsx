import { createMuiTheme } from "@material-ui/core/styles";

const MaterialTheme = createMuiTheme({
  palette: {
    primary: {
      light: "#6a97bb",
      main: "#07538f",
      dark: "#054272",
    },
    secondary: {
      light: "#89D5CC",
      main: "#228B7E",
      dark: "#167B6F",
    },
  },
  overrides: {
    MuiPaper: {
      root: {
        "&.MuiPopover-paper": {
          maxWidth: "unset",
          minWidth: "unset",
          zIndex: "99999",
        },
      },
    },
  },
});

export default MaterialTheme;
