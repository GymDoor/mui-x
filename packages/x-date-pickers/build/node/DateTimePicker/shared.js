"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useDateTimePickerDefaultizedProps = useDateTimePickerDefaultizedProps;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _styles = require("@mui/material/styles");

var _useUtils = require("../internals/hooks/useUtils");

function useDateTimePickerDefaultizedProps(props, name) {
  var _themeProps$ampm, _ref, _themeProps$minDateTi, _ref2, _themeProps$maxDateTi, _themeProps$minDateTi2, _themeProps$maxDateTi2;

  // This is technically unsound if the type parameters appear in optional props.
  // Optional props can be filled by `useThemeProps` with types that don't match the type parameters.
  const themeProps = (0, _styles.useThemeProps)({
    props,
    name
  });
  const utils = (0, _useUtils.useUtils)();
  const defaultDates = (0, _useUtils.useDefaultDates)();
  const ampm = (_themeProps$ampm = themeProps.ampm) != null ? _themeProps$ampm : utils.is12HourCycleInCurrentLocale();

  if (themeProps.orientation != null && themeProps.orientation !== 'portrait') {
    throw new Error('We are not supporting custom orientation for DateTimePicker yet :(');
  }

  return (0, _extends2.default)({
    ampm,
    orientation: 'portrait',
    openTo: 'day',
    views: ['year', 'day', 'hours', 'minutes'],
    ampmInClock: true,
    showToolbar: false,
    allowSameDateSelection: true,
    mask: '__/__/____ __:__',
    acceptRegex: ampm ? /[\dap]/gi : /\d/gi,
    disableMaskedInput: ampm,
    inputFormat: ampm ? utils.formats.keyboardDateTime12h : utils.formats.keyboardDateTime24h,
    disableIgnoringDatePartForTimeValidation: Boolean(themeProps.minDateTime || themeProps.maxDateTime)
  }, themeProps, {
    minDate: (_ref = (_themeProps$minDateTi = themeProps.minDateTime) != null ? _themeProps$minDateTi : themeProps.minDate) != null ? _ref : defaultDates.minDate,
    maxDate: (_ref2 = (_themeProps$maxDateTi = themeProps.maxDateTime) != null ? _themeProps$maxDateTi : themeProps.maxDate) != null ? _ref2 : defaultDates.maxDate,
    minTime: (_themeProps$minDateTi2 = themeProps.minDateTime) != null ? _themeProps$minDateTi2 : themeProps.minTime,
    maxTime: (_themeProps$maxDateTi2 = themeProps.maxDateTime) != null ? _themeProps$maxDateTi2 : themeProps.maxTime
  });
}