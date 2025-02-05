import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import { ownerDocument } from '@mui/material/utils';
import { GridEvents } from '../../../models/events';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { useGridLogger } from '../../utils/useGridLogger';
import { useGridApiEventHandler } from '../../utils/useGridApiEventHandler';
import { isNavigationKey } from '../../../utils/keyboardUtils';
import { gridFocusCellSelector } from './gridFocusStateSelector';
import { gridVisibleColumnDefinitionsSelector } from '../columns/gridColumnsSelector';
import { getVisibleRows } from '../../utils/useGridVisibleRows';
import { clamp } from '../../../utils/utils';
export var focusStateInitializer = function focusStateInitializer(state) {
  return _extends({}, state, {
    focus: {
      cell: null,
      columnHeader: null
    },
    tabIndex: {
      cell: null,
      columnHeader: null
    }
  });
};
/**
 * @requires useGridParamsApi (method)
 * @requires useGridRows (method)
 * @requires useGridEditing (event)
 */

export var useGridFocus = function useGridFocus(apiRef, props) {
  var logger = useGridLogger(apiRef, 'useGridFocus');
  var lastClickedCell = React.useRef(null);
  var setCellFocus = React.useCallback(function (id, field) {
    // The row might have been deleted
    if (!apiRef.current.getRow(id)) {
      return;
    }

    var focusedCell = gridFocusCellSelector(apiRef);

    if ((focusedCell == null ? void 0 : focusedCell.id) === id && focusedCell.field === field) {
      return;
    }

    apiRef.current.setState(function (state) {
      logger.debug("Focusing on cell with id=".concat(id, " and field=").concat(field));
      return _extends({}, state, {
        tabIndex: {
          cell: {
            id: id,
            field: field
          },
          columnHeader: null
        },
        focus: {
          cell: {
            id: id,
            field: field
          },
          columnHeader: null
        }
      });
    });
    apiRef.current.forceUpdate();
    apiRef.current.publishEvent(GridEvents.cellFocusIn, apiRef.current.getCellParams(id, field));
  }, [apiRef, logger]);
  var setColumnHeaderFocus = React.useCallback(function (field) {
    var event = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var cell = gridFocusCellSelector(apiRef);

    if (cell) {
      apiRef.current.publishEvent(GridEvents.cellFocusOut, apiRef.current.getCellParams(cell.id, cell.field), event);
    }

    apiRef.current.setState(function (state) {
      logger.debug("Focusing on column header with colIndex=".concat(field));
      return _extends({}, state, {
        tabIndex: {
          columnHeader: {
            field: field
          },
          cell: null
        },
        focus: {
          columnHeader: {
            field: field
          },
          cell: null
        }
      });
    });
    apiRef.current.forceUpdate();
  }, [apiRef, logger]);
  var moveFocusToRelativeCell = React.useCallback(function (id, field, direction) {
    var columnIndexToFocus = apiRef.current.getColumnIndex(field);
    var rowIndexToFocus = apiRef.current.getRowIndexRelativeToVisibleRows(id);
    var visibleColumns = gridVisibleColumnDefinitionsSelector(apiRef);

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

    var currentPage = getVisibleRows(apiRef, {
      pagination: props.pagination,
      paginationMode: props.paginationMode
    });
    rowIndexToFocus = clamp(rowIndexToFocus, currentPage.range.firstRowIndex, currentPage.range.lastRowIndex);
    var rowToFocus = currentPage.rows[rowIndexToFocus];
    var columnToFocus = visibleColumns[columnIndexToFocus];
    apiRef.current.setCellFocus(rowToFocus.id, columnToFocus.field);
  }, [apiRef, props.pagination, props.paginationMode]);
  var handleCellDoubleClick = React.useCallback(function (_ref) {
    var id = _ref.id,
        field = _ref.field;
    apiRef.current.setCellFocus(id, field);
  }, [apiRef]);
  var handleCellKeyDown = React.useCallback(function (params, event) {
    // GRID_CELL_NAVIGATION_KEY_DOWN handles the focus on Enter, Tab and navigation keys
    if (event.key === 'Enter' || event.key === 'Tab' || isNavigationKey(event.key)) {
      return;
    }

    apiRef.current.setCellFocus(params.id, params.field);
  }, [apiRef]);
  var handleColumnHeaderFocus = React.useCallback(function (_ref2, event) {
    var field = _ref2.field;

    if (event.target !== event.currentTarget) {
      return;
    }

    apiRef.current.setColumnHeaderFocus(field, event);
  }, [apiRef]);
  var handleBlur = React.useCallback(function () {
    logger.debug("Clearing focus");
    apiRef.current.setState(function (state) {
      return _extends({}, state, {
        focus: {
          cell: null,
          columnHeader: null
        }
      });
    });
  }, [logger, apiRef]);
  var handleCellMouseUp = React.useCallback(function (params) {
    lastClickedCell.current = params;
  }, []);
  var handleDocumentClick = React.useCallback(function (event) {
    var cellParams = lastClickedCell.current;
    lastClickedCell.current = null;
    var focusedCell = gridFocusCellSelector(apiRef);

    if (!focusedCell) {
      if (cellParams) {
        apiRef.current.setCellFocus(cellParams.id, cellParams.field);
      }

      return;
    }

    if ((cellParams == null ? void 0 : cellParams.id) === focusedCell.id && (cellParams == null ? void 0 : cellParams.field) === focusedCell.field) {
      return;
    }

    var cellElement = apiRef.current.getCellElement(focusedCell.id, focusedCell.field);

    if (cellElement != null && cellElement.contains(event.target)) {
      return;
    } // The row might have been deleted during the click


    if (!apiRef.current.getRow(focusedCell.id)) {
      return;
    } // There's a focused cell but another cell was clicked
    // Publishes an event to notify that the focus was lost


    apiRef.current.publishEvent(GridEvents.cellFocusOut, apiRef.current.getCellParams(focusedCell.id, focusedCell.field), event);

    if (cellParams) {
      apiRef.current.setCellFocus(cellParams.id, cellParams.field);
    } else {
      apiRef.current.setState(function (state) {
        return _extends({}, state, {
          focus: {
            cell: null,
            columnHeader: null
          }
        });
      });
      apiRef.current.forceUpdate();
    }
  }, [apiRef]);
  var handleCellModeChange = React.useCallback(function (params) {
    if (params.cellMode === 'view') {
      return;
    }

    var cell = gridFocusCellSelector(apiRef);

    if ((cell == null ? void 0 : cell.id) !== params.id || (cell == null ? void 0 : cell.field) !== params.field) {
      apiRef.current.setCellFocus(params.id, params.field);
    }
  }, [apiRef]);
  useGridApiMethod(apiRef, {
    setCellFocus: setCellFocus,
    setColumnHeaderFocus: setColumnHeaderFocus,
    unstable_moveFocusToRelativeCell: moveFocusToRelativeCell
  }, 'GridFocusApi');
  React.useEffect(function () {
    var cell = gridFocusCellSelector(apiRef);

    if (cell) {
      var updatedRow = apiRef.current.getRow(cell.id);

      if (!updatedRow) {
        apiRef.current.setState(function (state) {
          return _extends({}, state, {
            focus: {
              cell: null,
              columnHeader: null
            }
          });
        });
      }
    }
  }, [apiRef, props.rows]);
  React.useEffect(function () {
    var doc = ownerDocument(apiRef.current.rootElementRef.current);
    doc.addEventListener('click', handleDocumentClick);
    return function () {
      doc.removeEventListener('click', handleDocumentClick);
    };
  }, [apiRef, handleDocumentClick]);
  useGridApiEventHandler(apiRef, GridEvents.columnHeaderBlur, handleBlur);
  useGridApiEventHandler(apiRef, GridEvents.cellDoubleClick, handleCellDoubleClick);
  useGridApiEventHandler(apiRef, GridEvents.cellMouseUp, handleCellMouseUp);
  useGridApiEventHandler(apiRef, GridEvents.cellKeyDown, handleCellKeyDown);
  useGridApiEventHandler(apiRef, GridEvents.cellModeChange, handleCellModeChange);
  useGridApiEventHandler(apiRef, GridEvents.columnHeaderFocus, handleColumnHeaderFocus);
};