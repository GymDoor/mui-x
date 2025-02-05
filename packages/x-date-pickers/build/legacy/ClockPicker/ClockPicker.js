import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { unstable_useId as useId } from '@mui/utils';
import { styled, useThemeProps } from '@mui/material/styles';
import { unstable_composeClasses as composeClasses } from '@mui/material';
import { Clock } from './Clock';
import { pipe } from '../internals/utils/utils';
import { useUtils, useNow } from '../internals/hooks/useUtils';
import { getHourNumbers, getMinutesNumbers } from './ClockNumbers';
import { PickersArrowSwitcher } from '../internals/components/PickersArrowSwitcher';
import { convertValueToMeridiem, createIsAfterIgnoreDatePart } from '../internals/utils/time-utils';
import { useViews } from '../internals/hooks/useViews';
import { useMeridiemMode } from '../internals/hooks/date-helpers-hooks';
import { getClockPickerUtilityClass } from './clockPickerClasses';
import { PickerViewRoot } from '../internals/components/PickerViewRoot';
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";

var useUtilityClasses = function useUtilityClasses(ownerState) {
  var classes = ownerState.classes;
  var slots = {
    root: ['root'],
    arrowSwitcher: ['arrowSwitcher']
  };
  return composeClasses(slots, getClockPickerUtilityClass, classes);
};

var ClockPickerRoot = styled(PickerViewRoot, {
  name: 'MuiClockPicker',
  slot: 'Root',
  overridesResolver: function overridesResolver(props, styles) {
    return styles.root;
  }
})({
  display: 'flex',
  flexDirection: 'column'
});
var ClockPickerArrowSwitcher = styled(PickersArrowSwitcher, {
  name: 'MuiClockPicker',
  slot: 'ArrowSwitcher',
  overridesResolver: function overridesResolver(props, styles) {
    return styles.arrowSwitcher;
  }
})({
  position: 'absolute',
  right: 12,
  top: 15
});

var defaultGetClockLabelText = function defaultGetClockLabelText(view, time, adapter) {
  return "Select ".concat(view, ". ").concat(time === null ? 'No time selected' : "Selected time is ".concat(adapter.format(time, 'fullTime')));
};

var defaultGetMinutesClockNumberText = function defaultGetMinutesClockNumberText(minutes) {
  return "".concat(minutes, " minutes");
};

var defaultGetHoursClockNumberText = function defaultGetHoursClockNumberText(hours) {
  return "".concat(hours, " hours");
};

var defaultGetSecondsClockNumberText = function defaultGetSecondsClockNumberText(seconds) {
  return "".concat(seconds, " seconds");
};

/**
 *
 * API:
 *
 * - [ClockPicker API](https://mui.com/x/api/date-pickers/clock-picker/)
 */
