import _extends from "@babel/runtime/helpers/esm/extends";
import { useThemeProps } from '@mui/material/styles';
import { Clock } from '../internals/components/icons';
import { useUtils } from '../internals/hooks/useUtils';

function getTextFieldAriaText(value, utils) {
  return value && utils.isValid(utils.date(value)) ? `Choose time, selected time is ${utils.format(utils.date(value), 'fullTime')}` : 'Choose time';
}

export function useTimePickerDefaultizedProps(props, name) {
  var _themeProps$ampm;

  // This is technically unsound if the type parameters appear in optional props.
  // Optional props can be filled by `useThemeProps` with types that don't match the type parameters.
  const themeProps = useThemeProps({
    props,
    name
  });
  const utils = useUtils();
  const ampm = (_themeProps$ampm = themeProps.ampm) != null ? _themeProps$ampm : utils.is12HourCycleInCurrentLocale();
  return _extends({
    ampm,
    openTo: 'hours',
    views: ['hours', 'minutes'],
    acceptRegex: ampm ? /[\dapAP]/gi : /\d/gi,
    mask: '__:__',
    disableMaskedInput: ampm,
    getOpenDialogAriaText: getTextFieldAriaText,
    inputFormat: ampm ? utils.formats.fullTime12h : utils.formats.fullTime24h
  }, themeProps, {
    components: _extends({
      OpenPickerIcon: Clock
    }, themeProps.components)
  });
}