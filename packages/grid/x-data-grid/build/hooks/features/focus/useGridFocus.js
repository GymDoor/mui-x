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
export const focusStateInitializer = state => _extends({}, state, {
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

export const useGridFocus = (apiRef, props) => {
  const logger = useGridLogger(apiRef, 'useGridFocus');
  const lastClickedCell = React.useRef(null);
  const setCellFocus = React.useCallback((id, field) => {
    // The row might have been deleted
    if (!apiRef.current.getRow(id)) {
      return;
    }

    const focusedCell = gridFocusCellSelector(apiRef);

    if ((focusedCell == null ? void 0 : focusedCell.id) === id && focusedCell.field === field) {
      return;
    }

    apiRef.current.setState(state => {
      logger.debug(`Focusing on cell with id=${id} and field=${field}`);
      return _extends({}, state, {
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
    apiRef.current.publishEvent(GridEvents.cellFocusIn, apiRef.current.getCellParams(id, field));
  }, [apiRef, logger]);
  const setColumnHeaderFocus = React.useCallback((field, event = {}) => {
    const cell = gridFocusCellSelector(apiRef);

    if (cell) {
      apiRef.current.publishEvent(GridEvents.cellFocusOut, apiRef.current.getCellParams(cell.id, cell.field), event);
    }

    apiRef.current.setState(state => {
      logger.debug(`Focusing on column header with colIndex=${field}`);
      return _extends({}, state, {
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
    const visibleColumns = gridVisibleColumnDefinitionsSelector(apiRef);

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

    const currentPage = getVisibleRows(apiRef, {
      pagination: props.pagination,
      paginationMode: props.paginationMode
    });
    rowIndexToFocus = clamp(rowIndexToFocus, currentPage.range.firstRowIndex, currentPage.range.lastRowIndex);
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
    if (event.key === 'Enter' || event.key === 'Tab' || isNavigationKey(event.key)) {
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
    apiRef.current.setState(state => _extends({}, state, {
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
    const focusedCell = gridFocusCellSelector(apiRef);

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


    apiRef.current.publishEvent(GridEvents.cellFocusOut, apiRef.current.getCellParams(focusedCell.id, focusedCell.field), event);

    if (cellParams) {
      apiRef.current.setCellFocus(cellParams.id, cellParams.field);
    } else {
      apiRef.current.setState(state => _extends({}, state, {
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

    const cell = gridFocusCellSelector(apiRef);

    if ((cell == null ? void 0 : cell.id) !== params.id || (cell == null ? void 0 : cell.field) !== params.field) {
      apiRef.current.setCellFocus(params.id, params.field);
    }
  }, [apiRef]);
  useGridApiMethod(apiRef, {
    setCellFocus,
    setColumnHeaderFocus,
    unstable_moveFocusToRelativeCell: moveFocusToRelativeCell
  }, 'GridFocusApi');
  React.useEffect(() => {
    const cell = gridFocusCellSelector(apiRef);

    if (cell) {
      const updatedRow = apiRef.current.getRow(cell.id);

      if (!updatedRow) {
        apiRef.current.setState(state => _extends({}, state, {
          focus: {
            cell: null,
            columnHeader: null
          }
        }));
      }
    }
  }, [apiRef, props.rows]);
  React.useEffect(() => {
    const doc = ownerDocument(apiRef.current.rootElementRef.current);
    doc.addEventListener('click', handleDocumentClick);
    return () => {
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