export var ClockPicker = /*#__PURE__*/React.forwardRef(function ClockPicker(inProps, ref) {
  var props = useThemeProps({
    props: inProps,
    name: 'MuiClockPicker'
  });
  var _props$ampm = props.ampm,
      ampm = _props$ampm === void 0 ? false : _props$ampm,
      _props$ampmInClock = props.ampmInClock,
      ampmInClock = _props$ampmInClock === void 0 ? false : _props$ampmInClock,
      autoFocus = props.autoFocus,
      components = props.components,
      componentsProps = props.componentsProps,
      date = props.date,
      _props$disableIgnorin = props.disableIgnoringDatePartForTimeValidation,
      disableIgnoringDatePartForTimeValidation = _props$disableIgnorin === void 0 ? false : _props$disableIgnorin,
      _props$getClockLabelT = props.getClockLabelText,
      getClockLabelText = _props$getClockLabelT === void 0 ? defaultGetClockLabelText : _props$getClockLabelT,
      _props$getHoursClockN = props.getHoursClockNumberText,
      getHoursClockNumberText = _props$getHoursClockN === void 0 ? defaultGetHoursClockNumberText : _props$getHoursClockN,
      _props$getMinutesCloc = props.getMinutesClockNumberText,
      getMinutesClockNumberText = _props$getMinutesCloc === void 0 ? defaultGetMinutesClockNumberText : _props$getMinutesCloc,
      _props$getSecondsCloc = props.getSecondsClockNumberText,
      getSecondsClockNumberText = _props$getSecondsCloc === void 0 ? defaultGetSecondsClockNumberText : _props$getSecondsCloc,
      _props$leftArrowButto = props.leftArrowButtonText,
      leftArrowButtonText = _props$leftArrowButto === void 0 ? 'open previous view' : _props$leftArrowButto,
      maxTime = props.maxTime,
      minTime = props.minTime,
      _props$minutesStep = props.minutesStep,
      minutesStep = _props$minutesStep === void 0 ? 1 : _props$minutesStep,
      _props$rightArrowButt = props.rightArrowButtonText,
      rightArrowButtonText = _props$rightArrowButt === void 0 ? 'open next view' : _props$rightArrowButt,
      shouldDisableTime = props.shouldDisableTime,
      showViewSwitcher = props.showViewSwitcher,
      onChange = props.onChange,
      view = props.view,
      _props$views = props.views,
      views = _props$views === void 0 ? ['hours', 'minutes'] : _props$views,
      openTo = props.openTo,
      onViewChange = props.onViewChange,
      className = props.className;

  var _useViews = useViews({
    view: view,
    views: views,
    openTo: openTo,
    onViewChange: onViewChange,
    onChange: onChange
  }),
      openView = _useViews.openView,
      setOpenView = _useViews.setOpenView,
      nextView = _useViews.nextView,
      previousView = _useViews.previousView,
      handleChangeAndOpenNext = _useViews.handleChangeAndOpenNext;

  var now = useNow();
  var utils = useUtils();
  var midnight = utils.setSeconds(utils.setMinutes(utils.setHours(now, 0), 0), 0);
  var dateOrMidnight = date || midnight;

  var _useMeridiemMode = useMeridiemMode(dateOrMidnight, ampm, handleChangeAndOpenNext),
      meridiemMode = _useMeridiemMode.meridiemMode,
      handleMeridiemChange = _useMeridiemMode.handleMeridiemChange;

  var isTimeDisabled = React.useCallback(function (rawValue, viewType) {
    if (date === null) {
      return false;
    }

    var validateTimeValue = function validateTimeValue(getRequestedTimePoint) {
      var isAfterComparingFn = createIsAfterIgnoreDatePart(disableIgnoringDatePartForTimeValidation, utils);
      return Boolean(minTime && isAfterComparingFn(minTime, getRequestedTimePoint('end')) || maxTime && isAfterComparingFn(getRequestedTimePoint('start'), maxTime) || shouldDisableTime && shouldDisableTime(rawValue, viewType));
    };

    switch (viewType) {
      case 'hours':
        {
          var hoursWithMeridiem = convertValueToMeridiem(rawValue, meridiemMode, ampm);
          return validateTimeValue(function (when) {
            return pipe(function (currentDate) {
              return utils.setHours(currentDate, hoursWithMeridiem);
            }, function (dateWithHours) {
              return utils.setMinutes(dateWithHours, when === 'start' ? 0 : 59);
            }, function (dateWithMinutes) {
              return utils.setSeconds(dateWithMinutes, when === 'start' ? 0 : 59);
            })(date);
          });
        }

      case 'minutes':
        return validateTimeValue(function (when) {
          return pipe(function (currentDate) {
            return utils.setMinutes(currentDate, rawValue);
          }, function (dateWithMinutes) {
            return utils.setSeconds(dateWithMinutes, when === 'start' ? 0 : 59);
          })(date);
        });

      case 'seconds':
        return validateTimeValue(function () {
          return utils.setSeconds(date, rawValue);
        });

      default:
        throw new Error('not supported');
    }
  }, [ampm, date, disableIgnoringDatePartForTimeValidation, maxTime, meridiemMode, minTime, shouldDisableTime, utils]);
  var selectedId = useId();
  var viewProps = React.useMemo(function () {
    switch (openView) {
      case 'hours':
        {
          var handleHoursChange = function handleHoursChange(value, isFinish) {
            var valueWithMeridiem = convertValueToMeridiem(value, meridiemMode, ampm);
            handleChangeAndOpenNext(utils.setHours(dateOrMidnight, valueWithMeridiem), isFinish);
          };

          return {
            onChange: handleHoursChange,
            value: utils.getHours(dateOrMidnight),
            children: getHourNumbers({
              date: date,
              utils: utils,
              ampm: ampm,
              onChange: handleHoursChange,
              getClockNumberText: getHoursClockNumberText,
              isDisabled: function isDisabled(value) {
                return isTimeDisabled(value, 'hours');
              },
              selectedId: selectedId
            })
          };
        }

      case 'minutes':
        {
          var minutesValue = utils.getMinutes(dateOrMidnight);

          var handleMinutesChange = function handleMinutesChange(value, isFinish) {
            handleChangeAndOpenNext(utils.setMinutes(dateOrMidnight, value), isFinish);
          };

          return {
            value: minutesValue,
            onChange: handleMinutesChange,
            children: getMinutesNumbers({
              utils: utils,
              value: minutesValue,
              onChange: handleMinutesChange,
              getClockNumberText: getMinutesClockNumberText,
              isDisabled: function isDisabled(value) {
                return isTimeDisabled(value, 'minutes');
              },
              selectedId: selectedId
            })
          };
        }

      case 'seconds':
        {
          var secondsValue = utils.getSeconds(dateOrMidnight);

          var handleSecondsChange = function handleSecondsChange(value, isFinish) {
            handleChangeAndOpenNext(utils.setSeconds(dateOrMidnight, value), isFinish);
          };

          return {
            value: secondsValue,
            onChange: handleSecondsChange,
            children: getMinutesNumbers({
              utils: utils,
              value: secondsValue,
              onChange: handleSecondsChange,
              getClockNumberText: getSecondsClockNumberText,
              isDisabled: function isDisabled(value) {
                return isTimeDisabled(value, 'seconds');
              },
              selectedId: selectedId
            })
          };
        }

      default:
        throw new Error('You must provide the type for ClockView');
    }
  }, [openView, utils, date, ampm, getHoursClockNumberText, getMinutesClockNumberText, getSecondsClockNumberText, meridiemMode, handleChangeAndOpenNext, dateOrMidnight, isTimeDisabled, selectedId]);
  var ownerState = props;
  var classes = useUtilityClasses(ownerState);
  return /*#__PURE__*/_jsxs(ClockPickerRoot, {
    ref: ref,
    className: clsx(classes.root, className),
    ownerState: ownerState,
    children: [showViewSwitcher && /*#__PURE__*/_jsx(ClockPickerArrowSwitcher, {
      className: classes.arrowSwitcher,
      leftArrowButtonText: leftArrowButtonText,
      rightArrowButtonText: rightArrowButtonText,
      components: components,
      componentsProps: componentsProps,
      onLeftClick: function onLeftClick() {
        return setOpenView(previousView);
      },
      onRightClick: function onRightClick() {
        return setOpenView(nextView);
      },
      isLeftDisabled: !previousView,
      isRightDisabled: !nextView,
      ownerState: ownerState
    }), /*#__PURE__*/_jsx(Clock, _extends({
      autoFocus: autoFocus,
      date: date,
      ampmInClock: ampmInClock,
      type: openView,
      ampm: ampm,
      getClockLabelText: getClockLabelText,
      minutesStep: minutesStep,
      isTimeDisabled: isTimeDisabled,
      meridiemMode: meridiemMode,
      handleMeridiemChange: handleMeridiemChange,
      selectedId: selectedId
    }, viewProps))]
  });
});
process.env.NODE_ENV !== "production" ? ClockPicker.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------

  /**
   * 12h/24h view for hour selection clock.
   * @default false
   */
  ampm: PropTypes.bool,

  /**
   * Display ampm controls under the clock (instead of in the toolbar).
   * @default false
   */
  ampmInClock: PropTypes.bool,

  /**
   * Set to `true` if focus should be moved to clock picker.
   */
  autoFocus: PropTypes.bool,

  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  className: PropTypes.string,

  /**
   * The components used for each slot.
   * Either a string to use an HTML element or a component.
   */
  components: PropTypes.object,

  /**
   * The props used for each slot inside.
   */
  componentsProps: PropTypes.object,

  /**
   * Selected date @DateIOType.
   */
  date: PropTypes.any,

  /**
   * Do not ignore date part when validating min/max time.
   * @default false
   */
  disableIgnoringDatePartForTimeValidation: PropTypes.bool,

  /**
   * Accessible text that helps user to understand which time and view is selected.
   * @template TDate
   * @param {ClockPickerView} view The current view rendered.
   * @param {TDate | null} time The current time.
   * @param {MuiPickersAdapter<TDate>} adapter The current date adapter.
   * @returns {string} The clock label.
   * @default <TDate extends any>(
   *   view: ClockView,
   *   time: TDate | null,
   *   adapter: MuiPickersAdapter<TDate>,
   * ) =>
   *   `Select ${view}. ${
   *     time === null ? 'No time selected' : `Selected time is ${adapter.format(time, 'fullTime')}`
   *   }`
   */
  getClockLabelText: PropTypes.func,

  /**
   * Get clock number aria-text for hours.
   * @param {string} hours The hours to format.
   * @returns {string} the formatted hours text.
   * @default (hours: string) => `${hours} hours`
   */
  getHoursClockNumberText: PropTypes.func,

  /**
   * Get clock number aria-text for minutes.
   * @param {string} minutes The minutes to format.
   * @returns {string} the formatted minutes text.
   * @default (minutes: string) => `${minutes} minutes`
   */
  getMinutesClockNumberText: PropTypes.func,

  /**
   * Get clock number aria-text for seconds.
   * @param {string} seconds The seconds to format.
   * @returns {string} the formatted seconds text.
   * @default (seconds: string) => `${seconds} seconds`
   */
  getSecondsClockNumberText: PropTypes.func,

  /**
   * Left arrow icon aria-label text.
   * @default 'open previous view'
   */
  leftArrowButtonText: PropTypes.string,

  /**
   * Max time acceptable time.
   * For input validation date part of passed object will be ignored if `disableIgnoringDatePartForTimeValidation` not specified.
   */
  maxTime: PropTypes.any,

  /**
   * Min time acceptable time.
   * For input validation date part of passed object will be ignored if `disableIgnoringDatePartForTimeValidation` not specified.
   */
  minTime: PropTypes.any,

  /**
   * Step over minutes.
   * @default 1
   */
  minutesStep: PropTypes.number,

  /**
   * On change callback @DateIOType.
   */
  onChange: PropTypes.func.isRequired,

  /**
   * Callback fired on view change.
   * @param {ClockPickerView} view The new view.
   */
  onViewChange: PropTypes.func,

  /**
   * Initially open view.
   * @default 'hours'
   */
  openTo: PropTypes.oneOf(['hours', 'minutes', 'seconds']),

  /**
   * Right arrow icon aria-label text.
   * @default 'open next view'
   */
  rightArrowButtonText: PropTypes.string,

  /**
   * Dynamically check if time is disabled or not.
   * If returns `false` appropriate time point will ot be acceptable.
   * @param {number} timeValue The value to check.
   * @param {ClockPickerView} clockType The clock type of the timeValue.
   * @returns {boolean} Returns `true` if the time should be disabled
   */
  shouldDisableTime: PropTypes.func,
  showViewSwitcher: PropTypes.bool,

  /**
   * Controlled open view.
   */
  view: PropTypes.oneOf(['hours', 'minutes', 'seconds']),

  /**
   * Views for calendar picker.
   * @default ['hours', 'minutes']
   */
  views: PropTypes.arrayOf(PropTypes.oneOf(['hours', 'minutes', 'seconds']).isRequired)
} : void 0;