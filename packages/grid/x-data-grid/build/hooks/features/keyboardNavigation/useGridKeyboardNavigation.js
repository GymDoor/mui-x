import * as React from 'react';
import { GridEvents } from '../../../models/events';
import { gridVisibleColumnDefinitionsSelector } from '../columns/gridColumnsSelector';
import { useGridLogger } from '../../utils/useGridLogger';
import { useGridApiEventHandler } from '../../utils/useGridApiEventHandler';
import { gridVisibleSortedRowEntriesSelector } from '../filter/gridFilterSelector';
import { useGridVisibleRows } from '../../utils/useGridVisibleRows';
import { GRID_CHECKBOX_SELECTION_COL_DEF } from '../../../colDef/gridCheckboxSelectionColDef';
import { gridClasses } from '../../../constants/gridClasses';
import { GridCellModes } from '../../../models/gridEditRowModel';
import { isNavigationKey } from '../../../utils/keyboardUtils';
/**
 * @requires useGridSorting (method) - can be after
 * @requires useGridFilter (state) - can be after
 * @requires useGridColumns (state, method) - can be after
 * @requires useGridDimensions (method) - can be after
 * @requires useGridFocus (method) - can be after
 * @requires useGridScroll (method) - can be after
 * @requires useGridColumnSpanning (method) - can be after
 */

