import _extends from "@babel/runtime/helpers/esm/extends";
import { useDefaultDates, useUtils } from '@mui/x-date-pickers/internals';
import { useThemeProps } from '@mui/material/styles';
export function useDateRangePickerDefaultizedProps(props, name) {
  const utils = useUtils();
  const defaultDates = useDefaultDates(); // This is technically unsound if the type parameters appear in optional props.
  // Optional props can be filled by `useThemeProps` with types that don't match the type parameters.

  const themeProps = useThemeProps({
    props,
    name
  });
  return _extends({
    calendars: 2,
    mask: '__/__/____',
    startText: 'Start',
    endText: 'End',
    inputFormat: utils.formats.keyboardDate,
    minDate: defaultDates.minDate,
    maxDate: defaultDates.maxDate
  }, themeProps);
}