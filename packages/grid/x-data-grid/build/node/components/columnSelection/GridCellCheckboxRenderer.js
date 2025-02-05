"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GridCellCheckboxRenderer = exports.GridCellCheckboxForwardRef = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var React = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _material = require("@mui/material");

var _utils = require("@mui/material/utils");

var _events = require("../../models/events");

var _keyboardUtils = require("../../utils/keyboardUtils");

var _useGridApiContext = require("../../hooks/utils/useGridApiContext");

var _useGridRootProps = require("../../hooks/utils/useGridRootProps");

var _gridClasses = require("../../constants/gridClasses");

var _jsxRuntime = require("react/jsx-runtime");

const _excluded = ["field", "id", "value", "formattedValue", "row", "rowNode", "colDef", "isEditable", "cellMode", "hasFocus", "tabIndex", "getValue", "api"];

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const useUtilityClasses = ownerState => {
  const {
    classes
  } = ownerState;
  const slots = {
    root: ['checkboxInput']
  };
  return (0, _material.unstable_composeClasses)(slots, _gridClasses.getDataGridUtilityClass, classes);
};

const GridCellCheckboxForwardRef = /*#__PURE__*/React.forwardRef(function GridCellCheckboxRenderer(props, ref) {
  var _rootProps$components;

  const {
    field,
    id,
    value: isChecked,
    hasFocus,
    tabIndex
  } = props,
        other = (0, _objectWithoutPropertiesLoose2.default)(props, _excluded);
  const apiRef = (0, _useGridApiContext.useGridApiContext)();
  const rootProps = (0, _useGridRootProps.useGridRootProps)();
  const ownerState = {
    classes: rootProps.classes
  };
  const classes = useUtilityClasses(ownerState);
  const checkboxElement = React.useRef(null);
  const rippleRef = React.useRef();
  const handleRef = (0, _utils.useForkRef)(checkboxElement, ref);
  const element = apiRef.current.getCellElement(id, field);

  const handleChange = event => {
    const params = {
      value: event.target.checked,
      id
    };
    apiRef.current.publishEvent(_events.GridEvents.rowSelectionCheckboxChange, params, event);
  };

  React.useLayoutEffect(() => {
    if (tabIndex === 0 && element) {
      element.tabIndex = -1;
    }
  }, [element, tabIndex]);
  React.useLayoutEffect(() => {
    if (hasFocus) {
      var _checkboxElement$curr;

      const input = (_checkboxElement$curr = checkboxElement.current) == null ? void 0 : _checkboxElement$curr.querySelector('input');
      input == null ? void 0 : input.focus();
    } else if (rippleRef.current) {
      // Only available in @mui/material v5.4.1 or later
      rippleRef.current.stop({});
    }
  }, [hasFocus]);
  const handleKeyDown = React.useCallback(event => {
    if ((0, _keyboardUtils.isSpaceKey)(event.key)) {
      event.stopPropagation();
    }

    if ((0, _keyboardUtils.isNavigationKey)(event.key) && !event.shiftKey) {
      apiRef.current.publishEvent(_events.GridEvents.cellNavigationKeyDown, props, event);
    }
  }, [apiRef, props]);
  const isSelectable = !rootProps.isRowSelectable || rootProps.isRowSelectable(apiRef.current.getRowParams(id));
  const label = apiRef.current.getLocaleText(isChecked ? 'checkboxSelectionUnselectRow' : 'checkboxSelectionSelectRow');
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(rootProps.components.BaseCheckbox, (0, _extends2.default)({
    ref: handleRef,
    tabIndex: tabIndex,
    checked: isChecked,
    onChange: handleChange,
    className: classes.root,
    color: "primary",
    inputProps: {
      'aria-label': label
    },
    onKeyDown: handleKeyDown,
    disabled: !isSelectable,
    touchRippleRef: rippleRef
  }, (_rootProps$components = rootProps.componentsProps) == null ? void 0 : _rootProps$components.baseCheckbox, other));
});
exports.GridCellCheckboxForwardRef = GridCellCheckboxForwardRef;
process.env.NODE_ENV !== "production" ? GridCellCheckboxForwardRef.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------

  /**
   * GridApi that let you manipulate the grid.
   * @deprecated Use the `apiRef` returned by `useGridApiContext` or `useGridApiRef` (only available in `@mui/x-data-grid-pro`)
   */
  api: _propTypes.default.any.isRequired,

  /**
   * The mode of the cell.
   */
  cellMode: _propTypes.default.oneOf(['edit', 'view']).isRequired,

  /**
   * The column of the row that the current cell belongs to.
   */
  colDef: _propTypes.default.object.isRequired,

  /**
   * The column field of the cell that triggered the event.
   */
  field: _propTypes.default.string.isRequired,

  /**
   * The cell value formatted with the column valueFormatter.
   */
  formattedValue: _propTypes.default.any,

  /**
   * Get the cell value of a row and field.
   * @param {GridRowId} id The row id.
   * @param {string} field The field.
   * @returns {any} The cell value.
   * @deprecated Use `params.row` to directly access the fields you want instead.
   */
  getValue: _propTypes.default.func.isRequired,

  /**
   * If true, the cell is the active element.
   */
  hasFocus: _propTypes.default.bool.isRequired,

  /**
   * The grid row id.
   */
  id: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]).isRequired,

  /**
   * If true, the cell is editable.
   */
  isEditable: _propTypes.default.bool,

  /**
   * The row model of the row that the current cell belongs to.
   */
  row: _propTypes.default.object.isRequired,

  /**
   * The node of the row that the current cell belongs to.
   */
  rowNode: _propTypes.default.object.isRequired,

  /**
   * the tabIndex value.
   */
  tabIndex: _propTypes.default.oneOf([-1, 0]).isRequired,

  /**
   * The cell value, but if the column has valueGetter, use getValue.
   */
  value: _propTypes.default.any
} : void 0;
const GridCellCheckboxRenderer = /*#__PURE__*/React.memo(GridCellCheckboxForwardRef);
exports.GridCellCheckboxRenderer = GridCellCheckboxRenderer;