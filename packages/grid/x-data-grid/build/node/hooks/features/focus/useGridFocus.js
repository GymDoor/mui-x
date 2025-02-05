"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useGridFocus = exports.focusStateInitializer = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var React = _interopRequireWildcard(require("react"));

var _utils = require("@mui/material/utils");

var _events = require("../../../models/events");

var _useGridApiMethod = require("../../utils/useGridApiMethod");

var _useGridLogger = require("../../utils/useGridLogger");

var _useGridApiEventHandler = require("../../utils/useGridApiEventHandler");

var _keyboardUtils = require("../../../utils/keyboardUtils");

var _gridFocusStateSelector = require("./gridFocusStateSelector");

var _gridColumnsSelector = require("../columns/gridColumnsSelector");

var _useGridVisibleRows = require("../../utils/useGridVisibleRows");

var _utils2 = require("../../../utils/utils");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const focusStateInitializer = state => (0, _extends2.default)({}, state, {
  focus: {
    cell: null,
    columnHeader: null
  },
  tabIndex: {
    cell: null,
    columnHeader: null
  }
});
/**
 * @requires useGridParamsApi (method)
 * @requires useGridRows (method)
 * @requires useGridEditing (event)
 */


exports.focusStateInitializer = focusStateInitializer;

const useGridFocus = (apiRef, props) => {
  const logger = (0, _useGridLogger.useGridLogger)(apiRef, 'useGridFocus');
  const lastClickedCell = React.useRef(null);
  const setCellFocus = React.useCallback((id, field) => {
    // The row might have been deleted
    if (!apiRef.current.getRow(id)) {
      return;
    }

    const focusedCell = (0, _gridFocusStateSelector.gridFocusCellSelector)(apiRef);

    if ((focusedCell == null ? void 0 : focusedCell.id) === id && focusedCell.field === field) {
      return;
    }

    apiRef.current.setState(state => {
      logger.debug(`Focusing on cell with id=${id} and field=${field}`);
      return (0, _extends2.default)({}, state, {
        tabIndex: {
          cell: {
            id,
            field
          },
          columnHeader: null
        },
        focus: {
          cell: {
            id,
            field
          },
          columnHeader: null
        }
      });
    });
    apiRef.current.forceUpdate();
    apiRef.current.publishEvent(_events.GridEvents.cellFocusIn, apiRef.current.getCellParams(id, field));
  }, [apiRef, logger]);
  const setColumnHeaderFocus = React.useCallback((field, event = {}) => {
    const cell = (0, _gridFocusStateSelector.gridFocusCellSelector)(apiRef);

    if (cell) {
      apiRef.current.publishEvent(_events.GridEvents.cellFocusOut, apiRef.current.getCellParams(cell.id, cell.field), event);
    }

    apiRef.current.setState(state => {
      logger.debug(`Focusing on column header with colIndex=${field}`);
      return (0, _extends2.default)({}, state, {
        tabIndex: {
          columnHeader: {
            field
          },
          cell: null
        },
        focus: {
          columnHeader: {
            field
          },
          cell: null
        }
      });
    });
    apiRef.current.forceUpdate();
  }, [apiRef, logger]);
  const moveFocusToRelativeCell = React.useCallback((id, field, direction) => {
    let columnIndexToFocus = apiRef.current.getColumnIndex(field);
    let rowIndexToFocus = apiRef.current.getRowIndexRelativeToVisibleRows(id);
    const visibleColumns = (0, _gridColumnsSelector.gridVisibleColumnDefinitionsSelector)(apiRef);

    if (direction === 'right') {
      columnIndexToFocus += 1;
    } else if (direction === 'left') {
      columnIndexToFocus -= 1;
    } else {
      rowIndexToFocus += 1;
    }

    if (columnIndexToFocus >= visibleColumns.length) {
      // Go to next row if we are at the last column
      rowIndexToFocus += 1;
      columnIndexToFocus = 0;
    } else if (columnIndexToFocus < 0) {
      // Go to previous row if we are at the first column
      rowIndexToFocus -= 1;
      columnIndexToFocus = visibleColumns.length - 1;
    }

    const currentPage = (0, _useGridVisibleRows.getVisibleRows)(apiRef, {
      pagination: props.pagination,
      paginationMode: props.paginationMode
    });
    rowIndexToFocus = (0, _utils2.clamp)(rowIndexToFocus, currentPage.range.firstRowIndex, currentPage.range.lastRowIndex);
    const rowToFocus = currentPage.rows[rowIndexToFocus];
    const columnToFocus = visibleColumns[columnIndexToFocus];
    apiRef.current.setCellFocus(rowToFocus.id, columnToFocus.field);
  }, [apiRef, props.pagination, props.paginationMode]);
  const handleCellDoubleClick = React.useCallback(({
    id,
    field
  }) => {
    apiRef.current.setCellFocus(id, field);
  }, [apiRef]);
  const handleCellKeyDown = React.useCallback((params, event) => {
    // GRID_CELL_NAVIGATION_KEY_DOWN handles the focus on Enter, Tab and navigation keys
    if (event.key === 'Enter' || event.key === 'Tab' || (0, _keyboardUtils.isNavigationKey)(event.key)) {
      return;
    }

    apiRef.current.setCellFocus(params.id, params.field);
  }, [apiRef]);
  const handleColumnHeaderFocus = React.useCallback(({
    field
  }, event) => {
    if (event.target !== event.currentTarget) {
      return;
    }

    apiRef.current.setColumnHeaderFocus(field, event);
  }, [apiRef]);
  const handleBlur = React.useCallback(() => {
    logger.debug(`Clearing focus`);
    apiRef.current.setState(state => (0, _extends2.default)({}, state, {
      focus: {
        cell: null,
        columnHeader: null
      }
    }));
  }, [logger, apiRef]);
  const handleCellMouseUp = React.useCallback(params => {
    lastClickedCell.current = params;
  }, []);
  const handleDocumentClick = React.useCallback(event => {
    const cellParams = lastClickedCell.current;
    lastClickedCell.current = null;
    const focusedCell = (0, _gridFocusStateSelector.gridFocusCellSelector)(apiRef);

    if (!focusedCell) {
      if (cellParams) {
        apiRef.current.setCellFocus(cellParams.id, cellParams.field);
      }

      return;
    }

    if ((cellParams == null ? void 0 : cellParams.id) === focusedCell.id && (cellParams == null ? void 0 : cellParams.field) === focusedCell.field) {
      return;
    }

    const cellElement = apiRef.current.getCellElement(focusedCell.id, focusedCell.field);

    if (cellElement != null && cellElement.contains(event.target)) {
      return;
    } // The row might have been deleted during the click


    if (!apiRef.current.getRow(focusedCell.id)) {
      return;
    } // There's a focused cell but another cell was clicked
    // Publishes an event to notify that the focus was lost


    apiRef.current.publishEvent(_events.GridEvents.cellFocusOut, apiRef.current.getCellParams(focusedCell.id, focusedCell.field), event);

    if (cellParams) {
      apiRef.current.setCellFocus(cellParams.id, cellParams.field);
    } else {
      apiRef.current.setState(state => (0, _extends2.default)({}, state, {
        focus: {
          cell: null,
          columnHeader: null
        }
      }));
      apiRef.current.forceUpdate();
    }
  }, [apiRef]);
  const handleCellModeChange = React.useCallback(params => {
    if (params.cellMode === 'view') {
      return;
    }

    const cell = (0, _gridFocusStateSelector.gridFocusCellSelector)(apiRef);

    if ((cell == null ? void 0 : cell.id) !== params.id || (cell == null ? void 0 : cell.field) !== params.field) {
      apiRef.current.setCellFocus(params.id, params.field);
    }
  }, [apiRef]);
  (0, _useGridApiMethod.useGridApiMethod)(apiRef, {
    setCellFocus,
    setColumnHeaderFocus,
    unstable_moveFocusToRelativeCell: moveFocusToRelativeCell
  }, 'GridFocusApi');
  React.useEffect(() => {
    const cell = (0, _gridFocusStateSelector.gridFocusCellSelector)(apiRef);

    if (cell) {
      const updatedRow = apiRef.current.getRow(cell.id);

      if (!updatedRow) {
        apiRef.current.setState(state => (0, _extends2.default)({}, state, {
          focus: {
            cell: null,
            columnHeader: null
          }
        }));
      }
    }
  }, [apiRef, props.rows]);
  React.useEffect(() => {
    const doc = (0, _utils.ownerDocument)(apiRef.current.rootElementRef.current);
    doc.addEventListener('click', handleDocumentClick);
    return () => {
      doc.removeEventListener('click', handleDocumentClick);
    };
  }, [apiRef, handleDocumentClick]);
  (0, _useGridApiEventHandler.useGridApiEventHandler)(apiRef, _events.GridEvents.columnHeaderBlur, handleBlur);
  (0, _useGridApiEventHandler.useGridApiEventHandler)(apiRef, _events.GridEvents.cellDoubleClick, handleCellDoubleClick);
  (0, _useGridApiEventHandler.useGridApiEventHandler)(apiRef, _events.GridEvents.cellMouseUp, handleCellMouseUp);
  (0, _useGridApiEventHandler.useGridApiEventHandler)(apiRef, _events.GridEvents.cellKeyDown, handleCellKeyDown);
  (0, _useGridApiEventHandler.useGridApiEventHandler)(apiRef, _events.GridEvents.cellModeChange, handleCellModeChange);
  (0, _useGridApiEventHandler.useGridApiEventHandler)(apiRef, _events.GridEvents.columnHeaderFocus, handleColumnHeaderFocus);
};

exports.useGridFocus = useGridFocus;