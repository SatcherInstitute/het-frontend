import React from "react";
import ArrowDropUp from "@material-ui/icons/ArrowDropUp";
import ArrowDropDown from "@material-ui/icons/ArrowDropDown";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Fips } from "../utils/madlib/Fips";
import Popover from "@material-ui/core/Popover";
import Button from "@material-ui/core/Button";

function FipsSelector(props: {
  value: string;
  options: Fips[];
  onGeoUpdate: Function;
}) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <>
      <Button
        aria-describedby={id}
        variant="outlined"
        color="primary"
        onClick={handleClick}
      >
        {new Fips(props.value).getFullDisplayName()}
        {!open && <ArrowDropDown />}
        {open && <ArrowDropUp />}
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <span>Search for location</span>
        <Autocomplete
          disableClearable={true}
          options={props.options}
          clearOnEscape={true}
          getOptionLabel={(fips) => fips.getFullDisplayName()}
          getOptionSelected={(fips) => fips.code === props.value}
          renderOption={(fips) => <>{fips.getFullDisplayName()}</>}
          renderInput={(params) => (
            <TextField
              placeholder="County, State, Territory or United States"
              margin="dense"
              {...params}
            />
          )}
          onChange={(e, fips) => {
            props.onGeoUpdate(fips.code);
            handleClose();
          }}
        />
        <span>
          Note: City and census tract location is currently unavailable
        </span>
      </Popover>
    </>
  );
}

export default FipsSelector;
