"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useTimePickerDefaultizedProps = useTimePickerDefaultizedProps;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _styles = require("@mui/material/styles");

var _icons = require("../internals/components/icons");

var _useUtils = require("../internals/hooks/useUtils");

function getTextFieldAriaText(value, utils) {
  return value && utils.isValid(utils.date(value)) ? `Choose time, selected time is ${utils.format(utils.date(value), 'fullTime')}` : 'Choose time';
}

function useTimePickerDefaultizedProps(props, name) {
  var _themeProps$ampm;

  // This is technically unsound if the type parameters appear in optional props.
  // Optional props can be filled by `useThemeProps` with types that don't match the type parameters.
  const themeProps = (0, _styles.useThemeProps)({
    props,
    name
  });
  const utils = (0, _useUtils.useUtils)();
  const ampm = (_themeProps$ampm = themeProps.ampm) != null ? _themeProps$ampm : utils.is12HourCycleInCurrentLocale();
  return (0, _extends2.default)({
    ampm,
    openTo: 'hours',
    views: ['hours', 'minutes'],
    acceptRegex: ampm ? /[\dapAP]/gi : /\d/gi,
    mask: '__:__',
    disableMaskedInput: ampm,
    getOpenDialogAriaText: getTextFieldAriaText,
    inputFormat: ampm ? utils.formats.fullTime12h : utils.formats.fullTime24h
  }, themeProps, {
    components: (0, _extends2.default)({
      OpenPickerIcon: _icons.Clock
    }, themeProps.components)
  });
}