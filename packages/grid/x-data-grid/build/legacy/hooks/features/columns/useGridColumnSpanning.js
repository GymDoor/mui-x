import React from 'react';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { useGridApiEventHandler } from '../../utils/useGridApiEventHandler';
import { GridEvents } from '../../../models/events/gridEvents';

/**
 * @requires useGridColumns (method, event)
 * @requires useGridParamsApi (method)
 */
export var useGridColumnSpanning = function useGridColumnSpanning(apiRef) {
  var lookup = React.useRef({});
  var setCellColSpanInfo = React.useCallback(function (rowId, columnIndex, cellColSpanInfo) {
    var sizes = lookup.current;

    if (!sizes[rowId]) {
      sizes[rowId] = {};
    }

    sizes[rowId][columnIndex] = cellColSpanInfo;
  }, []);
  var getCellColSpanInfo = React.useCallback(function (rowId, columnIndex) {
    var _lookup$current$rowId;

    return (_lookup$current$rowId = lookup.current[rowId]) == null ? void 0 : _lookup$current$rowId[columnIndex];
  }, []); // Calculate `colSpan` for the cell.

  var calculateCellColSpan = React.useCallback(function (params) {
    var columnIndex = params.columnIndex,
        rowId = params.rowId,
        minFirstColumnIndex = params.minFirstColumnIndex,
        maxLastColumnIndex = params.maxLastColumnIndex;
    var visibleColumns = apiRef.current.getVisibleColumns();
    var columnsLength = visibleColumns.length;
    var column = visibleColumns[columnIndex];
    var colSpan = typeof column.colSpan === 'function' ? column.colSpan(apiRef.current.getCellParams(rowId, column.field)) : column.colSpan;

    if (!colSpan || colSpan === 1) {
      setCellColSpanInfo(rowId, columnIndex, {
        spannedByColSpan: false,
        cellProps: {
          colSpan: 1,
          width: column.computedWidth
        }
      });
      return {
        colSpan: 1
      };
    }

    var width = column.computedWidth;

    for (var j = 1; j < colSpan; j += 1) {
      var nextColumnIndex = columnIndex + j; // Cells should be spanned only within their column section (left-pinned, right-pinned and unpinned).

      if (nextColumnIndex >= minFirstColumnIndex && nextColumnIndex < maxLastColumnIndex) {
        var nextColumn = visibleColumns[nextColumnIndex];
        width += nextColumn.computedWidth;
        setCellColSpanInfo(rowId, columnIndex + j, {
          spannedByColSpan: true,
          rightVisibleCellIndex: Math.min(columnIndex + colSpan, columnsLength - 1),
          leftVisibleCellIndex: columnIndex
        });
      }

      setCellColSpanInfo(rowId, columnIndex, {
        spannedByColSpan: false,
        cellProps: {
          colSpan: colSpan,
          width: width
        }
      });
    }

    return {
      colSpan: colSpan
    };
  }, [apiRef, setCellColSpanInfo]); // Calculate `colSpan` for each cell in the row

  var calculateColSpan = React.useCallback(function (_ref) {
    var rowId = _ref.rowId,
        minFirstColumn = _ref.minFirstColumn,
        maxLastColumn = _ref.maxLastColumn;

    for (var i = minFirstColumn; i < maxLastColumn; i += 1) {
      var cellProps = calculateCellColSpan({
        columnIndex: i,
        rowId: rowId,
        minFirstColumnIndex: minFirstColumn,
        maxLastColumnIndex: maxLastColumn
      });

      if (cellProps.colSpan > 1) {
        i += cellProps.colSpan - 1;
      }
    }
  }, [calculateCellColSpan]);
  var columnSpanningApi = {
    unstable_getCellColSpanInfo: getCellColSpanInfo,
    unstable_calculateColSpan: calculateColSpan
  };
  useGridApiMethod(apiRef, columnSpanningApi, 'GridColumnSpanningAPI');
  var handleColumnReorderChange = React.useCallback(function () {
    // `colSpan` needs to be recalculated after column reordering
    lookup.current = {};
  }, []);
  useGridApiEventHandler(apiRef, GridEvents.columnOrderChange, handleColumnReorderChange);
};