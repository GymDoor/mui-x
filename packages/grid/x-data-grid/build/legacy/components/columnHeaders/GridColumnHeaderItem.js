import _extends from "@babel/runtime/helpers/esm/extends";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { unstable_composeClasses as composeClasses } from '@mui/material';
import { unstable_useId as useId } from '@mui/material/utils';
import { GridEvents } from '../../models/events';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { GridColumnHeaderSortIcon } from './GridColumnHeaderSortIcon';
import { GridColumnHeaderTitle } from './GridColumnHeaderTitle';
import { GridColumnHeaderSeparator } from './GridColumnHeaderSeparator';
import { ColumnHeaderMenuIcon } from './ColumnHeaderMenuIcon';
import { GridColumnHeaderMenu } from '../menu/columnMenu/GridColumnHeaderMenu';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";

var useUtilityClasses = function useUtilityClasses(ownerState) {
  var column = ownerState.column,
      classes = ownerState.classes,
      isDragging = ownerState.isDragging,
      sortDirection = ownerState.sortDirection,
      showRightBorder = ownerState.showRightBorder,
      filterItemsCounter = ownerState.filterItemsCounter;
  var isColumnSorted = sortDirection != null;
  var isColumnFiltered = filterItemsCounter != null && filterItemsCounter > 0; // todo refactor to a prop on col isNumeric or ?? ie: coltype===price wont work

  var isColumnNumeric = column.type === 'number';
  var slots = {
    root: ['columnHeader', column.headerAlign === 'left' && 'columnHeader--alignLeft', column.headerAlign === 'center' && 'columnHeader--alignCenter', column.headerAlign === 'right' && 'columnHeader--alignRight', column.sortable && 'columnHeader--sortable', isDragging && 'columnHeader--moving', isColumnSorted && 'columnHeader--sorted', isColumnFiltered && 'columnHeader--filtered', isColumnNumeric && 'columnHeader--numeric', showRightBorder && 'withBorder'],
    draggableContainer: ['columnHeaderDraggableContainer'],
    titleContainer: ['columnHeaderTitleContainer'],
    titleContainerContent: ['columnHeaderTitleContainerContent']
  };
  return composeClasses(slots, getDataGridUtilityClass, classes);
};

