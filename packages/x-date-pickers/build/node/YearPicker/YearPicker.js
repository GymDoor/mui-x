"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.YearPicker = void 0;

var React = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _styles = require("@mui/material/styles");

var _material = require("@mui/material");

var _clsx = _interopRequireDefault(require("clsx"));

var _PickersYear = require("./PickersYear");

var _useUtils = require("../internals/hooks/useUtils");

var _dateUtils = require("../internals/utils/date-utils");

var _WrapperVariantContext = require("../internals/components/wrappers/WrapperVariantContext");

var _yearPickerClasses = require("./yearPickerClasses");

var _jsxRuntime = require("react/jsx-runtime");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const useUtilityClasses = ownerState => {
  const {
    classes
  } = ownerState;
  const slots = {
    root: ['root']
  };
  return (0, _material.unstable_composeClasses)(slots, _yearPickerClasses.getYearPickerUtilityClass, classes);
};

const YearPickerRoot = (0, _styles.styled)('div', {
  name: 'MuiYearPicker',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  overflowY: 'auto',
  height: '100%',
  margin: '0 4px'
});
const YearPicker = /*#__PURE__*/React.forwardRef(function YearPicker(inProps, ref) {
  const props = (0, _styles.useThemeProps)({
    props: inProps,
    name: 'MuiYearPicker'
  });
  const {
    autoFocus,
    className,
    date,
    disabled,
    disableFuture,
    disablePast,
    isDateDisabled,
    maxDate,
    minDate,
    onChange,
    onFocusedDayChange,
    onYearChange,
    readOnly,
    shouldDisableYear
  } = props;
  const ownerState = props;
  const classes = useUtilityClasses(ownerState);
  const now = (0, _useUtils.useNow)();
  const theme = (0, _styles.useTheme)();
  const utils = (0, _useUtils.useUtils)();
  const selectedDate = date || now;
  const currentYear = utils.getYear(selectedDate);
  const wrapperVariant = React.useContext(_WrapperVariantContext.WrapperVariantContext);
  const selectedYearRef = React.useRef(null);
  const [focusedYear, setFocusedYear] = React.useState(currentYear);

  const handleYearSelection = (event, year, isFinish = 'finish') => {
    if (readOnly) {
      return;
    }

    const submitDate = newDate => {
      onChange(newDate, isFinish);

      if (onFocusedDayChange) {
        onFocusedDayChange(newDate || now);
      }

      if (onYearChange) {
        onYearChange(newDate);
      }
    };

    const newDate = utils.setYear(selectedDate, year);

    if (isDateDisabled(newDate)) {
      const closestEnabledDate = (0, _dateUtils.findClosestEnabledDate)({
        utils,
        date: newDate,
        minDate,
        maxDate,
        disablePast: Boolean(disablePast),
        disableFuture: Boolean(disableFuture),
        shouldDisableDate: isDateDisabled
      });
      submitDate(closestEnabledDate || now);
    } else {
      submitDate(newDate);
    }
  };

  const focusYear = React.useCallback(year => {
    if (!isDateDisabled(utils.setYear(selectedDate, year))) {
      setFocusedYear(year);
    }
  }, [selectedDate, isDateDisabled, utils]);
  const yearsInRow = wrapperVariant === 'desktop' ? 4 : 3;

  const handleKeyDown = (event, year) => {
    switch (event.key) {
      case 'ArrowUp':
        focusYear(year - yearsInRow);
        event.preventDefault();
        break;

      case 'ArrowDown':
        focusYear(year + yearsInRow);
        event.preventDefault();
        break;

      case 'ArrowLeft':
        focusYear(year + (theme.direction === 'ltr' ? -1 : 1));
        event.preventDefault();
        break;

      case 'ArrowRight':
        focusYear(year + (theme.direction === 'ltr' ? 1 : -1));
        event.preventDefault();
        break;

      default:
        break;
    }
  };

  return /*#__PURE__*/(0, _jsxRuntime.jsx)(YearPickerRoot, {
    ref: ref,
    className: (0, _clsx.default)(classes.root, className),
    ownerState: ownerState,
    children: utils.getYearRange(minDate, maxDate).map(year => {
      const yearNumber = utils.getYear(year);
      const selected = yearNumber === currentYear;
      return /*#__PURE__*/(0, _jsxRuntime.jsx)(_PickersYear.PickersYear, {
        selected: selected,
        value: yearNumber,
        onClick: handleYearSelection,
        onKeyDown: handleKeyDown,
        autoFocus: autoFocus && yearNumber === focusedYear,
        ref: selected ? selectedYearRef : undefined,
        disabled: disabled || disablePast && utils.isBeforeYear(year, now) || disableFuture && utils.isAfterYear(year, now) || shouldDisableYear && shouldDisableYear(year),
        children: utils.format(year, 'year')
      }, utils.format(year, 'year'));
    })
  });
});
exports.YearPicker = YearPicker;
process.env.NODE_ENV !== "production" ? YearPicker.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  autoFocus: _propTypes.default.bool,
  classes: _propTypes.default.object,
  className: _propTypes.default.string,
  date: _propTypes.default.any,
  disabled: _propTypes.default.bool,
  disableFuture: _propTypes.default.bool,
  disablePast: _propTypes.default.bool,
  isDateDisabled: _propTypes.default.func.isRequired,
  maxDate: _propTypes.default.any.isRequired,
  minDate: _propTypes.default.any.isRequired,
  onChange: _propTypes.default.func.isRequired,
  onFocusedDayChange: _propTypes.default.func,

  /**
   * Callback firing on year change @DateIOType.
   * @template TDate
   * @param {TDate} year The new year.
   */
  onYearChange: _propTypes.default.func,
  readOnly: _propTypes.default.bool,

  /**
   * Disable specific years dynamically.
   * Works like `shouldDisableDate` but for year selection view @DateIOType.
   * @template TDate
   * @param {TDate} year The year to test.
   * @returns {boolean} Return `true` if the year should be disabled.
   */
  shouldDisableYear: _propTypes.default.func
} : void 0;