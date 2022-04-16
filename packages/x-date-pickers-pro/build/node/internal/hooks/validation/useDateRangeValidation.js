"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateDateRange = exports.useDateRangeValidation = void 0;

var _internals = require("@mui/x-date-pickers/internals");

var _dateUtils = require("../../utils/date-utils");

const validateDateRange = (utils, value, dateValidationProps) => {
  const [start, end] = value; // for partial input

  if (start === null || end === null) {
    return [null, null];
  }

  const dateValidations = [(0, _internals.validateDate)(utils, start, dateValidationProps), (0, _internals.validateDate)(utils, end, dateValidationProps)];

  if (dateValidations[0] || dateValidations[1]) {
    return dateValidations;
  }

  if (!(0, _dateUtils.isRangeValid)(utils, [utils.date(start), utils.date(end)])) {
    return ['invalidRange', 'invalidRange'];
  }

  return [null, null];
};

exports.validateDateRange = validateDateRange;

const isSameDateRangeError = (a, b) => b !== null && a[1] === b[1] && a[0] === b[0];

const useDateRangeValidation = props => {
  return (0, _internals.useValidation)(props, validateDateRange, isSameDateRangeError);
};

exports.useDateRangeValidation = useDateRangeValidation;