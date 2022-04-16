import { useValidation, validateDate } from '@mui/x-date-pickers/internals';
import { isRangeValid } from '../../utils/date-utils';
export const validateDateRange = (utils, value, dateValidationProps) => {
  const [start, end] = value; // for partial input

  if (start === null || end === null) {
    return [null, null];
  }

  const dateValidations = [validateDate(utils, start, dateValidationProps), validateDate(utils, end, dateValidationProps)];

  if (dateValidations[0] || dateValidations[1]) {
    return dateValidations;
  }

  if (!isRangeValid(utils, [utils.date(start), utils.date(end)])) {
    return ['invalidRange', 'invalidRange'];
  }

  return [null, null];
};

const isSameDateRangeError = (a, b) => b !== null && a[1] === b[1] && a[0] === b[0];

export const useDateRangeValidation = props => {
  return useValidation(props, validateDateRange, isSameDateRangeError);
};