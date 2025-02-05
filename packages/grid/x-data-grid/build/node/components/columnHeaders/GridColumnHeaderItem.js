"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GridColumnHeaderItem = GridColumnHeaderItem;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var React = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _clsx = _interopRequireDefault(require("clsx"));

var _material = require("@mui/material");

var _utils = require("@mui/material/utils");

var _events = require("../../models/events");

var _useGridApiContext = require("../../hooks/utils/useGridApiContext");

var _GridColumnHeaderSortIcon = require("./GridColumnHeaderSortIcon");

var _GridColumnHeaderTitle = require("./GridColumnHeaderTitle");

var _GridColumnHeaderSeparator = require("./GridColumnHeaderSeparator");

var _ColumnHeaderMenuIcon = require("./ColumnHeaderMenuIcon");

var _GridColumnHeaderMenu = require("../menu/columnMenu/GridColumnHeaderMenu");

var _gridClasses = require("../../constants/gridClasses");

var _useGridRootProps = require("../../hooks/utils/useGridRootProps");

var _jsxRuntime = require("react/jsx-runtime");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

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
  return (0, _material.unstable_composeClasses)(slots, _gridClasses.getDataGridUtilityClass, classes);
};

function GridColumnHeaderItem(props) {
  var _apiRef$current$getRo, _column$sortingOrder, _rootProps$components, _column$headerName, _rootProps$components2;

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
  const apiRef = (0, _useGridApiContext.useGridApiContext)();
  const rootProps = (0, _useGridRootProps.useGridRootProps)();
  const headerCellRef = React.useRef(null);
  const columnMenuId = (0, _utils.unstable_useId)();
  const columnMenuButtonId = (0, _utils.unstable_useId)();
  const iconButtonRef = React.useRef(null);
  const [showColumnMenuIcon, setShowColumnMenuIcon] = React.useState(columnMenuOpen);
  const {
    hasScrollX,
    hasScrollY
  } = (_apiRef$current$getRo = apiRef.current.getRootDimensions()) != null ? _apiRef$current$getRo : {
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
    onClick: publish(_events.GridEvents.columnHeaderClick),
    onDoubleClick: publish(_events.GridEvents.columnHeaderDoubleClick),
    onMouseOver: publish(_events.GridEvents.columnHeaderOver),
    // TODO remove as it's not used
    onMouseOut: publish(_events.GridEvents.columnHeaderOut),
    // TODO remove as it's not used
    onMouseEnter: publish(_events.GridEvents.columnHeaderEnter),
    // TODO remove as it's not used
    onMouseLeave: publish(_events.GridEvents.columnHeaderLeave),
    // TODO remove as it's not used
    onKeyDown: publish(_events.GridEvents.columnHeaderKeyDown),
    onFocus: publish(_events.GridEvents.columnHeaderFocus),
    onBlur: publish(_events.GridEvents.columnHeaderBlur)
  };
  const draggableEventHandlers = {
    onDragStart: publish(_events.GridEvents.columnHeaderDragStart),
    onDragEnter: publish(_events.GridEvents.columnHeaderDragEnter),
    onDragOver: publish(_events.GridEvents.columnHeaderDragOver),
    onDragEnd: publish(_events.GridEvents.columnHeaderDragEnd)
  };
  const removeLastBorderRight = isLastColumn && hasScrollX && !hasScrollY;
  const showRightBorder = !isLastColumn ? rootProps.showColumnRightBorder : !removeLastBorderRight && !extendRowFullWidth;
  const ownerState = (0, _extends2.default)({}, props, {
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
  const columnMenuIconButton = !rootProps.disableColumnMenu && !column.disableColumnMenu && /*#__PURE__*/(0, _jsxRuntime.jsx)(_ColumnHeaderMenuIcon.ColumnHeaderMenuIcon, {
    column: column,
    columnMenuId: columnMenuId,
    columnMenuButtonId: columnMenuButtonId,
    open: showColumnMenuIcon,
    iconButtonRef: iconButtonRef
  });
  const sortingOrder = (_column$sortingOrder = column.sortingOrder) != null ? _column$sortingOrder : rootProps.sortingOrder;
  const columnTitleIconButtons = /*#__PURE__*/(0, _jsxRuntime.jsxs)(React.Fragment, {
    children: [!rootProps.disableColumnFilter && /*#__PURE__*/(0, _jsxRuntime.jsx)(rootProps.components.ColumnHeaderFilterIconButton, (0, _extends2.default)({
      field: column.field,
      counter: filterItemsCounter
    }, (_rootProps$components = rootProps.componentsProps) == null ? void 0 : _rootProps$components.columnHeaderFilterIconButton)), column.sortable && !column.hideSortIcons && /*#__PURE__*/(0, _jsxRuntime.jsx)(_GridColumnHeaderSortIcon.GridColumnHeaderSortIcon, {
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
      elementToFocus == null ? void 0 : elementToFocus.focus();
      apiRef.current.columnHeadersContainerElementRef.current.scrollLeft = 0;
    }
  }, [apiRef, hasFocus]);
  const headerClassName = typeof column.headerClassName === 'function' ? column.headerClassName({
    field: column.field,
    colDef: column
  }) : column.headerClassName;
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", (0, _extends2.default)({
    ref: headerCellRef,
    className: (0, _clsx.default)(classes.root, headerClassName),
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
    children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)("div", (0, _extends2.default)({
      className: classes.draggableContainer,
      draggable: !rootProps.disableColumnReorder && !disableReorder && !column.disableReorder
    }, draggableEventHandlers, {
      children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        className: classes.titleContainer,
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
          className: classes.titleContainerContent,
          children: headerComponent || /*#__PURE__*/(0, _jsxRuntime.jsx)(_GridColumnHeaderTitle.GridColumnHeaderTitle, {
            label: (_column$headerName = column.headerName) != null ? _column$headerName : column.field,
            description: column.description,
            columnWidth: width
          })
        }), columnTitleIconButtons]
      }), columnMenuIconButton]
    })), /*#__PURE__*/(0, _jsxRuntime.jsx)(_GridColumnHeaderSeparator.GridColumnHeaderSeparator, {
      resizable: !rootProps.disableColumnResize && !!column.resizable,
      resizing: isResizing,
      height: headerHeight,
      onMouseDown: publish(_events.GridEvents.columnSeparatorMouseDown),
      side: separatorSide
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_GridColumnHeaderMenu.GridColumnHeaderMenu, {
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
  colIndex: _propTypes.default.number.isRequired,
  column: _propTypes.default.object.isRequired,
  columnMenuOpen: _propTypes.default.bool.isRequired,
  disableReorder: _propTypes.default.bool,
  extendRowFullWidth: _propTypes.default.bool.isRequired,
  filterItemsCounter: _propTypes.default.number,
  hasFocus: _propTypes.default.bool,
  headerHeight: _propTypes.default.number.isRequired,
  isDragging: _propTypes.default.bool.isRequired,
  isLastColumn: _propTypes.default.bool.isRequired,
  isResizing: _propTypes.default.bool.isRequired,
  separatorSide: _propTypes.default.oneOf(['left', 'right']),
  sortDirection: _propTypes.default.oneOf(['asc', 'desc']),
  sortIndex: _propTypes.default.number,
  tabIndex: _propTypes.default.oneOf([-1, 0]).isRequired
} : void 0;