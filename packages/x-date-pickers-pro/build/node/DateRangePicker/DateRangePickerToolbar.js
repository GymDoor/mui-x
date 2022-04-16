"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DateRangePickerToolbar = void 0;

var React = _interopRequireWildcard(require("react"));

var _Typography = _interopRequireDefault(require("@mui/material/Typography"));

var _styles = require("@mui/material/styles");

var _material = require("@mui/material");

var _internals = require("@mui/x-date-pickers/internals");

var _jsxRuntime = require("react/jsx-runtime");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const classes = (0, _material.generateUtilityClasses)('PrivateDateRangePickerToolbar', ['penIcon']);
const DateRangePickerToolbarRoot = (0, _styles.styled)(_internals.PickersToolbar)({
  [`& .${classes.penIcon}`]: {
    position: 'relative',
    top: 4
  }
});
const DateRangePickerToolbarContainer = (0, _styles.styled)('div')({
  display: 'flex'
});
/**
 * @ignore - internal component.
 */

const DateRangePickerToolbar = ({
  currentlySelectingRangeEnd,
  date: [start, end],
  endText,
  isMobileKeyboardViewOpen,
  setCurrentlySelectingRangeEnd,
  startText,
  toggleMobileKeyboardView,
  toolbarFormat,
  toolbarTitle = 'Select date range'
}) => {
  const utils = (0, _internals.useUtils)();
  const startDateValue = start ? utils.formatByString(start, toolbarFormat || utils.formats.shortDate) : startText;
  const endDateValue = end ? utils.formatByString(end, toolbarFormat || utils.formats.shortDate) : endText;
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(DateRangePickerToolbarRoot, {
    toolbarTitle: toolbarTitle,
    isMobileKeyboardViewOpen: isMobileKeyboardViewOpen,
    toggleMobileKeyboardView: toggleMobileKeyboardView,
    isLandscape: false,
    penIconClassName: classes.penIcon,
    children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(DateRangePickerToolbarContainer, {
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_internals.PickersToolbarButton, {
        variant: start !== null ? 'h5' : 'h6',
        value: startDateValue,
        selected: currentlySelectingRangeEnd === 'start',
        onClick: () => setCurrentlySelectingRangeEnd('start')
      }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Typography.default, {
        variant: "h5",
        children: ["\xA0", '–', "\xA0"]
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_internals.PickersToolbarButton, {
        variant: end !== null ? 'h5' : 'h6',
        value: endDateValue,
        selected: currentlySelectingRangeEnd === 'end',
        onClick: () => setCurrentlySelectingRangeEnd('end')
      })]
    })
  });
};

exports.DateRangePickerToolbar = DateRangePickerToolbar;