export const useGridKeyboardNavigation = (apiRef, props) => {
  const logger = useGridLogger(apiRef, 'useGridKeyboardNavigation');
  const currentPage = useGridVisibleRows(apiRef, props);
  /**
   * @param {number} colIndex Index of the column to focus
   * @param {number} rowIndex index of the row to focus
   * @param {string} closestColumnToUse Which closest column cell to use when the cell is spanned by `colSpan`.
   */

  const goToCell = React.useCallback((colIndex, rowIndex, closestColumnToUse = 'left') => {
    var _visibleSortedRows$ro;

    const visibleSortedRows = gridVisibleSortedRowEntriesSelector(apiRef);
    const rowId = (_visibleSortedRows$ro = visibleSortedRows[rowIndex]) == null ? void 0 : _visibleSortedRows$ro.id;
    const nextCellColSpanInfo = apiRef.current.unstable_getCellColSpanInfo(rowId, colIndex);

    if (nextCellColSpanInfo && nextCellColSpanInfo.spannedByColSpan) {
      if (closestColumnToUse === 'left') {
        colIndex = nextCellColSpanInfo.leftVisibleCellIndex;
      } else if (closestColumnToUse === 'right') {
        colIndex = nextCellColSpanInfo.rightVisibleCellIndex;
      }
    }

    logger.debug(`Navigating to cell row ${rowIndex}, col ${colIndex}`);
    apiRef.current.scrollToIndexes({
      colIndex,
      rowIndex
    });
    const field = apiRef.current.getVisibleColumns()[colIndex].field;
    apiRef.current.setCellFocus(rowId, field);
  }, [apiRef, logger]);
  const goToHeader = React.useCallback((colIndex, event) => {
    logger.debug(`Navigating to header col ${colIndex}`);
    apiRef.current.scrollToIndexes({
      colIndex
    });
    const field = apiRef.current.getVisibleColumns()[colIndex].field;
    apiRef.current.setColumnHeaderFocus(field, event);
  }, [apiRef, logger]);
  const handleCellNavigationKeyDown = React.useCallback((params, event) => {
    const dimensions = apiRef.current.getRootDimensions();

    if (!currentPage.range || !dimensions) {
      return;
    }

    const viewportPageSize = apiRef.current.unstable_getViewportPageSize();
    const visibleSortedRows = gridVisibleSortedRowEntriesSelector(apiRef);
    const colIndexBefore = params.field ? apiRef.current.getColumnIndex(params.field) : 0;
    const rowIndexBefore = visibleSortedRows.findIndex(row => row.id === params.id);
    const firstRowIndexInPage = currentPage.range.firstRowIndex;
    const lastRowIndexInPage = currentPage.range.lastRowIndex;
    const firstColIndex = 0;
    const lastColIndex = gridVisibleColumnDefinitionsSelector(apiRef).length - 1;
    let shouldPreventDefault = true;

    switch (event.key) {
      case 'ArrowDown':
      case 'Enter':
        {
          // "Enter" is only triggered by the row / cell editing feature
          if (rowIndexBefore < lastRowIndexInPage) {
            goToCell(colIndexBefore, rowIndexBefore + 1);
          }

          break;
        }

      case 'ArrowUp':
        {
          if (rowIndexBefore > firstRowIndexInPage) {
            goToCell(colIndexBefore, rowIndexBefore - 1);
          } else {
            goToHeader(colIndexBefore, event);
          }

          break;
        }

      case 'ArrowRight':
        {
          if (colIndexBefore < lastColIndex) {
            goToCell(colIndexBefore + 1, rowIndexBefore, 'right');
          }

          break;
        }

      case 'ArrowLeft':
        {
          if (colIndexBefore > firstColIndex) {
            goToCell(colIndexBefore - 1, rowIndexBefore);
          }

          break;
        }

      case 'Tab':
        {
          // "Tab" is only triggered by the row / cell editing feature
          if (event.shiftKey && colIndexBefore > firstColIndex) {
            goToCell(colIndexBefore - 1, rowIndexBefore, 'left');
          } else if (!event.shiftKey && colIndexBefore < lastColIndex) {
            goToCell(colIndexBefore + 1, rowIndexBefore, 'right');
          }

          break;
        }

      case ' ':
        {
          if (!event.shiftKey && rowIndexBefore < lastRowIndexInPage) {
            goToCell(colIndexBefore, Math.min(rowIndexBefore + viewportPageSize, lastRowIndexInPage));
          }

          break;
        }

      case 'PageDown':
        {
          if (rowIndexBefore < lastRowIndexInPage) {
            goToCell(colIndexBefore, Math.min(rowIndexBefore + viewportPageSize, lastRowIndexInPage));
          }

          break;
        }

      case 'PageUp':
        {
          // Go to the first row before going to header
          const nextRowIndex = Math.max(rowIndexBefore - viewportPageSize, firstRowIndexInPage);

          if (nextRowIndex !== rowIndexBefore && nextRowIndex >= firstRowIndexInPage) {
            goToCell(colIndexBefore, nextRowIndex);
          } else {
            goToHeader(colIndexBefore, event);
          }

          break;
        }

      case 'Home':
        {
          if (event.ctrlKey || event.metaKey || event.shiftKey) {
            goToCell(firstColIndex, firstRowIndexInPage);
          } else {
            goToCell(firstColIndex, rowIndexBefore);
          }

          break;
        }

      case 'End':
        {
          if (event.ctrlKey || event.metaKey || event.shiftKey) {
            goToCell(lastColIndex, lastRowIndexInPage);
          } else {
            goToCell(lastColIndex, rowIndexBefore);
          }

          break;
        }

      default:
        {
          shouldPreventDefault = false;
        }
    }

    if (shouldPreventDefault) {
      event.preventDefault();
    }
  }, [apiRef, currentPage, goToCell, goToHeader]);
  const handleColumnHeaderKeyDown = React.useCallback((params, event) => {
    var _currentPage$range$fi, _currentPage$range, _currentPage$range$la, _currentPage$range2;

    const headerTitleNode = event.currentTarget.querySelector(`.${gridClasses.columnHeaderTitleContainerContent}`);
    const isFromInsideContent = !!headerTitleNode && headerTitleNode.contains(event.target);

    if (isFromInsideContent && params.field !== GRID_CHECKBOX_SELECTION_COL_DEF.field) {
      // When focus is on a nested input, keyboard events have no effect to avoid conflicts with native events.
      // There is one exception for the checkBoxHeader
      return;
    }

    const dimensions = apiRef.current.getRootDimensions();

    if (!dimensions) {
      return;
    }

    const viewportPageSize = apiRef.current.unstable_getViewportPageSize();
    const colIndexBefore = params.field ? apiRef.current.getColumnIndex(params.field) : 0;
    const firstRowIndexInPage = (_currentPage$range$fi = (_currentPage$range = currentPage.range) == null ? void 0 : _currentPage$range.firstRowIndex) != null ? _currentPage$range$fi : null;
    const lastRowIndexInPage = (_currentPage$range$la = (_currentPage$range2 = currentPage.range) == null ? void 0 : _currentPage$range2.lastRowIndex) != null ? _currentPage$range$la : null;
    const firstColIndex = 0;
    const lastColIndex = gridVisibleColumnDefinitionsSelector(apiRef).length - 1;
    let shouldPreventDefault = true;

    switch (event.key) {
      case 'ArrowDown':
        {
          if (firstRowIndexInPage !== null) {
            goToCell(colIndexBefore, firstRowIndexInPage);
          }

          break;
        }

      case 'ArrowRight':
        {
          if (colIndexBefore < lastColIndex) {
            goToHeader(colIndexBefore + 1, event);
          }

          break;
        }

      case 'ArrowLeft':
        {
          if (colIndexBefore > firstColIndex) {
            goToHeader(colIndexBefore - 1, event);
          }

          break;
        }

      case 'PageDown':
        {
          if (firstRowIndexInPage !== null && lastRowIndexInPage !== null) {
            goToCell(colIndexBefore, Math.min(firstRowIndexInPage + viewportPageSize, lastRowIndexInPage));
          }

          break;
        }

      case 'Home':
        {
          goToHeader(firstColIndex, event);
          break;
        }

      case 'End':
        {
          goToHeader(lastColIndex, event);
          break;
        }

      case 'Enter':
        {
          if (event.ctrlKey || event.metaKey) {
            apiRef.current.toggleColumnMenu(params.field);
          }

          break;
        }

      case ' ':
        {
          // prevent Space event from scrolling
          break;
        }

      default:
        {
          shouldPreventDefault = false;
        }
    }

    if (shouldPreventDefault) {
      event.preventDefault();
    }
  }, [apiRef, currentPage, goToCell, goToHeader]);
  const handleCellKeyDown = React.useCallback((params, event) => {
    // Ignore portal
    if (!event.currentTarget.contains(event.target)) {
      return;
    } // Get the most recent params because the cell mode may have changed by another listener


    const cellParams = apiRef.current.getCellParams(params.id, params.field);

    if (cellParams.cellMode !== GridCellModes.Edit && isNavigationKey(event.key)) {
      apiRef.current.publishEvent(GridEvents.cellNavigationKeyDown, cellParams, event);
    }
  }, [apiRef]);
  useGridApiEventHandler(apiRef, GridEvents.cellNavigationKeyDown, handleCellNavigationKeyDown);
  useGridApiEventHandler(apiRef, GridEvents.columnHeaderKeyDown, handleColumnHeaderKeyDown);
  useGridApiEventHandler(apiRef, GridEvents.cellKeyDown, handleCellKeyDown);
};