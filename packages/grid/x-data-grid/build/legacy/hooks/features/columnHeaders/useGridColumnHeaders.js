import _extends from "@babel/runtime/helpers/esm/extends";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { useForkRef } from '@mui/material/utils';
import { defaultMemoize } from 'reselect';
import { useGridApiContext } from '../../utils/useGridApiContext';
import { useGridSelector } from '../../utils/useGridSelector';
import { gridVisibleColumnDefinitionsSelector, gridColumnPositionsSelector } from '../columns/gridColumnsSelector';
import { gridTabIndexColumnHeaderSelector, gridTabIndexCellSelector, gridFocusColumnHeaderSelector } from '../focus/gridFocusStateSelector';
import { gridDensityHeaderHeightSelector } from '../density/densitySelector';
import { gridFilterActiveItemsLookupSelector } from '../filter/gridFilterSelector';
import { gridSortColumnLookupSelector } from '../sorting/gridSortingSelector';
import { gridColumnMenuSelector } from '../columnMenu/columnMenuSelector';
import { useGridRootProps } from '../../utils/useGridRootProps';
import { useGridApiEventHandler } from '../../utils/useGridApiEventHandler';
import { GridEvents } from '../../../models/events';
import { GridColumnHeaderItem } from '../../../components/columnHeaders/GridColumnHeaderItem';
import { getFirstColumnIndexToRender } from '../columns/gridColumnsUtils';
import { useGridVisibleRows } from '../../utils/useGridVisibleRows';
import { getRenderableIndexes } from '../virtualization/useGridVirtualScroller';
import { jsx as _jsx } from "react/jsx-runtime";

function isUIEvent(event) {
  return !!event.target;
}

