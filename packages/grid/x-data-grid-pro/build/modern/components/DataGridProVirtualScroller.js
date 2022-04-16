import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import _extends from "@babel/runtime/helpers/esm/extends";
const _excluded = ["className", "disableVirtualization"];
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
export const filterColumns = (pinnedColumns, columns) => {
  if (!Array.isArray(pinnedColumns.left) && !Array.isArray(pinnedColumns.right)) {
    return [[], []];
  }

  if (pinnedColumns.left?.length === 0 && pinnedColumns.right?.length === 0) {
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
  return composeClasses(slots, getDataGridUtilityClass, classes);
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

const VirtualScrollerDetailPanels = styled('div', {
  name: 'MuiDataGrid',
  slot: 'DetailPanels',
  overridesResolver: (props, styles) => styles.detailPanels
})({});
const VirtualScrollerDetailPanel = styled(Box, {
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
const VirtualScrollerPinnedColumns = styled('div', {
  name: 'MuiDataGrid',
  slot: 'PinnedColumns',
  overridesResolver: (props, styles) => [{
    [`&.${gridClasses['pinnedColumns--left']}`]: styles['pinnedColumns--left']
  }, {
    [`&.${gridClasses['pinnedColumns--right']}`]: styles['pinnedColumns--right']
  }, styles.pinnedColumns]
})(({
  theme,
  ownerState
}) => _extends({
  position: 'sticky',
  overflow: 'hidden',
  zIndex: 1,
  boxShadow: theme.shadows[2],
  backgroundColor: theme.palette.background.default
}, theme.palette.mode === 'dark' && {
  backgroundImage: `linear-gradient(${alpha('#fff', getOverlayAlpha(2))}, ${alpha('#fff', getOverlayAlpha(2))})`
}, ownerState.side === GridPinnedPosition.left && {
  left: 0,
  float: 'left'
}, ownerState.side === GridPinnedPosition.right && {
  right: 0,
  float: 'right'
}));
const DataGridProVirtualScroller = /*#__PURE__*/React.forwardRef(function DataGridProVirtualScroller(props, ref) {
  const other = _objectWithoutPropertiesLoose(props, _excluded);

  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const visibleColumnFields = useGridSelector(apiRef, gridVisibleColumnFieldsSelector);
  const expandedRowIds = useGridSelector(apiRef, gridDetailPanelExpandedRowIdsSelector);
  const detailPanelsContent = useGridSelector(apiRef, gridDetailPanelExpandedRowsContentCacheSelector);
  const detailPanelsHeights = useGridSelector(apiRef, gridDetailPanelExpandedRowsHeightCacheSelector);
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

  const pinnedColumns = useGridSelector(apiRef, gridPinnedColumnsSelector);
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
  } = useGridVirtualScroller(_extends({
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
  useGridApiEventHandler(apiRef, GridEvents.columnWidthChange, refreshRenderZonePosition);
  useGridApiEventHandler(apiRef, GridEvents.columnOrderChange, refreshRenderZonePosition);
  const leftRenderContext = renderContext && leftPinnedColumns.length > 0 ? _extends({}, renderContext, {
    firstColumnIndex: 0,
    lastColumnIndex: leftPinnedColumns.length
  }) : null;
  const rightRenderContext = renderContext && rightPinnedColumns.length > 0 ? _extends({}, renderContext, {
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

    const rowsMeta = gridRowsMetaSelector(apiRef.current.state);
    const uniqueExpandedRowIds = Array.from(new Set([...expandedRowIds]).values());

    for (let i = 0; i < uniqueExpandedRowIds.length; i += 1) {
      const id = uniqueExpandedRowIds[i];
      const content = detailPanelsContent[id]; // Check if the id exists in the current page

      const rowIndex = apiRef.current.getRowIndexRelativeToVisibleRows(id);
      const exists = rowIndex !== undefined;

      if ( /*#__PURE__*/React.isValidElement(content) && exists) {
        const height = detailPanelsHeights[id];
        const sizes = apiRef.current.unstable_getRowInternalSizes(id);
        const spacingTop = sizes?.spacingTop || 0;
        const top = rowsMeta.positions[rowIndex] + apiRef.current.unstable_getRowHeight(id) + spacingTop;
        panels.push( /*#__PURE__*/_jsx(VirtualScrollerDetailPanel, {
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
          renderContext
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