function GridColumnHeaderItem(props) {
  var _apiRef$current$getRo, _column$sortingOrder, _rootProps$components, _column$headerName, _rootProps$components2;

  var column = props.column,
      columnMenuOpen = props.columnMenuOpen,
      colIndex = props.colIndex,
      headerHeight = props.headerHeight,
      isResizing = props.isResizing,
      isLastColumn = props.isLastColumn,
      sortDirection = props.sortDirection,
      sortIndex = props.sortIndex,
      filterItemsCounter = props.filterItemsCounter,
      hasFocus = props.hasFocus,
      tabIndex = props.tabIndex,
      extendRowFullWidth = props.extendRowFullWidth,
      disableReorder = props.disableReorder,
      separatorSide = props.separatorSide;
  var apiRef = useGridApiContext();
  var rootProps = useGridRootProps();
  var headerCellRef = React.useRef(null);
  var columnMenuId = useId();
  var columnMenuButtonId = useId();
  var iconButtonRef = React.useRef(null);

  var _React$useState = React.useState(columnMenuOpen),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      showColumnMenuIcon = _React$useState2[0],
      setShowColumnMenuIcon = _React$useState2[1];

  var _ref = (_apiRef$current$getRo = apiRef.current.getRootDimensions()) != null ? _apiRef$current$getRo : {
    hasScrollX: false,
    hasScrollY: false
  },
      hasScrollX = _ref.hasScrollX,
      hasScrollY = _ref.hasScrollY;

  var headerComponent = null;

  if (column.renderHeader) {
    headerComponent = column.renderHeader(apiRef.current.getColumnHeaderParams(column.field));
  }

  var publish = React.useCallback(function (eventName) {
    return function (event) {
      // Ignore portal
      // See https://github.com/mui/mui-x/issues/1721
      if (!event.currentTarget.contains(event.target)) {
        return;
      }

      apiRef.current.publishEvent(eventName, apiRef.current.getColumnHeaderParams(column.field), event);
    };
  }, [apiRef, column.field]);
  var mouseEventsHandlers = {
    onClick: publish(GridEvents.columnHeaderClick),
    onDoubleClick: publish(GridEvents.columnHeaderDoubleClick),
    onMouseOver: publish(GridEvents.columnHeaderOver),
    // TODO remove as it's not used
    onMouseOut: publish(GridEvents.columnHeaderOut),
    // TODO remove as it's not used
    onMouseEnter: publish(GridEvents.columnHeaderEnter),
    // TODO remove as it's not used
    onMouseLeave: publish(GridEvents.columnHeaderLeave),
    // TODO remove as it's not used
    onKeyDown: publish(GridEvents.columnHeaderKeyDown),
    onFocus: publish(GridEvents.columnHeaderFocus),
    onBlur: publish(GridEvents.columnHeaderBlur)
  };
  var draggableEventHandlers = {
    onDragStart: publish(GridEvents.columnHeaderDragStart),
    onDragEnter: publish(GridEvents.columnHeaderDragEnter),
    onDragOver: publish(GridEvents.columnHeaderDragOver),
    onDragEnd: publish(GridEvents.columnHeaderDragEnd)
  };
  var removeLastBorderRight = isLastColumn && hasScrollX && !hasScrollY;
  var showRightBorder = !isLastColumn ? rootProps.showColumnRightBorder : !removeLastBorderRight && !extendRowFullWidth;

  var ownerState = _extends({}, props, {
    classes: rootProps.classes,
    showRightBorder: showRightBorder
  });

  var classes = useUtilityClasses(ownerState);
  var width = column.computedWidth;
  var ariaSort;

  if (sortDirection != null) {
    ariaSort = sortDirection === 'asc' ? 'ascending' : 'descending';
  }

  React.useEffect(function () {
    if (!showColumnMenuIcon) {
      setShowColumnMenuIcon(columnMenuOpen);
    }
  }, [showColumnMenuIcon, columnMenuOpen]);
  var handleExited = React.useCallback(function () {
    setShowColumnMenuIcon(false);
  }, []);

  var columnMenuIconButton = !rootProps.disableColumnMenu && !column.disableColumnMenu && /*#__PURE__*/_jsx(ColumnHeaderMenuIcon, {
    column: column,
    columnMenuId: columnMenuId,
    columnMenuButtonId: columnMenuButtonId,
    open: showColumnMenuIcon,
    iconButtonRef: iconButtonRef
  });

  var sortingOrder = (_column$sortingOrder = column.sortingOrder) != null ? _column$sortingOrder : rootProps.sortingOrder;

  var columnTitleIconButtons = /*#__PURE__*/_jsxs(React.Fragment, {
    children: [!rootProps.disableColumnFilter && /*#__PURE__*/_jsx(rootProps.components.ColumnHeaderFilterIconButton, _extends({
      field: column.field,
      counter: filterItemsCounter
    }, (_rootProps$components = rootProps.componentsProps) == null ? void 0 : _rootProps$components.columnHeaderFilterIconButton)), column.sortable && !column.hideSortIcons && /*#__PURE__*/_jsx(GridColumnHeaderSortIcon, {
      direction: sortDirection,
      index: sortIndex,
      sortingOrder: sortingOrder
    })]
  });

  React.useLayoutEffect(function () {
    var columnMenuState = apiRef.current.state.columnMenu;

    if (hasFocus && !columnMenuState.open) {
      var focusableElement = headerCellRef.current.querySelector('[tabindex="0"]');
      var elementToFocus = focusableElement || headerCellRef.current;
      elementToFocus == null ? void 0 : elementToFocus.focus();
      apiRef.current.columnHeadersContainerElementRef.current.scrollLeft = 0;
    }
  }, [apiRef, hasFocus]);
  var headerClassName = typeof column.headerClassName === 'function' ? column.headerClassName({
    field: column.field,
    colDef: column
  }) : column.headerClassName;
  return /*#__PURE__*/_jsxs("div", _extends({
    ref: headerCellRef,
    className: clsx(classes.root, headerClassName),
    "data-field": column.field,
    style: {
      width: width,
      minWidth: width,
      maxWidth: width
    },
    role: "columnheader",
    tabIndex: tabIndex,
    "aria-colindex": colIndex + 1,
    "aria-sort": ariaSort
  }, mouseEventsHandlers, {
    children: [/*#__PURE__*/_jsxs("div", _extends({
      className: classes.draggableContainer,
      draggable: !rootProps.disableColumnReorder && !disableReorder && !column.disableReorder
    }, draggableEventHandlers, {
      children: [/*#__PURE__*/_jsxs("div", {
        className: classes.titleContainer,
        children: [/*#__PURE__*/_jsx("div", {
          className: classes.titleContainerContent,
          children: headerComponent || /*#__PURE__*/_jsx(GridColumnHeaderTitle, {
            label: (_column$headerName = column.headerName) != null ? _column$headerName : column.field,
            description: column.description,
            columnWidth: width
          })
        }), columnTitleIconButtons]
      }), columnMenuIconButton]
    })), /*#__PURE__*/_jsx(GridColumnHeaderSeparator, {
      resizable: !rootProps.disableColumnResize && !!column.resizable,
      resizing: isResizing,
      height: headerHeight,
      onMouseDown: publish(GridEvents.columnSeparatorMouseDown),
      side: separatorSide
    }), /*#__PURE__*/_jsx(GridColumnHeaderMenu, {
      columnMenuId: columnMenuId,
      columnMenuButtonId: columnMenuButtonId,
      field: column.field,
      open: columnMenuOpen,
      target: iconButtonRef.current,
      ContentComponent: rootProps.components.ColumnMenu,
      contentComponentProps: (_rootProps$components2 = rootProps.componentsProps) == null ? void 0 : _rootProps$components2.columnMenu,
      onExited: handleExited
    })]
  }));
}

process.env.NODE_ENV !== "production" ? GridColumnHeaderItem.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  colIndex: PropTypes.number.isRequired,
  column: PropTypes.object.isRequired,
  columnMenuOpen: PropTypes.bool.isRequired,
  disableReorder: PropTypes.bool,
  extendRowFullWidth: PropTypes.bool.isRequired,
  filterItemsCounter: PropTypes.number,
  hasFocus: PropTypes.bool,
  headerHeight: PropTypes.number.isRequired,
  isDragging: PropTypes.bool.isRequired,
  isLastColumn: PropTypes.bool.isRequired,
  isResizing: PropTypes.bool.isRequired,
  separatorSide: PropTypes.oneOf(['left', 'right']),
  sortDirection: PropTypes.oneOf(['asc', 'desc']),
  sortIndex: PropTypes.number,
  tabIndex: PropTypes.oneOf([-1, 0]).isRequired
} : void 0;
export { GridColumnHeaderItem };