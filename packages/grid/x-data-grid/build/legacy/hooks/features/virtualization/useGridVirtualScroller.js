import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _extends from "@babel/runtime/helpers/esm/extends";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
var _excluded = ["style"];
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { useForkRef } from '@mui/material/utils';
import { useGridApiContext } from '../../utils/useGridApiContext';
import { useGridRootProps } from '../../utils/useGridRootProps';
import { useGridSelector } from '../../utils/useGridSelector';
import { gridVisibleColumnDefinitionsSelector, gridColumnsTotalWidthSelector, gridColumnPositionsSelector } from '../columns/gridColumnsSelector';
import { gridDensityRowHeightSelector } from '../density/densitySelector';
import { gridFocusCellSelector, gridTabIndexCellSelector } from '../focus/gridFocusStateSelector';
import { gridEditRowsStateSelector } from '../editRows/gridEditRowsSelector';
import { useGridVisibleRows } from '../../utils/useGridVisibleRows';
import { GridEvents } from '../../../models/events';
import { useGridApiEventHandler } from '../../utils/useGridApiEventHandler';
import { clamp } from '../../../utils/utils';
import { selectedIdsLookupSelector } from '../selection/gridSelectionSelector';
import { gridRowsMetaSelector } from '../rows/gridRowsMetaSelector';
import { getFirstNonSpannedColumnToRender } from '../columns/gridColumnsUtils'; // Uses binary search to avoid looping through all possible positions

