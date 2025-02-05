import _extends from "@babel/runtime/helpers/esm/extends";
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

const useUtilityClasses = ownerState => {
  const {
    column,
    classes,
    isDragging,
    sortDirection,
    showRightBorder,
    filterItemsCounter
  } = ownerState;
  const isColumnSorted = sortDirection != null;
  const isColumnFiltered = filterItemsCounter != null && filterItemsCounter > 0; // todo refactor to a prop on col isNumeric or ?? ie: coltype===price wont work

  const isColumnNumeric = column.type === 'number';
  const slots = {
    root: ['columnHeader', column.headerAlign === 'left' && 'columnHeader--alignLeft', column.headerAlign === 'center' && 'columnHeader--alignCenter', column.headerAlign === 'right' && 'columnHeader--alignRight', column.sortable && 'columnHeader--sortable', isDragging && 'columnHeader--moving', isColumnSorted && 'columnHeader--sorted', isColumnFiltered && 'columnHeader--filtered', isColumnNumeric && 'columnHeader--numeric', showRightBorder && 'withBorder'],
    draggableContainer: ['columnHeaderDraggableContainer'],
    titleContainer: ['columnHeaderTitleContainer'],
    titleContainerContent: ['columnHeaderTitleContainerContent']
  };
  return composeClasses(slots, getDataGridUtilityClass, classes);
};

function GridColumnHeaderItem(props) {
  const {
    column,
    columnMenuOpen,
    colIndex,
    headerHeight,
    isResizing,
    isLastColumn,
    sortDirection,
    sortIndex,
    filterItemsCounter,
    hasFocus,
    tabIndex,
    extendRowFullWidth,
    disableReorder,
    separatorSide
  } = props;
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const headerCellRef = React.useRef(null);
  const columnMenuId = useId();
  const columnMenuButtonId = useId();
  const iconButtonRef = React.useRef(null);
  const [showColumnMenuIcon, setShowColumnMenuIcon] = React.useState(columnMenuOpen);
  const {
    hasScrollX,
    hasScrollY
  } = apiRef.current.getRootDimensions() ?? {
    hasScrollX: false,
    hasScrollY: false
  };
  let headerComponent = null;

  if (column.renderHeader) {
    headerComponent = column.renderHeader(apiRef.current.getColumnHeaderParams(column.field));
  }

  const publish = React.useCallback(eventName => event => {
    // Ignore portal
    // See https://github.com/mui/mui-x/issues/1721
    if (!event.currentTarget.contains(event.target)) {
      return;
    }

    apiRef.current.publishEvent(eventName, apiRef.current.getColumnHeaderParams(column.field), event);
  }, [apiRef, column.field]);
  const mouseEventsHandlers = {
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
  const draggableEventHandlers = {
    onDragStart: publish(GridEvents.columnHeaderDragStart),
    onDragEnter: publish(GridEvents.columnHeaderDragEnter),
    onDragOver: publish(GridEvents.columnHeaderDragOver),
    onDragEnd: publish(GridEvents.columnHeaderDragEnd)
  };
  const removeLastBorderRight = isLastColumn && hasScrollX && !hasScrollY;
  const showRightBorder = !isLastColumn ? rootProps.showColumnRightBorder : !removeLastBorderRight && !extendRowFullWidth;

  const ownerState = _extends({}, props, {
    classes: rootProps.classes,
    showRightBorder
  });

  const classes = useUtilityClasses(ownerState);
  const width = column.computedWidth;
  let ariaSort;

  if (sortDirection != null) {
    ariaSort = sortDirection === 'asc' ? 'ascending' : 'descending';
  }

  React.useEffect(() => {
    if (!showColumnMenuIcon) {
      setShowColumnMenuIcon(columnMenuOpen);
    }
  }, [showColumnMenuIcon, columnMenuOpen]);
  const handleExited = React.useCallback(() => {
    setShowColumnMenuIcon(false);
  }, []);

  const columnMenuIconButton = !rootProps.disableColumnMenu && !column.disableColumnMenu && /*#__PURE__*/_jsx(ColumnHeaderMenuIcon, {
    column: column,
    columnMenuId: columnMenuId,
    columnMenuButtonId: columnMenuButtonId,
    open: showColumnMenuIcon,
    iconButtonRef: iconButtonRef
  });

  const sortingOrder = column.sortingOrder ?? rootProps.sortingOrder;

  const columnTitleIconButtons = /*#__PURE__*/_jsxs(React.Fragment, {
    children: [!rootProps.disableColumnFilter && /*#__PURE__*/_jsx(rootProps.components.ColumnHeaderFilterIconButton, _extends({
      field: column.field,
      counter: filterItemsCounter
    }, rootProps.componentsProps?.columnHeaderFilterIconButton)), column.sortable && !column.hideSortIcons && /*#__PURE__*/_jsx(GridColumnHeaderSortIcon, {
      direction: sortDirection,
      index: sortIndex,
      sortingOrder: sortingOrder
    })]
  });

  React.useLayoutEffect(() => {
    const columnMenuState = apiRef.current.state.columnMenu;

    if (hasFocus && !columnMenuState.open) {
      const focusableElement = headerCellRef.current.querySelector('[tabindex="0"]');
      const elementToFocus = focusableElement || headerCellRef.current;
      elementToFocus?.focus();
      apiRef.current.columnHeadersContainerElementRef.current.scrollLeft = 0;
    }
  }, [apiRef, hasFocus]);
  const headerClassName = typeof column.headerClassName === 'function' ? column.headerClassName({
    field: column.field,
    colDef: column
  }) : column.headerClassName;
  return /*#__PURE__*/_jsxs("div", _extends({
    ref: headerCellRef,
    className: clsx(classes.root, headerClassName),
    "data-field": column.field,
    style: {
      width,
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
            label: column.headerName ?? column.field,
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
      contentComponentProps: rootProps.componentsProps?.columnMenu,
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