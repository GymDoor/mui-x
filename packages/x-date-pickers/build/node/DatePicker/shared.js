"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isYearOnlyView = exports.isYearAndMonthViews = void 0;
exports.useDatePickerDefaultizedProps = useDatePickerDefaultizedProps;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _styles = require("@mui/material/styles");

var _useUtils = require("../internals/hooks/useUtils");

const isYearOnlyView = views => views.length === 1 && views[0] === 'year';

exports.isYearOnlyView = isYearOnlyView;

const isYearAndMonthViews = views => views.length === 2 && views.indexOf('month') !== -1 && views.indexOf('year') !== -1;

exports.isYearAndMonthViews = isYearAndMonthViews;

const getFormatAndMaskByViews = (views, utils) => {
  if (isYearOnlyView(views)) {
    return {
      mask: '____',
      inputFormat: utils.formats.year
    };
  }

  if (isYearAndMonthViews(views)) {
    return {
      disableMaskedInput: true,
      inputFormat: utils.formats.monthAndYear
    };
  }

  return {
    mask: '__/__/____',
    inputFormat: utils.formats.keyboardDate
  };
};

function useDatePickerDefaultizedProps(props, name) {
  var _themeProps$views;

  const utils = (0, _useUtils.useUtils)();
  const defaultDates = (0, _useUtils.useDefaultDates)(); // This is technically unsound if the type parameters appear in optional props.
  // Optional props can be filled by `useThemeProps` with types that don't match the type parameters.

  const themeProps = (0, _styles.useThemeProps)({
    props,
    name
  });
  const views = (_themeProps$views = themeProps.views) != null ? _themeProps$views : ['year', 'day'];
  return (0, _extends2.default)({
    openTo: 'day',
    minDate: defaultDates.minDate,
    maxDate: defaultDates.maxDate
  }, getFormatAndMaskByViews(views, utils), themeProps, {
    views
  });
}