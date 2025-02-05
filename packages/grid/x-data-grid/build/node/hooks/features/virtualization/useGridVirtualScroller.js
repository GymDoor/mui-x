"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getIndexFromScroll = getIndexFromScroll;
exports.useGridVirtualScroller = exports.getRenderableIndexes = void 0;

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var React = _interopRequireWildcard(require("react"));

var ReactDOM = _interopRequireWildcard(require("react-dom"));

var _utils = require("@mui/material/utils");

var _useGridApiContext = require("../../utils/useGridApiContext");

var _useGridRootProps = require("../../utils/useGridRootProps");

var _useGridSelector = require("../../utils/useGridSelector");

var _gridColumnsSelector = require("../columns/gridColumnsSelector");

var _densitySelector = require("../density/densitySelector");

var _gridFocusStateSelector = require("../focus/gridFocusStateSelector");

var _gridEditRowsSelector = require("../editRows/gridEditRowsSelector");

var _useGridVisibleRows = require("../../utils/useGridVisibleRows");

var _events = require("../../../models/events");

var _useGridApiEventHandler = require("../../utils/useGridApiEventHandler");

var _utils2 = require("../../../utils/utils");

var _gridSelectionSelector = require("../selection/gridSelectionSelector");

var _gridRowsMetaSelector = require("../rows/gridRowsMetaSelector");

var _gridColumnsUtils = require("../columns/gridColumnsUtils");

var _jsxRuntime = require("react/jsx-runtime");

const _excluded = ["style"];

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// Uses binary search to avoid looping through all possible positions
function getIndexFromScroll(offset, positions, sliceStart = 0, sliceEnd = positions.length) {
  if (positions.length <= 0) {
    return -1;
  }

  if (sliceStart >= sliceEnd) {
    return sliceStart;
  }

  const pivot = sliceStart + Math.floor((sliceEnd - sliceStart) / 2);
  const itemOffset = positions[pivot];
  return offset <= itemOffset ? getIndexFromScroll(offset, positions, sliceStart, pivot) : getIndexFromScroll(offset, positions, pivot + 1, sliceEnd);
}

const getRenderableIndexes = ({
  firstIndex,
  lastIndex,
  buffer,
  minFirstIndex,
  maxLastIndex
}) => {
  return [(0, _utils2.clamp)(firstIndex - buffer, minFirstIndex, maxLastIndex), (0, _utils2.clamp)(lastIndex + buffer, minFirstIndex, maxLastIndex)];
};

exports.getRenderableIndexes = getRenderableIndexes;

