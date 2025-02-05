"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GridRow = GridRow;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var React = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _clsx = _interopRequireDefault(require("clsx"));

var _material = require("@mui/material");

var _events = require("../models/events");

var _gridEditRowModel = require("../models/gridEditRowModel");

var _useGridApiContext = require("../hooks/utils/useGridApiContext");

var _gridClasses = require("../constants/gridClasses");

var _useGridRootProps = require("../hooks/utils/useGridRootProps");

var _gridColumnsSelector = require("../hooks/features/columns/gridColumnsSelector");

var _useGridSelector = require("../hooks/utils/useGridSelector");

var _useGridVisibleRows = require("../hooks/utils/useGridVisibleRows");

var _domUtils = require("../utils/domUtils");

var _gridCheckboxSelectionColDef = require("../colDef/gridCheckboxSelectionColDef");

var _gridActionsColDef = require("../colDef/gridActionsColDef");

var _jsxRuntime = require("react/jsx-runtime");

const _excluded = ["selected", "rowId", "row", "index", "style", "rowHeight", "className", "visibleColumns", "renderedColumns", "containerWidth", "firstColumnToRender", "lastColumnToRender", "cellFocus", "cellTabIndex", "editRowsState", "isLastVisible", "onClick", "onDoubleClick", "onMouseEnter", "onMouseLeave"];

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const useUtilityClasses = ownerState => {
  const {
    editable,
    editing,
    selected,
    isLastVisible,
    classes
  } = ownerState;
  const slots = {
    root: ['row', selected && 'selected', editable && 'row--editable', editing && 'row--editing', isLastVisible && 'row--lastVisible']
  };
  return (0, _material.unstable_composeClasses)(slots, _gridClasses.getDataGridUtilityClass, classes);
};

const EmptyCell = ({
  width,
  height
}) => {
  if (!width || !height) {
    return null;
  }

  const style = {
    width,
    height
  };
  return /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
    className: "MuiDataGrid-cell",
    style: style
  }); // TODO change to .MuiDataGrid-emptyCell or .MuiDataGrid-rowFiller
};

