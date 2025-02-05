"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useGridKeyboardNavigation = void 0;

var React = _interopRequireWildcard(require("react"));

var _events = require("../../../models/events");

var _gridColumnsSelector = require("../columns/gridColumnsSelector");

var _useGridLogger = require("../../utils/useGridLogger");

var _useGridApiEventHandler = require("../../utils/useGridApiEventHandler");

var _gridFilterSelector = require("../filter/gridFilterSelector");

var _useGridVisibleRows = require("../../utils/useGridVisibleRows");

var _gridCheckboxSelectionColDef = require("../../../colDef/gridCheckboxSelectionColDef");

var _gridClasses = require("../../../constants/gridClasses");

var _gridEditRowModel = require("../../../models/gridEditRowModel");

var _keyboardUtils = require("../../../utils/keyboardUtils");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/**
 * @requires useGridSorting (method) - can be after
 * @requires useGridFilter (state) - can be after
 * @requires useGridColumns (state, method) - can be after
 * @requires useGridDimensions (method) - can be after
 * @requires useGridFocus (method) - can be after
 * @requires useGridScroll (method) - can be after
 * @requires useGridColumnSpanning (method) - can be after
 */
const useGridKeyboardNavigation = (apiRef, props) => {
  const logger = (0, _useGridLogger.useGridLogger)(apiRef, 'useGridKeyboardNavigation');
  const currentPage = (0, _useGridVisibleRows.useGridVisibleRows)(apiRef, props);
  /**
   * @param {number} colIndex Index of the column to focus
   * @param {number} rowIndex index of the row to focus
   * @param {string} closestColumnToUse Which closest column cell to use when the cell is spanned by `colSpan`.
   */

  const goToCell = React.useCallback((colIndex, rowIndex, closestColumnToUse = 'left') => {
    var _visibleSortedRows$ro;

    const visibleSortedRows = (0, _gridFilterSelector.gridVisibleSortedRowEntriesSelector)(apiRef);
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
    const visibleSortedRows = (0, _gridFilterSelector.gridVisibleSortedRowEntriesSelector)(apiRef);
    const colIndexBefore = params.field ? apiRef.current.getColumnIndex(params.field) : 0;
    const rowIndexBefore = visibleSortedRows.findIndex(row => row.id === params.id);
    const firstRowIndexInPage = currentPage.range.firstRowIndex;
    const lastRowIndexInPage = currentPage.range.lastRowIndex;
    const firstColIndex = 0;
    const lastColIndex = (0, _gridColumnsSelector.gridVisibleColumnDefinitionsSelector)(apiRef).length - 1;
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

    const headerTitleNode = event.currentTarget.querySelector(`.${_gridClasses.gridClasses.columnHeaderTitleContainerContent}`);
    const isFromInsideContent = !!headerTitleNode && headerTitleNode.contains(event.target);

    if (isFromInsideContent && params.field !== _gridCheckboxSelectionColDef.GRID_CHECKBOX_SELECTION_COL_DEF.field) {
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
    const lastColIndex = (0, _gridColumnsSelector.gridVisibleColumnDefinitionsSelector)(apiRef).length - 1;
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

    if (cellParams.cellMode !== _gridEditRowModel.GridCellModes.Edit && (0, _keyboardUtils.isNavigationKey)(event.key)) {
      apiRef.current.publishEvent(_events.GridEvents.cellNavigationKeyDown, cellParams, event);
    }
  }, [apiRef]);
  (0, _useGridApiEventHandler.useGridApiEventHandler)(apiRef, _events.GridEvents.cellNavigationKeyDown, handleCellNavigationKeyDown);
  (0, _useGridApiEventHandler.useGridApiEventHandler)(apiRef, _events.GridEvents.columnHeaderKeyDown, handleColumnHeaderKeyDown);
  (0, _useGridApiEventHandler.useGridApiEventHandler)(apiRef, _events.GridEvents.cellKeyDown, handleCellKeyDown);
};

exports.useGridKeyboardNavigation = useGridKeyboardNavigation;