export var useGridColumnHeaders = function useGridColumnHeaders(props) {
  var innerRefProp = props.innerRef,
      _props$minColumnIndex = props.minColumnIndex,
      minColumnIndex = _props$minColumnIndex === void 0 ? 0 : _props$minColumnIndex;

  var _React$useState = React.useState(''),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      dragCol = _React$useState2[0],
      setDragCol = _React$useState2[1];

  var _React$useState3 = React.useState(''),
      _React$useState4 = _slicedToArray(_React$useState3, 2),
      resizeCol = _React$useState4[0],
      setResizeCol = _React$useState4[1];

  var apiRef = useGridApiContext();
  var visibleColumns = useGridSelector(apiRef, gridVisibleColumnDefinitionsSelector);
  var columnPositions = useGridSelector(apiRef, gridColumnPositionsSelector);
  var tabIndexState = useGridSelector(apiRef, gridTabIndexColumnHeaderSelector);
  var cellTabIndexState = useGridSelector(apiRef, gridTabIndexCellSelector);
  var columnHeaderFocus = useGridSelector(apiRef, gridFocusColumnHeaderSelector);
  var headerHeight = useGridSelector(apiRef, gridDensityHeaderHeightSelector);
  var filterColumnLookup = useGridSelector(apiRef, gridFilterActiveItemsLookupSelector);
  var sortColumnLookup = useGridSelector(apiRef, gridSortColumnLookupSelector);
  var columnMenuState = useGridSelector(apiRef, gridColumnMenuSelector);
  var rootProps = useGridRootProps();
  var innerRef = React.useRef(null);
  var handleInnerRef = useForkRef(innerRefProp, innerRef);

  var _React$useState5 = React.useState(null),
      _React$useState6 = _slicedToArray(_React$useState5, 2),
      renderContext = _React$useState6[0],
      setRenderContext = _React$useState6[1];

  var prevRenderContext = React.useRef(renderContext);
  var prevScrollLeft = React.useRef(0);
  var currentPage = useGridVisibleRows(apiRef, rootProps);
  React.useEffect(function () {
    apiRef.current.columnHeadersContainerElementRef.current.scrollLeft = 0;
  }, [apiRef]); // memoize `getFirstColumnIndexToRender`, since it's called on scroll

  var getFirstColumnIndexToRenderRef = React.useRef(defaultMemoize(getFirstColumnIndexToRender, {
    equalityCheck: function equalityCheck(a, b) {
      return ['firstColumnIndex', 'minColumnIndex', 'columnBuffer'].every(function (key) {
        return a[key] === b[key];
      });
    }
  }));
  var updateInnerPosition = React.useCallback(function (nextRenderContext) {
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

    var firstColumnToRender = getFirstColumnIndexToRenderRef.current({
      firstColumnIndex: nextRenderContext.firstColumnIndex,
      minColumnIndex: minColumnIndex,
      columnBuffer: rootProps.columnBuffer,
      firstRowToRender: firstRowToRender,
      lastRowToRender: lastRowToRender,
      apiRef: apiRef,
      visibleRows: currentPage.rows
    });
    var offset = firstColumnToRender > 0 ? prevScrollLeft.current - columnPositions[firstColumnToRender] : prevScrollLeft.current;
    innerRef.current.style.transform = "translate3d(".concat(-offset, "px, 0px, 0px)");
  }, [columnPositions, minColumnIndex, rootProps.columnBuffer, apiRef, currentPage.rows, rootProps.rowBuffer]);
  React.useLayoutEffect(function () {
    if (renderContext) {
      updateInnerPosition(renderContext);
    }
  }, [renderContext, updateInnerPosition]);
  var handleScroll = React.useCallback(function (_ref, event) {
    var _prevRenderContext$cu, _prevRenderContext$cu2;

    var left = _ref.left,
        _ref$renderContext = _ref.renderContext,
        nextRenderContext = _ref$renderContext === void 0 ? null : _ref$renderContext;

    if (!innerRef.current) {
      return;
    } // Ignore vertical scroll.
    // Excepts the first event which sets the previous render context.


    if (prevScrollLeft.current === left && ((_prevRenderContext$cu = prevRenderContext.current) == null ? void 0 : _prevRenderContext$cu.firstColumnIndex) === (nextRenderContext == null ? void 0 : nextRenderContext.firstColumnIndex) && ((_prevRenderContext$cu2 = prevRenderContext.current) == null ? void 0 : _prevRenderContext$cu2.lastColumnIndex) === (nextRenderContext == null ? void 0 : nextRenderContext.lastColumnIndex)) {
      return;
    }

    prevScrollLeft.current = left; // We can only update the position when we guarantee that the render context has been
    // rendered. This is achieved using ReactDOM.flushSync or when the context doesn't change.

    var canUpdateInnerPosition = false;

    if (nextRenderContext !== prevRenderContext.current || !prevRenderContext.current) {
      // ReactDOM.flushSync cannot be called on `scroll` events fired inside effects
      if (isUIEvent(event)) {
        // To prevent flickering, the inner position can only be updated after the new context has
        // been rendered. ReactDOM.flushSync ensures that the state changes will happen before
        // updating the position.
        ReactDOM.flushSync(function () {
          setRenderContext(nextRenderContext);
        });
        canUpdateInnerPosition = true;
      } else {
        setRenderContext(nextRenderContext);
      }

      prevRenderContext.current = nextRenderContext;
    } else {
      canUpdateInnerPosition = true;
    } // Pass directly the render context to avoid waiting for the next render


    if (nextRenderContext && canUpdateInnerPosition) {
      updateInnerPosition(nextRenderContext);
    }
  }, [updateInnerPosition]);
  var handleColumnResizeStart = React.useCallback(function (params) {
    return setResizeCol(params.field);
  }, []);
  var handleColumnResizeStop = React.useCallback(function () {
    return setResizeCol('');
  }, []);
  var handleColumnReorderStart = React.useCallback(function (params) {
    return setDragCol(params.field);
  }, []);
  var handleColumnReorderStop = React.useCallback(function () {
    return setDragCol('');
  }, []);
  useGridApiEventHandler(apiRef, GridEvents.columnResizeStart, handleColumnResizeStart);
  useGridApiEventHandler(apiRef, GridEvents.columnResizeStop, handleColumnResizeStop);
  useGridApiEventHandler(apiRef, GridEvents.columnHeaderDragStart, handleColumnReorderStart);
  useGridApiEventHandler(apiRef, GridEvents.columnHeaderDragEnd, handleColumnReorderStop);
  useGridApiEventHandler(apiRef, GridEvents.rowsScroll, handleScroll);

  var getColumns = function getColumns(params) {
    var other = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var _ref2 = params || {},
        _ref2$renderContext = _ref2.renderContext,
        nextRenderContext = _ref2$renderContext === void 0 ? renderContext : _ref2$renderContext,
        _ref2$minFirstColumn = _ref2.minFirstColumn,
        minFirstColumn = _ref2$minFirstColumn === void 0 ? minColumnIndex : _ref2$minFirstColumn,
        _ref2$maxLastColumn = _ref2.maxLastColumn,
        maxLastColumn = _ref2$maxLastColumn === void 0 ? visibleColumns.length : _ref2$maxLastColumn;

    if (!nextRenderContext) {
      return null;
    }

    var columns = [];

    var _getRenderableIndexes3 = getRenderableIndexes({
      firstIndex: nextRenderContext.firstRowIndex,
      lastIndex: nextRenderContext.lastRowIndex,
      minFirstIndex: 0,
      maxLastIndex: currentPage.rows.length,
      buffer: rootProps.rowBuffer
    }),
        _getRenderableIndexes4 = _slicedToArray(_getRenderableIndexes3, 2),
        firstRowToRender = _getRenderableIndexes4[0],
        lastRowToRender = _getRenderableIndexes4[1];

    var firstColumnToRender = getFirstColumnIndexToRenderRef.current({
      firstColumnIndex: nextRenderContext.firstColumnIndex,
      minColumnIndex: minFirstColumn,
      columnBuffer: rootProps.columnBuffer,
      apiRef: apiRef,
      firstRowToRender: firstRowToRender,
      lastRowToRender: lastRowToRender,
      visibleRows: currentPage.rows
    });
    var lastColumnToRender = Math.min(nextRenderContext.lastColumnIndex + rootProps.columnBuffer, maxLastColumn);
    var renderedColumns = visibleColumns.slice(firstColumnToRender, lastColumnToRender);

    for (var i = 0; i < renderedColumns.length; i += 1) {
      var column = renderedColumns[i];
      var columnIndex = firstColumnToRender + i;
      var isFirstColumn = columnIndex === 0;
      var hasTabbableElement = !(tabIndexState === null && cellTabIndexState === null);
      var tabIndex = tabIndexState !== null && tabIndexState.field === column.field || isFirstColumn && !hasTabbableElement ? 0 : -1;
      var hasFocus = columnHeaderFocus !== null && columnHeaderFocus.field === column.field;
      var open = columnMenuState.open && columnMenuState.field === column.field;
      columns.push( /*#__PURE__*/_jsx(GridColumnHeaderItem, _extends({}, sortColumnLookup[column.field], {
        columnMenuOpen: open,
        filterItemsCounter: filterColumnLookup[column.field] && filterColumnLookup[column.field].length,
        headerHeight: headerHeight,
        isDragging: column.field === dragCol,
        column: column,
        colIndex: columnIndex,
        isResizing: resizeCol === column.field,
        isLastColumn: columnIndex === visibleColumns.length - 1,
        extendRowFullWidth: !rootProps.disableExtendRowFullWidth,
        hasFocus: hasFocus,
        tabIndex: tabIndex
      }, other), column.field));
    }

    return columns;
  };

  var rootStyle = {
    minHeight: headerHeight,
    maxHeight: headerHeight,
    lineHeight: "".concat(headerHeight, "px")
  };
  return {
    renderContext: renderContext,
    getColumns: getColumns,
    isDragging: !!dragCol,
    getRootProps: function getRootProps() {
      var other = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return _extends({
        style: rootStyle
      }, other);
    },
    getInnerProps: function getInnerProps() {
      return {
        ref: handleInnerRef,
        'aria-rowindex': 1,
        role: 'row'
      };
    }
  };
};