const useGridVirtualScroller = props => {
  const apiRef = (0, _useGridApiContext.useGridApiContext)();
  const rootProps = (0, _useGridRootProps.useGridRootProps)();
  const visibleColumns = (0, _useGridSelector.useGridSelector)(apiRef, _gridColumnsSelector.gridVisibleColumnDefinitionsSelector);
  const {
    ref,
    disableVirtualization,
    onRenderZonePositioning,
    renderZoneMinColumnIndex = 0,
    renderZoneMaxColumnIndex = visibleColumns.length,
    getRowProps
  } = props;
  const columnPositions = (0, _useGridSelector.useGridSelector)(apiRef, _gridColumnsSelector.gridColumnPositionsSelector);
  const columnsTotalWidth = (0, _useGridSelector.useGridSelector)(apiRef, _gridColumnsSelector.gridColumnsTotalWidthSelector);
  const rowHeight = (0, _useGridSelector.useGridSelector)(apiRef, _densitySelector.gridDensityRowHeightSelector);
  const cellFocus = (0, _useGridSelector.useGridSelector)(apiRef, _gridFocusStateSelector.gridFocusCellSelector);
  const cellTabIndex = (0, _useGridSelector.useGridSelector)(apiRef, _gridFocusStateSelector.gridTabIndexCellSelector);
  const rowsMeta = (0, _useGridSelector.useGridSelector)(apiRef, _gridRowsMetaSelector.gridRowsMetaSelector);
  const editRowsState = (0, _useGridSelector.useGridSelector)(apiRef, _gridEditRowsSelector.gridEditRowsStateSelector);
  const selectedRowsLookup = (0, _useGridSelector.useGridSelector)(apiRef, _gridSelectionSelector.selectedIdsLookupSelector);
  const currentPage = (0, _useGridVisibleRows.useGridVisibleRows)(apiRef, rootProps);
  const renderZoneRef = React.useRef(null);
  const rootRef = React.useRef(null);
  const handleRef = (0, _utils.useForkRef)(ref, rootRef);
  const [renderContext, setRenderContext] = React.useState(null);
  const prevRenderContext = React.useRef(renderContext);
  const scrollPosition = React.useRef({
    top: 0,
    left: 0
  });
  const [containerWidth, setContainerWidth] = React.useState(null);
  const prevTotalWidth = React.useRef(columnsTotalWidth);
  const computeRenderContext = React.useCallback(() => {
    if (disableVirtualization) {
      return {
        firstRowIndex: 0,
        lastRowIndex: currentPage.rows.length,
        firstColumnIndex: 0,
        lastColumnIndex: visibleColumns.length
      };
    }

    const {
      top,
      left
    } = scrollPosition.current;
    const firstRowIndex = getIndexFromScroll(top, rowsMeta.positions);
    const lastRowIndex = rootProps.autoHeight ? firstRowIndex + currentPage.rows.length : getIndexFromScroll(top + rootRef.current.clientHeight, rowsMeta.positions);
    const firstColumnIndex = getIndexFromScroll(left, columnPositions);
    const lastColumnIndex = getIndexFromScroll(left + containerWidth, columnPositions);
    return {
      firstRowIndex,
      lastRowIndex,
      firstColumnIndex,
      lastColumnIndex
    };
  }, [disableVirtualization, rowsMeta.positions, rootProps.autoHeight, currentPage.rows.length, columnPositions, containerWidth, visibleColumns.length]);
  React.useEffect(() => {
    if (disableVirtualization) {
      renderZoneRef.current.style.transform = `translate3d(0px, 0px, 0px)`;
    } else {
      // TODO a scroll reset should not be necessary
      rootRef.current.scrollLeft = 0;
      rootRef.current.scrollTop = 0;
    }
  }, [disableVirtualization]);
  React.useEffect(() => {
    setContainerWidth(rootRef.current.clientWidth);
  }, [rowsMeta.currentPageTotalHeight]);
  const handleResize = React.useCallback(() => {
    if (rootRef.current) {
      setContainerWidth(rootRef.current.clientWidth);
    }
  }, []);
  (0, _useGridApiEventHandler.useGridApiEventHandler)(apiRef, _events.GridEvents.resize, handleResize);
  const updateRenderZonePosition = React.useCallback(nextRenderContext => {
    const [firstRowToRender, lastRowToRender] = getRenderableIndexes({
      firstIndex: nextRenderContext.firstRowIndex,
      lastIndex: nextRenderContext.lastRowIndex,
      minFirstIndex: 0,
      maxLastIndex: currentPage.rows.length,
      buffer: rootProps.rowBuffer
    });
    const [initialFirstColumnToRender] = getRenderableIndexes({
      firstIndex: nextRenderContext.firstColumnIndex,
      lastIndex: nextRenderContext.lastColumnIndex,
      minFirstIndex: renderZoneMinColumnIndex,
      maxLastIndex: renderZoneMaxColumnIndex,
      buffer: rootProps.columnBuffer
    });
    const firstColumnToRender = (0, _gridColumnsUtils.getFirstNonSpannedColumnToRender)({
      firstColumnToRender: initialFirstColumnToRender,
      apiRef,
      firstRowToRender,
      lastRowToRender,
      visibleRows: currentPage.rows
    });
    const top = (0, _gridRowsMetaSelector.gridRowsMetaSelector)(apiRef.current.state).positions[firstRowToRender];
    const left = (0, _gridColumnsSelector.gridColumnPositionsSelector)(apiRef)[firstColumnToRender]; // Call directly the selector because it might be outdated when this method is called

    renderZoneRef.current.style.transform = `translate3d(${left}px, ${top}px, 0px)`;

    if (typeof onRenderZonePositioning === 'function') {
      onRenderZonePositioning({
        top,
        left
      });
    }
  }, [apiRef, currentPage.rows, onRenderZonePositioning, renderZoneMinColumnIndex, renderZoneMaxColumnIndex, rootProps.columnBuffer, rootProps.rowBuffer]);
  React.useLayoutEffect(() => {
    if (renderContext) {
      updateRenderZonePosition(renderContext);
    }
  }, [renderContext, updateRenderZonePosition]);
  const updateRenderContext = React.useCallback(nextRenderContext => {
    setRenderContext(nextRenderContext);
    prevRenderContext.current = nextRenderContext;
  }, [setRenderContext, prevRenderContext]);
  React.useEffect(() => {
    if (containerWidth == null) {
      return;
    }

    const initialRenderContext = computeRenderContext();
    updateRenderContext(initialRenderContext);
    const {
      top,
      left
    } = scrollPosition.current;
    const params = {
      top,
      left,
      renderContext: initialRenderContext
    };
    apiRef.current.publishEvent(_events.GridEvents.rowsScroll, params);
  }, [apiRef, computeRenderContext, containerWidth, updateRenderContext]);

  const handleScroll = event => {
    const {
      scrollTop,
      scrollLeft
    } = event.currentTarget;
    scrollPosition.current.top = scrollTop;
    scrollPosition.current.left = scrollLeft; // On iOS and macOS, negative offsets are possible when swiping past the start

    if (scrollLeft < 0 || scrollTop < 0 || !prevRenderContext.current) {
      return;
    } // When virtualization is disabled, the context never changes during scroll


    const nextRenderContext = disableVirtualization ? prevRenderContext.current : computeRenderContext();
    const topRowsScrolledSincePreviousRender = Math.abs(nextRenderContext.firstRowIndex - prevRenderContext.current.firstRowIndex);
    const bottomRowsScrolledSincePreviousRender = Math.abs(nextRenderContext.lastRowIndex - prevRenderContext.current.lastRowIndex);
    const topColumnsScrolledSincePreviousRender = Math.abs(nextRenderContext.firstColumnIndex - prevRenderContext.current.firstColumnIndex);
    const bottomColumnsScrolledSincePreviousRender = Math.abs(nextRenderContext.lastColumnIndex - prevRenderContext.current.lastColumnIndex);
    const shouldSetState = topRowsScrolledSincePreviousRender >= rootProps.rowThreshold || bottomRowsScrolledSincePreviousRender >= rootProps.rowThreshold || topColumnsScrolledSincePreviousRender >= rootProps.columnThreshold || bottomColumnsScrolledSincePreviousRender >= rootProps.columnThreshold || prevTotalWidth.current !== columnsTotalWidth; // TODO v6: rename event to a wider name, it's not only fired for row scrolling

    apiRef.current.publishEvent(_events.GridEvents.rowsScroll, {
      top: scrollTop,
      left: scrollLeft,
      renderContext: shouldSetState ? nextRenderContext : prevRenderContext.current
    }, event);

    if (shouldSetState) {
      // Prevents batching render context changes
      ReactDOM.flushSync(() => {
        updateRenderContext(nextRenderContext);
      });
      prevTotalWidth.current = columnsTotalWidth;
    }
  };

  const getRows = (params = {
    renderContext
  }) => {
    const {
      renderContext: nextRenderContext,
      minFirstColumn = renderZoneMinColumnIndex,
      maxLastColumn = renderZoneMaxColumnIndex,
      availableSpace = containerWidth
    } = params;

    if (!currentPage.range || !nextRenderContext || availableSpace == null) {
      return null;
    }

    const rowBuffer = !disableVirtualization ? rootProps.rowBuffer : 0;
    const columnBuffer = !disableVirtualization ? rootProps.columnBuffer : 0;
    const [firstRowToRender, lastRowToRender] = getRenderableIndexes({
      firstIndex: nextRenderContext.firstRowIndex,
      lastIndex: nextRenderContext.lastRowIndex,
      minFirstIndex: 0,
      maxLastIndex: currentPage.rows.length,
      buffer: rowBuffer
    });
    const renderedRows = [];

    for (let i = firstRowToRender; i < lastRowToRender; i += 1) {
      const row = currentPage.rows[i];
      renderedRows.push(row);
      apiRef.current.unstable_calculateColSpan({
        rowId: row.id,
        minFirstColumn,
        maxLastColumn
      });
    }

    const [initialFirstColumnToRender, lastColumnToRender] = getRenderableIndexes({
      firstIndex: nextRenderContext.firstColumnIndex,
      lastIndex: nextRenderContext.lastColumnIndex,
      minFirstIndex: minFirstColumn,
      maxLastIndex: maxLastColumn,
      buffer: columnBuffer
    });
    const firstColumnToRender = (0, _gridColumnsUtils.getFirstNonSpannedColumnToRender)({
      firstColumnToRender: initialFirstColumnToRender,
      apiRef,
      firstRowToRender,
      lastRowToRender,
      visibleRows: currentPage.rows
    });
    const renderedColumns = visibleColumns.slice(firstColumnToRender, lastColumnToRender);
    const rows = [];

    for (let i = 0; i < renderedRows.length; i += 1) {
      var _rootProps$components;

      const {
        id,
        model
      } = renderedRows[i];
      const lastVisibleRowIndex = firstRowToRender + i === currentPage.rows.length - 1;
      const targetRowHeight = apiRef.current.unstable_getRowHeight(id);
      let isSelected;

      if (selectedRowsLookup[id] == null) {
        isSelected = false;
      } else if (typeof rootProps.isRowSelectable === 'function') {
        isSelected = rootProps.isRowSelectable(apiRef.current.getRowParams(id));
      } else {
        isSelected = true;
      }

      rows.push( /*#__PURE__*/(0, _jsxRuntime.jsx)(rootProps.components.Row, (0, _extends2.default)({
        row: model,
        rowId: id,
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
        index: currentPage.range.firstRowIndex + firstRowToRender + i,
        containerWidth: availableSpace,
        isLastVisible: lastVisibleRowIndex
      }, typeof getRowProps === 'function' ? getRowProps(id, model) : {}, (_rootProps$components = rootProps.componentsProps) == null ? void 0 : _rootProps$components.row), id));
    }

    return rows;
  };

  const needsHorizontalScrollbar = containerWidth && columnsTotalWidth > containerWidth;
  const contentSize = React.useMemo(() => {
    // In cases where the columns exceed the available width,
    // the horizontal scrollbar should be shown even when there're no rows.
    // Keeping 1px as minimum height ensures that the scrollbar will visible if necessary.
    const height = Math.max(rowsMeta.currentPageTotalHeight, 1);
    let shouldExtendContent = false;

    if (rootRef != null && rootRef.current && height <= (rootRef == null ? void 0 : rootRef.current.clientHeight)) {
      shouldExtendContent = true;
    }

    const size = {
      width: needsHorizontalScrollbar ? columnsTotalWidth : 'auto',
      height,
      minHeight: shouldExtendContent ? '100%' : 'auto'
    };

    if (rootProps.autoHeight && currentPage.rows.length === 0) {
      size.height = 2 * rowHeight; // Give room to show the overlay when there's no row.
    }

    return size;
  }, [rootRef, columnsTotalWidth, rowsMeta.currentPageTotalHeight, currentPage.rows.length, needsHorizontalScrollbar, rootProps.autoHeight, rowHeight]);
  React.useEffect(() => {
    apiRef.current.publishEvent(_events.GridEvents.virtualScrollerContentSizeChange);
  }, [apiRef, contentSize]);

  if (rootProps.autoHeight && currentPage.rows.length === 0) {
    contentSize.height = 2 * rowHeight; // Give room to show the overlay when there no rows.
  }

  const rootStyle = {};

  if (!needsHorizontalScrollbar) {
    rootStyle.overflowX = 'hidden';
  }

  const getRenderContext = React.useCallback(() => {
    return prevRenderContext.current;
  }, []);
  apiRef.current.unstable_getRenderContext = getRenderContext;
  return {
    renderContext,
    updateRenderZonePosition,
    getRows,
    getRootProps: (_ref = {}) => {
      let {
        style = {}
      } = _ref,
          other = (0, _objectWithoutPropertiesLoose2.default)(_ref, _excluded);
      return (0, _extends2.default)({
        ref: handleRef,
        onScroll: handleScroll,
        style: (0, _extends2.default)({}, style, rootStyle)
      }, other);
    },
    getContentProps: ({
      style = {}
    } = {}) => ({
      style: (0, _extends2.default)({}, style, contentSize)
    }),
    getRenderZoneProps: () => ({
      ref: renderZoneRef
    })
  };
};

exports.useGridVirtualScroller = useGridVirtualScroller;