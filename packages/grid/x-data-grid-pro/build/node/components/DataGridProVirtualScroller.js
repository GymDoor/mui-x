"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filterColumns = exports.DataGridProVirtualScroller = void 0;

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var React = _interopRequireWildcard(require("react"));

var _styles = require("@mui/material/styles");

var _Box = _interopRequireDefault(require("@mui/material/Box"));

var _material = require("@mui/material");

var _xDataGrid = require("@mui/x-data-grid");

var _internals = require("@mui/x-data-grid/internals");

var _useGridApiContext = require("../hooks/utils/useGridApiContext");

var _useGridRootProps = require("../hooks/utils/useGridRootProps");

var _columnPinning = require("../hooks/features/columnPinning");

var _detailPanel = require("../hooks/features/detailPanel");

var _jsxRuntime = require("react/jsx-runtime");

const _excluded = ["className", "disableVirtualization"];

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const filterColumns = (pinnedColumns, columns) => {
  var _pinnedColumns$left, _pinnedColumns$right;

  if (!Array.isArray(pinnedColumns.left) && !Array.isArray(pinnedColumns.right)) {
    return [[], []];
  }

  if (((_pinnedColumns$left = pinnedColumns.left) == null ? void 0 : _pinnedColumns$left.length) === 0 && ((_pinnedColumns$right = pinnedColumns.right) == null ? void 0 : _pinnedColumns$right.length) === 0) {
    return [[], []];
  }

  const filter = (newPinnedColumns, remainingColumns) => {
    if (!Array.isArray(newPinnedColumns)) {
      return [];
    }

    return newPinnedColumns.filter(field => remainingColumns.includes(field));
  };

  const leftPinnedColumns = filter(pinnedColumns.left, columns);
  const columnsWithoutLeftPinnedColumns = columns.filter( // Filter out from the remaining columns those columns already pinned to the left
  field => !leftPinnedColumns.includes(field));
  const rightPinnedColumns = filter(pinnedColumns.right, columnsWithoutLeftPinnedColumns);
  return [leftPinnedColumns, rightPinnedColumns];
};

exports.filterColumns = filterColumns;

const useUtilityClasses = ownerState => {
  const {
    classes,
    leftPinnedColumns,
    rightPinnedColumns
  } = ownerState;
  const slots = {
    leftPinnedColumns: ['pinnedColumns', leftPinnedColumns && leftPinnedColumns.length > 0 && 'pinnedColumns--left'],
    rightPinnedColumns: ['pinnedColumns', rightPinnedColumns && rightPinnedColumns.length > 0 && 'pinnedColumns--right'],
    detailPanels: ['detailPanels'],
    detailPanel: ['detailPanel']
  };
  return (0, _material.unstable_composeClasses)(slots, _xDataGrid.getDataGridUtilityClass, classes);
};

// Inspired by https://github.com/material-components/material-components-ios/blob/bca36107405594d5b7b16265a5b0ed698f85a5ee/components/Elevation/src/UIColor%2BMaterialElevation.m#L61
const getOverlayAlpha = elevation => {
  let alphaValue;

  if (elevation < 1) {
    alphaValue = 5.11916 * elevation ** 2;
  } else {
    alphaValue = 4.5 * Math.log(elevation + 1) + 2;
  }

  return alphaValue / 100;
};

