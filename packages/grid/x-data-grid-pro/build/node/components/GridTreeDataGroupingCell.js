"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GridTreeDataGroupingCell = void 0;

var React = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _material = require("@mui/material");

var _IconButton = _interopRequireDefault(require("@mui/material/IconButton"));

var _Box = _interopRequireDefault(require("@mui/material/Box"));

var _xDataGrid = require("@mui/x-data-grid");

var _internals = require("@mui/x-data-grid/internals");

var _useGridRootProps = require("../hooks/utils/useGridRootProps");

var _useGridApiContext = require("../hooks/utils/useGridApiContext");

var _jsxRuntime = require("react/jsx-runtime");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const useUtilityClasses = ownerState => {
  const {
    classes
  } = ownerState;
  const slots = {
    root: ['treeDataGroupingCell'],
    toggle: ['treeDataGroupingCellToggle']
  };
  return (0, _material.unstable_composeClasses)(slots, _xDataGrid.getDataGridUtilityClass, classes);
};

const GridTreeDataGroupingCell = props => {
  var _filteredDescendantCo;

  const {
    id,
    field,
    formattedValue,
    rowNode,
    hideDescendantCount
  } = props;
  const rootProps = (0, _useGridRootProps.useGridRootProps)();
  const apiRef = (0, _useGridApiContext.useGridApiContext)();
  const ownerState = {
    classes: rootProps.classes
  };
  const classes = useUtilityClasses(ownerState);
  const filteredDescendantCountLookup = (0, _xDataGrid.useGridSelector)(apiRef, _xDataGrid.gridFilteredDescendantCountLookupSelector);
  const filteredDescendantCount = (_filteredDescendantCo = filteredDescendantCountLookup[rowNode.id]) != null ? _filteredDescendantCo : 0;
  const Icon = rowNode.childrenExpanded ? rootProps.components.TreeDataCollapseIcon : rootProps.components.TreeDataExpandIcon;

  const handleKeyDown = event => {
    if (event.key === ' ') {
      event.stopPropagation();
    }

    if ((0, _internals.isNavigationKey)(event.key) && !event.shiftKey) {
      apiRef.current.publishEvent(_xDataGrid.GridEvents.cellNavigationKeyDown, props, event);
    }
  };

  const handleClick = event => {
    apiRef.current.setRowChildrenExpansion(id, !rowNode.childrenExpanded);
    apiRef.current.setCellFocus(id, field);
    event.stopPropagation(); // TODO remove event.stopPropagation
  };

  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Box.default, {
    className: classes.root,
    sx: {
      ml: rowNode.depth * 2
    },
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
      className: classes.toggle,
      children: filteredDescendantCount > 0 && /*#__PURE__*/(0, _jsxRuntime.jsx)(_IconButton.default, {
        size: "small",
        onClick: handleClick,
        onKeyDown: handleKeyDown,
        tabIndex: -1,
        "aria-label": rowNode.childrenExpanded ? apiRef.current.getLocaleText('treeDataCollapse') : apiRef.current.getLocaleText('treeDataExpand'),
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(Icon, {
          fontSize: "inherit"
        })
      })
    }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("span", {
      children: [formattedValue === undefined ? rowNode.groupingKey : formattedValue, !hideDescendantCount && filteredDescendantCount > 0 ? ` (${filteredDescendantCount})` : '']
    })]
  });
};

exports.GridTreeDataGroupingCell = GridTreeDataGroupingCell;
process.env.NODE_ENV !== "production" ? GridTreeDataGroupingCell.propTypes = {
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
  hideDescendantCount: _propTypes.default.bool,

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