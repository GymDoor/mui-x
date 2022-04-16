"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useDateRangePickerDefaultizedProps = useDateRangePickerDefaultizedProps;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _internals = require("@mui/x-date-pickers/internals");

var _styles = require("@mui/material/styles");

function useDateRangePickerDefaultizedProps(props, name) {
  const utils = (0, _internals.useUtils)();
  const defaultDates = (0, _internals.useDefaultDates)(); // This is technically unsound if the type parameters appear in optional props.
  // Optional props can be filled by `useThemeProps` with types that don't match the type parameters.

  const themeProps = (0, _styles.useThemeProps)({
    props,
    name
  });
  return (0, _extends2.default)({
    calendars: 2,
    mask: '__/__/____',
    startText: 'Start',
    endText: 'End',
    inputFormat: utils.formats.keyboardDate,
    minDate: defaultDates.minDate,
    maxDate: defaultDates.maxDate
  }, themeProps);
}