const VirtualScrollerDetailPanels = (0, _styles.styled)('div', {
  name: 'MuiDataGrid',
  slot: 'DetailPanels',
  overridesResolver: (props, styles) => styles.detailPanels
})({});
const VirtualScrollerDetailPanel = (0, _styles.styled)(_Box.default, {
  name: 'MuiDataGrid',
  slot: 'DetailPanel',
  overridesResolver: (props, styles) => styles.detailPanel
})(({
  theme
}) => ({
  zIndex: 2,
  width: '100%',
  position: 'absolute',
  backgroundColor: theme.palette.background.default
}));
const VirtualScrollerPinnedColumns = (0, _styles.styled)('div', {
  name: 'MuiDataGrid',
  slot: 'PinnedColumns',
  overridesResolver: (props, styles) => [{
    [`&.${_xDataGrid.gridClasses['pinnedColumns--left']}`]: styles['pinnedColumns--left']
  }, {
    [`&.${_xDataGrid.gridClasses['pinnedColumns--right']}`]: styles['pinnedColumns--right']
  }, styles.pinnedColumns]
})(({
  theme,
  ownerState
}) => (0, _extends2.default)({
  position: 'sticky',
  overflow: 'hidden',
  zIndex: 1,
  boxShadow: theme.shadows[2],
  backgroundColor: theme.palette.background.default
}, theme.palette.mode === 'dark' && {
  backgroundImage: `linear-gradient(${(0, _styles.alpha)('#fff', getOverlayAlpha(2))}, ${(0, _styles.alpha)('#fff', getOverlayAlpha(2))})`
}, ownerState.side === _columnPinning.GridPinnedPosition.left && {
  left: 0,
  float: 'left'
}, ownerState.side === _columnPinning.GridPinnedPosition.right && {
  right: 0,
  float: 'right'
}));
const DataGridProVirtualScroller = /*#__PURE__*/React.forwardRef(function DataGridProVirtualScroller(props, ref) {
  const other = (0, _objectWithoutPropertiesLoose2.default)(props, _excluded);
  const apiRef = (0, _useGridApiContext.useGridApiContext)();
  const rootProps = (0, _useGridRootProps.useGridRootProps)();
  const visibleColumnFields = (0, _xDataGrid.useGridSelector)(apiRef, _xDataGrid.gridVisibleColumnFieldsSelector);
  const expandedRowIds = (0, _xDataGrid.useGridSelector)(apiRef, _detailPanel.gridDetailPanelExpandedRowIdsSelector);
  const detailPanelsContent = (0, _xDataGrid.useGridSelector)(apiRef, _detailPanel.gridDetailPanelExpandedRowsContentCacheSelector);
  const detailPanelsHeights = (0, _xDataGrid.useGridSelector)(apiRef, _detailPanel.gridDetailPanelExpandedRowsHeightCacheSelector);
  const leftColumns = React.useRef(null);
  const rightColumns = React.useRef(null);
  const handleRenderZonePositioning = React.useCallback(({
    top
  }) => {
    if (leftColumns.current) {
      leftColumns.current.style.transform = `translate3d(0px, ${top}px, 0px)`;
    }

    if (rightColumns.current) {
      rightColumns.current.style.transform = `translate3d(0px, ${top}px, 0px)`;
    }
  }, []);

  const getRowProps = id => {
    if (!expandedRowIds.includes(id)) {
      return null;
    }

    const height = detailPanelsHeights[id];
    return {
      style: {
        marginBottom: height
      }
    };
  };

  const pinnedColumns = (0, _xDataGrid.useGridSelector)(apiRef, _columnPinning.gridPinnedColumnsSelector);
  const [leftPinnedColumns, rightPinnedColumns] = filterColumns(pinnedColumns, visibleColumnFields);
  const ownerState = {
    classes: rootProps.classes,
    leftPinnedColumns,
    rightPinnedColumns
  };
  const classes = useUtilityClasses(ownerState);
  const {
    renderContext,
    getRows,
    getRootProps,
    getContentProps,
    getRenderZoneProps,
    updateRenderZonePosition
  } = (0, _internals.useGridVirtualScroller)((0, _extends2.default)({
    ref,
    renderZoneMinColumnIndex: leftPinnedColumns.length,
    renderZoneMaxColumnIndex: visibleColumnFields.length - rightPinnedColumns.length,
    onRenderZonePositioning: handleRenderZonePositioning,
    getRowProps
  }, props));
  const refreshRenderZonePosition = React.useCallback(() => {
    if (renderContext) {
      updateRenderZonePosition(renderContext);
    }
  }, [renderContext, updateRenderZonePosition]);
  (0, _xDataGrid.useGridApiEventHandler)(apiRef, _xDataGrid.GridEvents.columnWidthChange, refreshRenderZonePosition);
  (0, _xDataGrid.useGridApiEventHandler)(apiRef, _xDataGrid.GridEvents.columnOrderChange, refreshRenderZonePosition);
  const leftRenderContext = renderContext && leftPinnedColumns.length > 0 ? (0, _extends2.default)({}, renderContext, {
    firstColumnIndex: 0,
    lastColumnIndex: leftPinnedColumns.length
  }) : null;
  const rightRenderContext = renderContext && rightPinnedColumns.length > 0 ? (0, _extends2.default)({}, renderContext, {
    firstColumnIndex: visibleColumnFields.length - rightPinnedColumns.length,
    lastColumnIndex: visibleColumnFields.length
  }) : null;
  const contentProps = getContentProps();
  const pinnedColumnsStyle = {
    minHeight: contentProps.style.minHeight
  };

  const getDetailPanels = () => {
    const panels = [];

    if (rootProps.getDetailPanelContent == null) {
      return panels;
    }

    const rowsMeta = (0, _xDataGrid.gridRowsMetaSelector)(apiRef.current.state);
    const uniqueExpandedRowIds = Array.from(new Set([...expandedRowIds]).values());

    for (let i = 0; i < uniqueExpandedRowIds.length; i += 1) {
      const id = uniqueExpandedRowIds[i];
      const content = detailPanelsContent[id]; // Check if the id exists in the current page

      const rowIndex = apiRef.current.getRowIndexRelativeToVisibleRows(id);
      const exists = rowIndex !== undefined;

      if ( /*#__PURE__*/React.isValidElement(content) && exists) {
        const height = detailPanelsHeights[id];
        const sizes = apiRef.current.unstable_getRowInternalSizes(id);
        const spacingTop = (sizes == null ? void 0 : sizes.spacingTop) || 0;
        const top = rowsMeta.positions[rowIndex] + apiRef.current.unstable_getRowHeight(id) + spacingTop;
        panels.push( /*#__PURE__*/(0, _jsxRuntime.jsx)(VirtualScrollerDetailPanel, {
          style: {
            top,
            height
          },
          className: classes.detailPanel,
          children: content
        }, i));
      }
    }

    return panels;
  };

  const detailPanels = getDetailPanels();
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_internals.GridVirtualScroller, (0, _extends2.default)({}, getRootProps(other), {
    children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_internals.GridVirtualScrollerContent, (0, _extends2.default)({}, contentProps, {
      children: [leftRenderContext && /*#__PURE__*/(0, _jsxRuntime.jsx)(VirtualScrollerPinnedColumns, {
        ref: leftColumns,
        className: classes.leftPinnedColumns,
        ownerState: {
          side: _columnPinning.GridPinnedPosition.left
        },
        style: pinnedColumnsStyle,
        children: getRows({
          renderContext: leftRenderContext,
          minFirstColumn: leftRenderContext.firstColumnIndex,
          maxLastColumn: leftRenderContext.lastColumnIndex,
          availableSpace: 0
        })
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_internals.GridVirtualScrollerRenderZone, (0, _extends2.default)({}, getRenderZoneProps(), {
        children: getRows({
          renderContext
        })
      })), rightRenderContext && /*#__PURE__*/(0, _jsxRuntime.jsx)(VirtualScrollerPinnedColumns, {
        ref: rightColumns,
        ownerState: {
          side: _columnPinning.GridPinnedPosition.right
        },
        className: classes.rightPinnedColumns,
        style: pinnedColumnsStyle,
        children: getRows({
          renderContext: rightRenderContext,
          minFirstColumn: rightRenderContext.firstColumnIndex,
          maxLastColumn: rightRenderContext.lastColumnIndex,
          availableSpace: 0
        })
      }), detailPanels.length > 0 && /*#__PURE__*/(0, _jsxRuntime.jsx)(VirtualScrollerDetailPanels, {
        className: classes.detailPanels,
        children: detailPanels
      })]
    }))
  }));
});
exports.DataGridProVirtualScroller = DataGridProVirtualScroller;