function GridRow(props) {
  var _apiRef$current$getRo;

  const {
    selected,
    rowId,
    index,
    style: styleProp,
    rowHeight,
    className,
    visibleColumns,
    renderedColumns,
    containerWidth,
    firstColumnToRender,
    cellFocus,
    cellTabIndex,
    editRowsState,
    isLastVisible = false,
    onClick,
    onDoubleClick,
    onMouseEnter,
    onMouseLeave
  } = props,
        other = (0, _objectWithoutPropertiesLoose2.default)(props, _excluded);
  const ariaRowIndex = index + 2; // 1 for the header row and 1 as it's 1-based

  const apiRef = (0, _useGridApiContext.useGridApiContext)();
  const rootProps = (0, _useGridRootProps.useGridRootProps)();
  const currentPage = (0, _useGridVisibleRows.useGridVisibleRows)(apiRef, rootProps);
  const columnsTotalWidth = (0, _useGridSelector.useGridSelector)(apiRef, _gridColumnsSelector.gridColumnsTotalWidthSelector);
  const {
    hasScrollX,
    hasScrollY
  } = (_apiRef$current$getRo = apiRef.current.getRootDimensions()) != null ? _apiRef$current$getRo : {
    hasScrollX: false,
    hasScrollY: false
  };
  const ownerState = {
    selected,
    isLastVisible,
    classes: rootProps.classes,
    editing: apiRef.current.getRowMode(rowId) === _gridEditRowModel.GridRowModes.Edit,
    editable: rootProps.editMode === _gridEditRowModel.GridEditModes.Row
  };
  const classes = useUtilityClasses(ownerState);
  const publish = React.useCallback((eventName, propHandler) => event => {
    // Ignore portal
    // The target is not an element when triggered by a Select inside the cell
    // See https://github.com/mui/material-ui/issues/10534
    if (event.target.nodeType === 1 && !event.currentTarget.contains(event.target)) {
      return;
    } // The row might have been deleted


    if (!apiRef.current.getRow(rowId)) {
      return;
    }

    apiRef.current.publishEvent(eventName, apiRef.current.getRowParams(rowId), event);

    if (propHandler) {
      propHandler(event);
    }
  }, [apiRef, rowId]);
  const publishClick = React.useCallback(event => {
    const cell = (0, _domUtils.findParentElementFromClassName)(event.target, _gridClasses.gridClasses.cell);
    const field = cell == null ? void 0 : cell.getAttribute('data-field'); // Check if the field is available because the cell that fills the empty
    // space of the row has no field.

    if (field) {
      // User clicked in the checkbox added by checkboxSelection
      if (field === _gridCheckboxSelectionColDef.GRID_CHECKBOX_SELECTION_COL_DEF.field) {
        return;
      } // User opened a detail panel


      if (field === '__detail_panel_toggle__') {
        return;
      } // User is editing a cell


      if (apiRef.current.getCellMode(rowId, field) === _gridEditRowModel.GridCellModes.Edit) {
        return;
      } // User clicked a button from the "actions" column type


      const column = apiRef.current.getColumn(field);

      if (column.type === _gridActionsColDef.GRID_ACTIONS_COLUMN_TYPE) {
        return;
      }
    }

    publish(_events.GridEvents.rowClick, onClick)(event);
  }, [apiRef, onClick, publish, rowId]);
  const style = (0, _extends2.default)({}, styleProp, {
    maxHeight: rowHeight,
    minHeight: rowHeight
  });
  const sizes = apiRef.current.unstable_getRowInternalSizes(rowId);

  if (sizes != null && sizes.spacingTop) {
    const property = rootProps.rowSpacingType === 'border' ? 'borderTopWidth' : 'marginTop';
    style[property] = sizes.spacingTop;
  }

  if (sizes != null && sizes.spacingBottom) {
    const property = rootProps.rowSpacingType === 'border' ? 'borderBottomWidth' : 'marginBottom';
    style[property] = sizes.spacingBottom;
  }

  let rowClassName = null;

  if (typeof rootProps.getRowClassName === 'function') {
    const indexRelativeToCurrentPage = index - currentPage.range.firstRowIndex;
    const rowParams = (0, _extends2.default)({}, apiRef.current.getRowParams(rowId), {
      isFirstVisible: indexRelativeToCurrentPage === 0,
      isLastVisible: indexRelativeToCurrentPage === currentPage.rows.length - 1,
      indexRelativeToCurrentPage
    });
    rowClassName = rootProps.getRowClassName(rowParams);
  }

  const cells = [];

  for (let i = 0; i < renderedColumns.length; i += 1) {
    const column = renderedColumns[i];
    const indexRelativeToAllColumns = firstColumnToRender + i;
    const isLastColumn = indexRelativeToAllColumns === visibleColumns.length - 1;
    const removeLastBorderRight = isLastColumn && hasScrollX && !hasScrollY;
    const showRightBorder = !isLastColumn ? rootProps.showCellRightBorder : !removeLastBorderRight && rootProps.disableExtendRowFullWidth;
    const cellParams = apiRef.current.getCellParams(rowId, column.field);
    const classNames = [];

    if (column.cellClassName) {
      classNames.push((0, _clsx.default)(typeof column.cellClassName === 'function' ? column.cellClassName(cellParams) : column.cellClassName));
    }

    const editCellState = editRowsState[rowId] ? editRowsState[rowId][column.field] : null;
    let content = null;

    if (editCellState == null && column.renderCell) {
      var _rootProps$classes;

      content = column.renderCell((0, _extends2.default)({}, cellParams, {
        api: apiRef.current
      })); // TODO move to GridCell

      classNames.push((0, _clsx.default)(_gridClasses.gridClasses['cell--withRenderer'], (_rootProps$classes = rootProps.classes) == null ? void 0 : _rootProps$classes['cell--withRenderer']));
    }

    if (editCellState != null && column.renderEditCell) {
      var _rootProps$classes2;

      const params = (0, _extends2.default)({}, cellParams, editCellState, {
        api: apiRef.current
      });
      content = column.renderEditCell(params); // TODO move to GridCell

      classNames.push((0, _clsx.default)(_gridClasses.gridClasses['cell--editing'], (_rootProps$classes2 = rootProps.classes) == null ? void 0 : _rootProps$classes2['cell--editing']));
    }

    if (rootProps.getCellClassName) {
      // TODO move to GridCell
      classNames.push(rootProps.getCellClassName(cellParams));
    }

    const hasFocus = cellFocus !== null && cellFocus.id === rowId && cellFocus.field === column.field;
    const tabIndex = cellTabIndex !== null && cellTabIndex.id === rowId && cellTabIndex.field === column.field && cellParams.cellMode === 'view' ? 0 : -1;
    const cellColSpanInfo = apiRef.current.unstable_getCellColSpanInfo(rowId, indexRelativeToAllColumns);

    if (cellColSpanInfo && !cellColSpanInfo.spannedByColSpan) {
      var _rootProps$components;

      const {
        colSpan,
        width
      } = cellColSpanInfo.cellProps;
      cells.push( /*#__PURE__*/(0, _jsxRuntime.jsx)(rootProps.components.Cell, (0, _extends2.default)({
        value: cellParams.value,
        field: column.field,
        width: width,
        rowId: rowId,
        height: rowHeight,
        showRightBorder: showRightBorder,
        formattedValue: cellParams.formattedValue,
        align: column.align || 'left',
        cellMode: cellParams.cellMode,
        colIndex: indexRelativeToAllColumns,
        isEditable: cellParams.isEditable,
        hasFocus: hasFocus,
        tabIndex: tabIndex,
        className: (0, _clsx.default)(classNames),
        colSpan: colSpan
      }, (_rootProps$components = rootProps.componentsProps) == null ? void 0 : _rootProps$components.cell, {
        children: content
      }), column.field));
    }
  }

  const emptyCellWidth = containerWidth - columnsTotalWidth;
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", (0, _extends2.default)({
    "data-id": rowId,
    "data-rowindex": index,
    role: "row",
    className: (0, _clsx.default)(rowClassName, classes.root, className),
    "aria-rowindex": ariaRowIndex,
    "aria-selected": selected,
    style: style,
    onClick: publishClick,
    onDoubleClick: publish(_events.GridEvents.rowDoubleClick, onDoubleClick),
    onMouseEnter: publish(_events.GridEvents.rowMouseEnter, onMouseEnter),
    onMouseLeave: publish(_events.GridEvents.rowMouseLeave, onMouseLeave)
  }, other, {
    children: [cells, emptyCellWidth > 0 && /*#__PURE__*/(0, _jsxRuntime.jsx)(EmptyCell, {
      width: emptyCellWidth,
      height: rowHeight
    })]
  }));
}

process.env.NODE_ENV !== "production" ? GridRow.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  cellFocus: _propTypes.default.object,
  cellTabIndex: _propTypes.default.object,
  containerWidth: _propTypes.default.number.isRequired,
  editRowsState: _propTypes.default.object.isRequired,
  firstColumnToRender: _propTypes.default.number.isRequired,

  /**
   * Index of the row in the whole sorted and filtered dataset.
   * If some rows above have expanded children, this index also take those children into account.
   */
  index: _propTypes.default.number.isRequired,
  isLastVisible: _propTypes.default.bool,
  lastColumnToRender: _propTypes.default.number.isRequired,
  renderedColumns: _propTypes.default.arrayOf(_propTypes.default.object).isRequired,
  row: _propTypes.default.any.isRequired,
  rowHeight: _propTypes.default.number.isRequired,
  rowId: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]).isRequired,
  selected: _propTypes.default.bool.isRequired,
  visibleColumns: _propTypes.default.arrayOf(_propTypes.default.object).isRequired
} : void 0;