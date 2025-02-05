"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Clock = Clock;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var React = _interopRequireWildcard(require("react"));

var _IconButton = _interopRequireDefault(require("@mui/material/IconButton"));

var _Typography = _interopRequireDefault(require("@mui/material/Typography"));

var _styles = require("@mui/material/styles");

var _utils = require("@mui/utils");

var _ClockPointer = require("./ClockPointer");

var _useUtils = require("../internals/hooks/useUtils");

var _WrapperVariantContext = require("../internals/components/wrappers/WrapperVariantContext");

var _shared = require("./shared");

var _jsxRuntime = require("react/jsx-runtime");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const ClockRoot = (0, _styles.styled)('div')(({
  theme
}) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  margin: theme.spacing(2)
}));
const ClockClock = (0, _styles.styled)('div')({
  backgroundColor: 'rgba(0,0,0,.07)',
  borderRadius: '50%',
  height: 220,
  width: 220,
  flexShrink: 0,
  position: 'relative',
  pointerEvents: 'none'
});
const ClockSquareMask = (0, _styles.styled)('div')({
  width: '100%',
  height: '100%',
  position: 'absolute',
  pointerEvents: 'auto',
  outline: 0,
  // Disable scroll capabilities.
  touchAction: 'none',
  userSelect: 'none',
  '@media (pointer: fine)': {
    cursor: 'pointer',
    borderRadius: '50%'
  },
  '&:active': {
    cursor: 'move'
  }
});
const ClockPin = (0, _styles.styled)('div')(({
  theme
}) => ({
  width: 6,
  height: 6,
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.main,
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)'
}));
const ClockAmButton = (0, _styles.styled)(_IconButton.default)(({
  theme,
  ownerState
}) => (0, _extends2.default)({
  zIndex: 1,
  position: 'absolute',
  bottom: ownerState.ampmInClock ? 64 : 8,
  left: 8
}, ownerState.meridiemMode === 'am' && {
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.primary.light
  }
}));
const ClockPmButton = (0, _styles.styled)(_IconButton.default)(({
  theme,
  ownerState
}) => (0, _extends2.default)({
  zIndex: 1,
  position: 'absolute',
  bottom: ownerState.ampmInClock ? 64 : 8,
  right: 8
}, ownerState.meridiemMode === 'pm' && {
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.primary.light
  }
}));
/**
 * @ignore - internal component.
 */

function Clock(props) {
  const {
    ampm,
    ampmInClock,
    autoFocus,
    children,
    date,
    getClockLabelText,
    handleMeridiemChange,
    isTimeDisabled,
    meridiemMode,
    minutesStep = 1,
    onChange,
    selectedId,
    type,
    value
  } = props;
  const ownerState = props;
  const utils = (0, _useUtils.useUtils)();
  const wrapperVariant = React.useContext(_WrapperVariantContext.WrapperVariantContext);
  const isMoving = React.useRef(false);
  const isSelectedTimeDisabled = isTimeDisabled(value, type);
  const isPointerInner = !ampm && type === 'hours' && (value < 1 || value > 12);

  const handleValueChange = (newValue, isFinish) => {
    if (isTimeDisabled(newValue, type)) {
      return;
    }

    onChange(newValue, isFinish);
  };

  const setTime = (event, isFinish) => {
    let {
      offsetX,
      offsetY
    } = event;

    if (offsetX === undefined) {
      const rect = event.target.getBoundingClientRect();
      offsetX = event.changedTouches[0].clientX - rect.left;
      offsetY = event.changedTouches[0].clientY - rect.top;
    }

    const newSelectedValue = type === 'seconds' || type === 'minutes' ? (0, _shared.getMinutes)(offsetX, offsetY, minutesStep) : (0, _shared.getHours)(offsetX, offsetY, Boolean(ampm));
    handleValueChange(newSelectedValue, isFinish);
  };

  const handleTouchMove = event => {
    isMoving.current = true;
    setTime(event, 'shallow');
  };

  const handleTouchEnd = event => {
    if (isMoving.current) {
      setTime(event, 'finish');
      isMoving.current = false;
    }
  };

  const handleMouseMove = event => {
    // event.buttons & PRIMARY_MOUSE_BUTTON
    if (event.buttons > 0) {
      setTime(event.nativeEvent, 'shallow');
    }
  };

  const handleMouseUp = event => {
    if (isMoving.current) {
      isMoving.current = false;
    }

    setTime(event.nativeEvent, 'finish');
  };

  const hasSelected = React.useMemo(() => {
    if (type === 'hours') {
      return true;
    }

    return value % 5 === 0;
  }, [type, value]);
  const keyboardControlStep = type === 'minutes' ? minutesStep : 1;
  const listboxRef = React.useRef(null); // Since this is rendered when a Popper is opened we can't use passive effects.
  // Focusing in passive effects in Popper causes scroll jump.

  (0, _utils.unstable_useEnhancedEffect)(() => {
    if (autoFocus) {
      // The ref not being resolved would be a bug in MUI.
      listboxRef.current.focus();
    }
  }, [autoFocus]);

  const handleKeyDown = event => {
    // TODO: Why this early exit?
    if (isMoving.current) {
      return;
    }

    switch (event.key) {
      case 'Home':
        // annulate both hours and minutes
        handleValueChange(0, 'partial');
        event.preventDefault();
        break;

      case 'End':
        handleValueChange(type === 'minutes' ? 59 : 23, 'partial');
        event.preventDefault();
        break;

      case 'ArrowUp':
        handleValueChange(value + keyboardControlStep, 'partial');
        event.preventDefault();
        break;

      case 'ArrowDown':
        handleValueChange(value - keyboardControlStep, 'partial');
        event.preventDefault();
        break;

      default: // do nothing

    }
  };

  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(ClockRoot, {
    children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)(ClockClock, {
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(ClockSquareMask, {
        onTouchMove: handleTouchMove,
        onTouchEnd: handleTouchEnd,
        onMouseUp: handleMouseUp,
        onMouseMove: handleMouseMove
      }), !isSelectedTimeDisabled && /*#__PURE__*/(0, _jsxRuntime.jsxs)(React.Fragment, {
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(ClockPin, {}), date && /*#__PURE__*/(0, _jsxRuntime.jsx)(_ClockPointer.ClockPointer, {
          type: type,
          value: value,
          isInner: isPointerInner,
          hasSelected: hasSelected
        })]
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
        "aria-activedescendant": selectedId,
        "aria-label": getClockLabelText(type, date, utils),
        ref: listboxRef,
        role: "listbox",
        onKeyDown: handleKeyDown,
        tabIndex: 0,
        children: children
      })]
    }), ampm && (wrapperVariant === 'desktop' || ampmInClock) && /*#__PURE__*/(0, _jsxRuntime.jsxs)(React.Fragment, {
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(ClockAmButton, {
        onClick: () => handleMeridiemChange('am'),
        disabled: meridiemMode === null,
        ownerState: ownerState,
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
          variant: "caption",
          children: "AM"
        })
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(ClockPmButton, {
        disabled: meridiemMode === null,
        onClick: () => handleMeridiemChange('pm'),
        ownerState: ownerState,
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
          variant: "caption",
          children: "PM"
        })
      })]
    })]
  });
}