import { jsx as _jsx } from "react/jsx-runtime";
export function getIndexFromScroll(offset, positions) {
  var sliceStart = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var sliceEnd = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : positions.length;

  if (positions.length <= 0) {
    return -1;
  }

  if (sliceStart >= sliceEnd) {
    return sliceStart;
  }

  var pivot = sliceStart + Math.floor((sliceEnd - sliceStart) / 2);
  var itemOffset = positions[pivot];
  return offset <= itemOffset ? getIndexFromScroll(offset, positions, sliceStart, pivot) : getIndexFromScroll(offset, positions, pivot + 1, sliceEnd);
}
export var getRenderableIndexes = function getRenderableIndexes(_ref) {
  var firstIndex = _ref.firstIndex,
      lastIndex = _ref.lastIndex,
      buffer = _ref.buffer,
      minFirstIndex = _ref.minFirstIndex,
      maxLastIndex = _ref.maxLastIndex;
  return [clamp(firstIndex - buffer, minFirstIndex, maxLastIndex), clamp(lastIndex + buffer, minFirstIndex, maxLastIndex)];
};
export var useGridVirtualScroller = function useGridVirtualScroller(props) {
  var apiRef = useGridApiContext();
  var rootProps = useGridRootProps();
  var visibleColumns = useGridSelector(apiRef, gridVisibleColumnDefinitionsSelector);
  var ref = props.ref,
      disableVirtualization = props.disableVirtualization,
      onRenderZonePositioning = props.onRenderZonePositioning,
      _props$renderZoneMinC = props.renderZoneMinColumnIndex,
      renderZoneMinColumnIndex = _props$renderZoneMinC === void 0 ? 0 : _props$renderZoneMinC,
      _props$renderZoneMaxC = props.renderZoneMaxColumnIndex,
      renderZoneMaxColumnIndex = _props$renderZoneMaxC === void 0 ? visibleColumns.length : _props$renderZoneMaxC,
      getRowProps = props.getRowProps;
  var columnPositions = useGridSelector(apiRef, gridColumnPositionsSelector);
  var columnsTotalWidth = useGridSelector(apiRef, gridColumnsTotalWidthSelector);
  var rowHeight = useGridSelector(apiRef, gridDensityRowHeightSelector);
  var cellFocus = useGridSelector(apiRef, gridFocusCellSelector);
  var cellTabIndex = useGridSelector(apiRef, gridTabIndexCellSelector);
  var rowsMeta = useGridSelector(apiRef, gridRowsMetaSelector);
  var editRowsState = useGridSelector(apiRef, gridEditRowsStateSelector);
  var selectedRowsLookup = useGridSelector(apiRef, selectedIdsLookupSelector);
  var currentPage = useGridVisibleRows(apiRef, rootProps);
  var renderZoneRef = React.useRef(null);
  var rootRef = React.useRef(null);
  var handleRef = useForkRef(ref, rootRef);

  var _React$useState = React.useState(null),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      renderContext = _React$useState2[0],
      setRenderContext = _React$useState2[1];

  var prevRenderContext = React.useRef(renderContext);
  var scrollPosition = React.useRef({
    top: 0,
    left: 0
  });

  var _React$useState3 = React.useState(null),
      _React$useState4 = _slicedToArray(_React$useState3, 2),
      containerWidth = _React$useState4[0],
      setContainerWidth = _React$useState4[1];

  var prevTotalWidth = React.useRef(columnsTotalWidth);
  var computeRenderContext = React.useCallback(function () {
    if (disableVirtualization) {
      return {
        firstRowIndex: 0,
        lastRowIndex: currentPage.rows.length,
        firstColumnIndex: 0,
        lastColumnIndex: visibleColumns.length
      };
    }

    var _ref2 = scrollPosition.current,
        top = _ref2.top,
        left = _ref2.left;
    var firstRowIndex = getIndexFromScroll(top, rowsMeta.positions);
    var lastRowIndex = rootProps.autoHeight ? firstRowIndex + currentPage.rows.length : getIndexFromScroll(top + rootRef.current.clientHeight, rowsMeta.positions);
    var firstColumnIndex = getIndexFromScroll(left, columnPositions);
    var lastColumnIndex = getIndexFromScroll(left + containerWidth, columnPositions);
    return {
      firstRowIndex: firstRowIndex,
      lastRowIndex: lastRowIndex,
      firstColumnIndex: firstColumnIndex,
      lastColumnIndex: lastColumnIndex
    };
  }, [disableVirtualization, rowsMeta.positions, rootProps.autoHeight, currentPage.rows.length, columnPositions, containerWidth, visibleColumns.length]);
  React.useEffect(function () {
    if (disableVirtualization) {
      renderZoneRef.current.style.transform = "translate3d(0px, 0px, 0px)";
    } else {
      // TODO a scroll reset should not be necessary
      rootRef.current.scrollLeft = 0;
      rootRef.current.scrollTop = 0;
    }
  }, [disableVirtualization]);
  React.useEffect(function () {
    setContainerWidth(rootRef.current.clientWidth);
  }, [rowsMeta.currentPageTotalHeight]);
  var handleResize = React.useCallback(function () {
    if (rootRef.current) {
      setContainerWidth(rootRef.current.clientWidth);
    }
  }, []);
  useGridApiEventHandler(apiRef, GridEvents.resize, handleResize);
  var updateRenderZonePosition = React.useCallback(function (nextRenderContext) {
    var _getRenderableIndexes = getRenderableIndexes({
      firstIndex: nextRenderContext.firstRowIndex,
      lastIndex: nextRenderContext.lastRowIndex,
      minFirstIndex: 0,
      maxLastIndex: currentPage.rows.length,
      buffer: rootProps.rowBuffer
    }),
        _getRenderableIndexes2 = _slicedToArray(_getRenderableIndexes, 2),
        firstRowToRender = _getRenderableIndexes2[0],
        lastRowToRender = _getRenderableIndexes2[1];

    var _getRenderableIndexes3 = getRenderableIndexes({
      firstIndex: nextRenderContext.firstColumnIndex,
      lastIndex: nextRenderContext.lastColumnIndex,
      minFirstIndex: renderZoneMinColumnIndex,
      maxLastIndex: renderZoneMaxColumnIndex,
      buffer: rootProps.columnBuffer
    }),
        _getRenderableIndexes4 = _slicedToArray(_getRenderableIndexes3, 1),
        initialFirstColumnToRender = _getRenderableIndexes4[0];

    var firstColumnToRender = getFirstNonSpannedColumnToRender({
      firstColumnToRender: initialFirstColumnToRender,
      apiRef: apiRef,
      firstRowToRender: firstRowToRender,
      lastRowToRender: lastRowToRender,
      visibleRows: currentPage.rows
    });
    var top = gridRowsMetaSelector(apiRef.current.state).positions[firstRowToRender];
    var left = gridColumnPositionsSelector(apiRef)[firstColumnToRender]; // Call directly the selector because it might be outdated when this method is called

    renderZoneRef.current.style.transform = "translate3d(".concat(left, "px, ").concat(top, "px, 0px)");

    if (typeof onRenderZonePositioning === 'function') {
      onRenderZonePositioning({
        top: top,
        left: left
      });
    }
  }, [apiRef, currentPage.rows, onRenderZonePositioning, renderZoneMinColumnIndex, renderZoneMaxColumnIndex, rootProps.columnBuffer, rootProps.rowBuffer]);
  React.useLayoutEffect(function () {
    if (renderContext) {
      updateRenderZonePosition(renderContext);
    }
  }, [renderContext, updateRenderZonePosition]);
  var updateRenderContext = React.useCallback(function (nextRenderContext) {
    setRenderContext(nextRenderContext);
    prevRenderContext.current = nextRenderContext;
  }, [setRenderContext, prevRenderContext]);
  React.useEffect(function () {
    if (containerWidth == null) {
      return;
    }

    var initialRenderContext = computeRenderContext();
    updateRenderContext(initialRenderContext);
    var _ref3 = scrollPosition.current,
        top = _ref3.top,
        left = _ref3.left;
    var params = {
      top: top,
      left: left,
      renderContext: initialRenderContext
    };
    apiRef.current.publishEvent(GridEvents.rowsScroll, params);
  }, [apiRef, computeRenderContext, containerWidth, updateRenderContext]);

  var handleScroll = function handleScroll(event) {
    var _event$currentTarget = event.currentTarget,
        scrollTop = _event$currentTarget.scrollTop,
        scrollLeft = _event$currentTarget.scrollLeft;
    scrollPosition.current.top = scrollTop;
    scrollPosition.current.left = scrollLeft; // On iOS and macOS, negative offsets are possible when swiping past the start

    if (scrollLeft < 0 || scrollTop < 0 || !prevRenderContext.current) {
      return;
    } // When virtualization is disabled, the context never changes during scroll


    var nextRenderContext = disableVirtualization ? prevRenderContext.current : computeRenderContext();
    var topRowsScrolledSincePreviousRender = Math.abs(nextRenderContext.firstRowIndex - prevRenderContext.current.firstRowIndex);
    var bottomRowsScrolledSincePreviousRender = Math.abs(nextRenderContext.lastRowIndex - prevRenderContext.current.lastRowIndex);
    var topColumnsScrolledSincePreviousRender = Math.abs(nextRenderContext.firstColumnIndex - prevRenderContext.current.firstColumnIndex);
    var bottomColumnsScrolledSincePreviousRender = Math.abs(nextRenderContext.lastColumnIndex - prevRenderContext.current.lastColumnIndex);
    var shouldSetState = topRowsScrolledSincePreviousRender >= rootProps.rowThreshold || bottomRowsScrolledSincePreviousRender >= rootProps.rowThreshold || topColumnsScrolledSincePreviousRender >= rootProps.columnThreshold || bottomColumnsScrolledSincePreviousRender >= rootProps.columnThreshold || prevTotalWidth.current !== columnsTotalWidth; // TODO v6: rename event to a wider name, it's not only fired for row scrolling

    apiRef.current.publishEvent(GridEvents.rowsScroll, {
      top: scrollTop,
      left: scrollLeft,
      renderContext: shouldSetState ? nextRenderContext : prevRenderContext.current
    }, event);

    if (shouldSetState) {
      // Prevents batching render context changes
      ReactDOM.flushSync(function () {
        updateRenderContext(nextRenderContext);
      });
      prevTotalWidth.current = columnsTotalWidth;
    }
  };

  var getRows = function getRows() {
    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      renderContext: renderContext
    };
    var nextRenderContext = params.renderContext,
        _params$minFirstColum = params.minFirstColumn,
        minFirstColumn = _params$minFirstColum === void 0 ? renderZoneMinColumnIndex : _params$minFirstColum,
        _params$maxLastColumn = params.maxLastColumn,
        maxLastColumn = _params$maxLastColumn === void 0 ? renderZoneMaxColumnIndex : _params$maxLastColumn,
        _params$availableSpac = params.availableSpace,
        availableSpace = _params$availableSpac === void 0 ? containerWidth : _params$availableSpac;

    if (!currentPage.range || !nextRenderContext || availableSpace == null) {
      return null;
    }

    var rowBuffer = !disableVirtualization ? rootProps.rowBuffer : 0;
    var columnBuffer = !disableVirtualization ? rootProps.columnBuffer : 0;

    var _getRenderableIndexes5 = getRenderableIndexes({
      firstIndex: nextRenderContext.firstRowIndex,
      lastIndex: nextRenderContext.lastRowIndex,
      minFirstIndex: 0,
      maxLastIndex: currentPage.rows.length,
      buffer: rowBuffer
    }),
        _getRenderableIndexes6 = _slicedToArray(_getRenderableIndexes5, 2),
        firstRowToRender = _getRenderableIndexes6[0],
        lastRowToRender = _getRenderableIndexes6[1];

    var renderedRows = [];

    for (var i = firstRowToRender; i < lastRowToRender; i += 1) {
      var row = currentPage.rows[i];
      renderedRows.push(row);
      apiRef.current.unstable_calculateColSpan({
        rowId: row.id,
        minFirstColumn: minFirstColumn,
        maxLastColumn: maxLastColumn
      });
    }

    var _getRenderableIndexes7 = getRenderableIndexes({
      firstIndex: nextRenderContext.firstColumnIndex,
      lastIndex: nextRenderContext.lastColumnIndex,
      minFirstIndex: minFirstColumn,
      maxLastIndex: maxLastColumn,
      buffer: columnBuffer
    }),
        _getRenderableIndexes8 = _slicedToArray(_getRenderableIndexes7, 2),
        initialFirstColumnToRender = _getRenderableIndexes8[0],
        lastColumnToRender = _getRenderableIndexes8[1];

    var firstColumnToRender = getFirstNonSpannedColumnToRender({
      firstColumnToRender: initialFirstColumnToRender,
      apiRef: apiRef,
      firstRowToRender: firstRowToRender,
      lastRowToRender: lastRowToRender,
      visibleRows: currentPage.rows
    });
    var renderedColumns = visibleColumns.slice(firstColumnToRender, lastColumnToRender);
    var rows = [];

    for (var _i = 0; _i < renderedRows.length; _i += 1) {
      var _rootProps$components;

      var _renderedRows$_i = renderedRows[_i],
          _id = _renderedRows$_i.id,
          _model = _renderedRows$_i.model;
      var lastVisibleRowIndex = firstRowToRender + _i === currentPage.rows.length - 1;
      var targetRowHeight = apiRef.current.unstable_getRowHeight(_id);
      var isSelected = void 0;

      if (selectedRowsLookup[_id] == null) {
        isSelected = false;
      } else if (typeof rootProps.isRowSelectable === 'function') {
        isSelected = rootProps.isRowSelectable(apiRef.current.getRowParams(_id));
      } else {
        isSelected = true;
      }

      rows.push( /*#__PURE__*/_jsx(rootProps.components.Row, _extends({
        row: _model,
        rowId: _id,
        rowHeight: targetRowHeight,
        cellFocus: cellFocus // TODO move to inside the row
        ,
        cellTabIndex: cellTabIndex // TODO move to inside the row
        ,
        editRowsState: editRowsState // TODO move to inside the row
        ,
        renderedColumns: renderedColumns,
        visibleColumns: visibleColumns,
        firstColumnToRender: firstColumnToRender,
        lastColumnToRender: lastColumnToRender,
        selected: isSelected,
        index: currentPage.range.firstRowIndex + firstRowToRender + _i,
        containerWidth: availableSpace,
        isLastVisible: lastVisibleRowIndex
      }, typeof getRowProps === 'function' ? getRowProps(_id, _model) : {}, (_rootProps$components = rootProps.componentsProps) == null ? void 0 : _rootProps$components.row), _id));
    }

    return rows;
  };

  var needsHorizontalScrollbar = containerWidth && columnsTotalWidth > containerWidth;
  var contentSize = React.useMemo(function () {
    // In cases where the columns exceed the available width,
    // the horizontal scrollbar should be shown even when there're no rows.
    // Keeping 1px as minimum height ensures that the scrollbar will visible if necessary.
    var height = Math.max(rowsMeta.currentPageTotalHeight, 1);
    var shouldExtendContent = false;

    if (rootRef != null && rootRef.current && height <= (rootRef == null ? void 0 : rootRef.current.clientHeight)) {
      shouldExtendContent = true;
    }

    var size = {
      width: needsHorizontalScrollbar ? columnsTotalWidth : 'auto',
      height: height,
      minHeight: shouldExtendContent ? '100%' : 'auto'
    };

    if (rootProps.autoHeight && currentPage.rows.length === 0) {
      size.height = 2 * rowHeight; // Give room to show the overlay when there's no row.
    }

    return size;
  }, [rootRef, columnsTotalWidth, rowsMeta.currentPageTotalHeight, currentPage.rows.length, needsHorizontalScrollbar, rootProps.autoHeight, rowHeight]);
  React.useEffect(function () {
    apiRef.current.publishEvent(GridEvents.virtualScrollerContentSizeChange);
  }, [apiRef, contentSize]);

  if (rootProps.autoHeight && currentPage.rows.length === 0) {
    contentSize.height = 2 * rowHeight; // Give room to show the overlay when there no rows.
  }

  var rootStyle = {};

  if (!needsHorizontalScrollbar) {
    rootStyle.overflowX = 'hidden';
  }

  var getRenderContext = React.useCallback(function () {
    return prevRenderContext.current;
  }, []);
  apiRef.current.unstable_getRenderContext = getRenderContext;
  return {
    renderContext: renderContext,
    updateRenderZonePosition: updateRenderZonePosition,
    getRows: getRows,
    getRootProps: function getRootProps() {
      var _ref4 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var _ref4$style = _ref4.style,
          style = _ref4$style === void 0 ? {} : _ref4$style,
          other = _objectWithoutProperties(_ref4, _excluded);

      return _extends({
        ref: handleRef,
        onScroll: handleScroll,
        style: _extends({}, style, rootStyle)
      }, other);
    },
    getContentProps: function getContentProps() {
      var _ref5 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref5$style = _ref5.style,
          style = _ref5$style === void 0 ? {} : _ref5$style;

      return {
        style: _extends({}, style, contentSize)
      };
    },
    getRenderZoneProps: function getRenderZoneProps() {
      return {
        ref: renderZoneRef
      };
    }
  };
};