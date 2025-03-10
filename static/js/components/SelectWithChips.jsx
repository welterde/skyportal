import React, { useState } from "react";
import PropTypes from "prop-types";
import makeStyles from "@mui/styles/makeStyles";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  Chip,
} from "@mui/material";

const useStyles = makeStyles((theme) => ({
  chips: {
    display: "flex",
    flexWrap: "wrap",
    maxWidth: "25rem",
  },
  formControl: {
    minWidth: "12rem",
    paddingRight: theme.spacing(1),
  },
}));

const getStyles = (option, opts, theme) => ({
  fontWeight:
    opts.indexOf(option) === -1
      ? theme.typography.fontWeightRegular
      : theme.typography.fontWeightMedium,
});

const SelectWithChips = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const [opts, setOpts] = useState([]);
  const { label, id, initValue, onChange, options } = props;
  const MAX_CHAR = 90;
  const cumSum = [];

  initValue?.forEach((item, index) => {
    cumSum.push(item?.length + (index > 0 ? cumSum[index - 1] : 0));
  });

  const max_chips_nb =
    initValue?.length > 0 && !initValue.some((word) => word === undefined)
      ? cumSum.filter((sum) => sum <= MAX_CHAR).length
      : -1;

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: "20rem",
      },
    },
  };

  return (
    <>
      <FormControl key={`${id}${label}`} className={classes.formControl}>
        <InputLabel key={`${id}${label}`}>{label}</InputLabel>
        <Select
          id={id}
          multiple
          value={initValue || []}
          onChange={(event) => {
            onChange(event);
            setOpts(
              event.target.value.includes("Clear selections")
                ? []
                : event.target.value
            );
          }}
          renderValue={(selected) => (
            <div className={classes.chips}>
              {selected.map((value) =>
                selected.indexOf(value) < max_chips_nb ? (
                  <Chip key={value} label={value} />
                ) : (
                  selected.indexOf(value) === max_chips_nb && (
                    <Chip
                      key={value}
                      label={`+${selected?.length - max_chips_nb}`}
                    />
                  )
                )
              )}
            </div>
          )}
          MenuProps={MenuProps}
        >
          {options?.map((option) => (
            <MenuItem
              key={option}
              value={option}
              style={getStyles(option, opts, theme)}
            >
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
};

SelectWithChips.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  initValue: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
};

SelectWithChips.defaultProps = {
  initValue: [],
};

export default SelectWithChips;
