import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _extends from "@babel/runtime/helpers/esm/extends";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
var _excluded = ["className", "disableVirtualization"];
import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { unstable_composeClasses as composeClasses } from '@mui/material';
import { useGridSelector, getDataGridUtilityClass, gridClasses, gridVisibleColumnFieldsSelector, gridRowsMetaSelector, useGridApiEventHandler, GridEvents } from '@mui/x-data-grid';
import { GridVirtualScroller, GridVirtualScrollerContent, GridVirtualScrollerRenderZone, useGridVirtualScroller } from '@mui/x-data-grid/internals';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { gridPinnedColumnsSelector, GridPinnedPosition } from '../hooks/features/columnPinning';
import { gridDetailPanelExpandedRowsContentCacheSelector, gridDetailPanelExpandedRowsHeightCacheSelector, gridDetailPanelExpandedRowIdsSelector } from '../hooks/features/detailPanel';
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
export var filterColumns = function filterColumns(pinnedColumns, columns) {
  var _pinnedColumns$left, _pinnedColumns$right;

  if (!Array.isArray(pinnedColumns.left) && !Array.isArray(pinnedColumns.right)) {
    return [[], []];
  }

  if (((_pinnedColumns$left = pinnedColumns.left) == null ? void 0 : _pinnedColumns$left.length) === 0 && ((_pinnedColumns$right = pinnedColumns.right) == null ? void 0 : _pinnedColumns$right.length) === 0) {
    return [[], []];
  }

  var filter = function filter(newPinnedColumns, remainingColumns) {
    if (!Array.isArray(newPinnedColumns)) {
      return [];
    }

    return newPinnedColumns.filter(function (field) {
      return remainingColumns.includes(field);
    });
  };

  var leftPinnedColumns = filter(pinnedColumns.left, columns);
  var columnsWithoutLeftPinnedColumns = columns.filter( // Filter out from the remaining columns those columns already pinned to the left
  function (field) {
    return !leftPinnedColumns.includes(field);
  });
  var rightPinnedColumns = filter(pinnedColumns.right, columnsWithoutLeftPinnedColumns);
  return [leftPinnedColumns, rightPinnedColumns];
};

var useUtilityClasses = function useUtilityClasses(ownerState) {
  var classes = ownerState.classes,
      leftPinnedColumns = ownerState.leftPinnedColumns,
      rightPinnedColumns = ownerState.rightPinnedColumns;
  var slots = {
    leftPinnedColumns: ['pinnedColumns', leftPinnedColumns && leftPinnedColumns.length > 0 && 'pinnedColumns--left'],
    rightPinnedColumns: ['pinnedColumns', rightPinnedColumns && rightPinnedColumns.length > 0 && 'pinnedColumns--right'],
    detailPanels: ['detailPanels'],
    detailPanel: ['detailPanel']
  };
  return composeClasses(slots, getDataGridUtilityClass, classes);
};

// Inspired by https://github.com/material-components/material-components-ios/blob/bca36107405594d5b7b16265a5b0ed698f85a5ee/components/Elevation/src/UIColor%2BMaterialElevation.m#L61
var getOverlayAlpha = function getOverlayAlpha(elevation) {
  var alphaValue;

  if (elevation < 1) {
    alphaValue = 5.11916 * Math.pow(elevation, 2);
  } else {
    alphaValue = 4.5 * Math.log(elevation + 1) + 2;
  }

  return alphaValue / 100;
};

var VirtualScrollerDetailPanels = styled('div', {
  name: 'MuiDataGrid',
  slot: 'DetailPanels',
  overridesResolver: function overridesResolver(props, styles) {
    return styles.detailPanels;
  }
})({});
var VirtualScrollerDetailPanel = styled(Box, {
  name: 'MuiDataGrid',
  slot: 'DetailPanel',
  overridesResolver: function overridesResolver(props, styles) {
    return styles.detailPanel;
  }
})(function (_ref) {
  var theme = _ref.theme;
  return {
    zIndex: 2,
    width: '100%',
    position: 'absolute',
    backgroundColor: theme.palette.background.default
  };
});
var VirtualScrollerPinnedColumns = styled('div', {
  name: 'MuiDataGrid',
  slot: 'PinnedColumns',
  overridesResolver: function overridesResolver(props, styles) {
    return [_defineProperty({}, "&.".concat(gridClasses['pinnedColumns--left']), styles['pinnedColumns--left']), _defineProperty({}, "&.".concat(gridClasses['pinnedColumns--right']), styles['pinnedColumns--right']), styles.pinnedColumns];
  }
})(function (_ref4) {
  var theme = _ref4.theme,
      ownerState = _ref4.ownerState;
  return _extends({
    position: 'sticky',
    overflow: 'hidden',
    zIndex: 1,
    boxShadow: theme.shadows[2],
    backgroundColor: theme.palette.background.default
  }, theme.palette.mode === 'dark' && {
    backgroundImage: "linear-gradient(".concat(alpha('#fff', getOverlayAlpha(2)), ", ").concat(alpha('#fff', getOverlayAlpha(2)), ")")
  }, ownerState.side === GridPinnedPosition.left && {
    left: 0,
    float: 'left'
  }, ownerState.side === GridPinnedPosition.right && {
    right: 0,
    float: 'right'
  });
});
var DataGridProVirtualScroller = /*#__PURE__*/React.forwardRef(function DataGridProVirtualScroller(props, ref) {
  var className = props.className,
      disableVirtualization = props.disableVirtualization,
      other = _objectWithoutProperties(props, _excluded);

  var apiRef = useGridApiContext();
  var rootProps = useGridRootProps();
  var visibleColumnFields = useGridSelector(apiRef, gridVisibleColumnFieldsSelector);
  var expandedRowIds = useGridSelector(apiRef, gridDetailPanelExpandedRowIdsSelector);
  var detailPanelsContent = useGridSelector(apiRef, gridDetailPanelExpandedRowsContentCacheSelector);
  var detailPanelsHeights = useGridSelector(apiRef, gridDetailPanelExpandedRowsHeightCacheSelector);
  var leftColumns = React.useRef(null);
  var rightColumns = React.useRef(null);
  var handleRenderZonePositioning = React.useCallback(function (_ref5) {
    var top = _ref5.top;

    if (leftColumns.current) {
      leftColumns.current.style.transform = "translate3d(0px, ".concat(top, "px, 0px)");
    }

    if (rightColumns.current) {
      rightColumns.current.style.transform = "translate3d(0px, ".concat(top, "px, 0px)");
    }
  }, []);

  var getRowProps = function getRowProps(id) {
    if (!expandedRowIds.includes(id)) {
      return null;
    }

    var height = detailPanelsHeights[id];
    return {
      style: {
        marginBottom: height
      }
    };
  };

  var pinnedColumns = useGridSelector(apiRef, gridPinnedColumnsSelector);

  var _filterColumns = filterColumns(pinnedColumns, visibleColumnFields),
      _filterColumns2 = _slicedToArray(_filterColumns, 2),
      leftPinnedColumns = _filterColumns2[0],
      rightPinnedColumns = _filterColumns2[1];

  var ownerState = {
    classes: rootProps.classes,
    leftPinnedColumns: leftPinnedColumns,
    rightPinnedColumns: rightPinnedColumns
  };
  var classes = useUtilityClasses(ownerState);

  var _useGridVirtualScroll = useGridVirtualScroller(_extends({
    ref: ref,
    renderZoneMinColumnIndex: leftPinnedColumns.length,
    renderZoneMaxColumnIndex: visibleColumnFields.length - rightPinnedColumns.length,
    onRenderZonePositioning: handleRenderZonePositioning,
    getRowProps: getRowProps
  }, props)),
      renderContext = _useGridVirtualScroll.renderContext,
      getRows = _useGridVirtualScroll.getRows,
      getRootProps = _useGridVirtualScroll.getRootProps,
      getContentProps = _useGridVirtualScroll.getContentProps,
      getRenderZoneProps = _useGridVirtualScroll.getRenderZoneProps,
      updateRenderZonePosition = _useGridVirtualScroll.updateRenderZonePosition;

  var refreshRenderZonePosition = React.useCallback(function () {
    if (renderContext) {
      updateRenderZonePosition(renderContext);
    }
  }, [renderContext, updateRenderZonePosition]);
  useGridApiEventHandler(apiRef, GridEvents.columnWidthChange, refreshRenderZonePosition);
  useGridApiEventHandler(apiRef, GridEvents.columnOrderChange, refreshRenderZonePosition);
  var leftRenderContext = renderContext && leftPinnedColumns.length > 0 ? _extends({}, renderContext, {
    firstColumnIndex: 0,
    lastColumnIndex: leftPinnedColumns.length
  }) : null;
  var rightRenderContext = renderContext && rightPinnedColumns.length > 0 ? _extends({}, renderContext, {
    firstColumnIndex: visibleColumnFields.length - rightPinnedColumns.length,
    lastColumnIndex: visibleColumnFields.length
  }) : null;
  var contentProps = getContentProps();
  var pinnedColumnsStyle = {
    minHeight: contentProps.style.minHeight
  };

  var getDetailPanels = function getDetailPanels() {
    var panels = [];

    if (rootProps.getDetailPanelContent == null) {
      return panels;
    }

    var rowsMeta = gridRowsMetaSelector(apiRef.current.state);
    var uniqueExpandedRowIds = Array.from(new Set(_toConsumableArray(expandedRowIds)).values());

    for (var i = 0; i < uniqueExpandedRowIds.length; i += 1) {
      var id = uniqueExpandedRowIds[i];
      var content = detailPanelsContent[id]; // Check if the id exists in the current page

      var rowIndex = apiRef.current.getRowIndexRelativeToVisibleRows(id);
      var exists = rowIndex !== undefined;

      if ( /*#__PURE__*/React.isValidElement(content) && exists) {
        var height = detailPanelsHeights[id];
        var sizes = apiRef.current.unstable_getRowInternalSizes(id);
        var spacingTop = (sizes == null ? void 0 : sizes.spacingTop) || 0;
        var top = rowsMeta.positions[rowIndex] + apiRef.current.unstable_getRowHeight(id) + spacingTop;
        panels.push( /*#__PURE__*/_jsx(VirtualScrollerDetailPanel, {
          style: {
            top: top,
            height: height
          },
          className: classes.detailPanel,
          children: content
        }, i));
      }
    }

    return panels;
  };

  var detailPanels = getDetailPanels();
  return /*#__PURE__*/_jsx(GridVirtualScroller, _extends({}, getRootProps(other), {
    children: /*#__PURE__*/_jsxs(GridVirtualScrollerContent, _extends({}, contentProps, {
      children: [leftRenderContext && /*#__PURE__*/_jsx(VirtualScrollerPinnedColumns, {
        ref: leftColumns,
        className: classes.leftPinnedColumns,
        ownerState: {
          side: GridPinnedPosition.left
        },
        style: pinnedColumnsStyle,
        children: getRows({
          renderContext: leftRenderContext,
          minFirstColumn: leftRenderContext.firstColumnIndex,
          maxLastColumn: leftRenderContext.lastColumnIndex,
          availableSpace: 0
        })
      }), /*#__PURE__*/_jsx(GridVirtualScrollerRenderZone, _extends({}, getRenderZoneProps(), {
        children: getRows({
          renderContext: renderContext
        })
      })), rightRenderContext && /*#__PURE__*/_jsx(VirtualScrollerPinnedColumns, {
        ref: rightColumns,
        ownerState: {
          side: GridPinnedPosition.right
        },
        className: classes.rightPinnedColumns,
        style: pinnedColumnsStyle,
        children: getRows({
          renderContext: rightRenderContext,
          minFirstColumn: rightRenderContext.firstColumnIndex,
          maxLastColumn: rightRenderContext.lastColumnIndex,
          availableSpace: 0
        })
      }), detailPanels.length > 0 && /*#__PURE__*/_jsx(VirtualScrollerDetailPanels, {
        className: classes.detailPanels,
        children: detailPanels
      })]
    }))
  }));
});
export { DataGridProVirtualScroller };