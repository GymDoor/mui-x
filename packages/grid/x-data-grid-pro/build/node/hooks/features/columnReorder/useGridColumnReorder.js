"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useGridColumnReorder = exports.columnReorderStateInitializer = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var React = _interopRequireWildcard(require("react"));

var _material = require("@mui/material");

var _xDataGrid = require("@mui/x-data-grid");

var _columnReorderSelector = require("./columnReorderSelector");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const CURSOR_MOVE_DIRECTION_LEFT = 'left';
const CURSOR_MOVE_DIRECTION_RIGHT = 'right';

const getCursorMoveDirectionX = (currentCoordinates, nextCoordinates) => {
  return currentCoordinates.x <= nextCoordinates.x ? CURSOR_MOVE_DIRECTION_RIGHT : CURSOR_MOVE_DIRECTION_LEFT;
};

const hasCursorPositionChanged = (currentCoordinates, nextCoordinates) => currentCoordinates.x !== nextCoordinates.x || currentCoordinates.y !== nextCoordinates.y;

const useUtilityClasses = ownerState => {
  const {
    classes
  } = ownerState;
  const slots = {
    columnHeaderDragging: ['columnHeader--dragging']
  };
  return (0, _material.unstable_composeClasses)(slots, _xDataGrid.getDataGridUtilityClass, classes);
};

const columnReorderStateInitializer = state => (0, _extends2.default)({}, state, {
  columnReorder: {
    dragCol: ''
  }
});
/**
 * Only available in DataGridPro
 * @requires useGridColumns (method)
 */


exports.columnReorderStateInitializer = columnReorderStateInitializer;

const useGridColumnReorder = (apiRef, props) => {
  const logger = (0, _xDataGrid.useGridLogger)(apiRef, 'useGridColumnReorder');
  const dragColNode = React.useRef(null);
  const cursorPosition = React.useRef({
    x: 0,
    y: 0
  });
  const originColumnIndex = React.useRef(null);
  const removeDnDStylesTimeout = React.useRef();
  const ownerState = {
    classes: props.classes
  };
  const classes = useUtilityClasses(ownerState);
  React.useEffect(() => {
    return () => {
      clearTimeout(removeDnDStylesTimeout.current);
    };
  }, []);
  const handleColumnHeaderDragStart = React.useCallback((params, event) => {
    if (props.disableColumnReorder || params.colDef.disableReorder) {
      return;
    }

    logger.debug(`Start dragging col ${params.field}`); // Prevent drag events propagation.
    // For more information check here https://github.com/mui/mui-x/issues/2680.

    event.stopPropagation();
    dragColNode.current = event.currentTarget;
    dragColNode.current.classList.add(classes.columnHeaderDragging);
    apiRef.current.setState(state => (0, _extends2.default)({}, state, {
      columnReorder: (0, _extends2.default)({}, state.columnReorder, {
        dragCol: params.field
      })
    }));
    apiRef.current.forceUpdate();
    removeDnDStylesTimeout.current = setTimeout(() => {
      dragColNode.current.classList.remove(classes.columnHeaderDragging);
    });
    originColumnIndex.current = apiRef.current.getColumnIndex(params.field, false);
  }, [props.disableColumnReorder, classes.columnHeaderDragging, logger, apiRef]);
  const handleDragEnter = React.useCallback((params, event) => {
    event.preventDefault(); // Prevent drag events propagation.
    // For more information check here https://github.com/mui/mui-x/issues/2680.

    event.stopPropagation();
  }, []);
  const handleDragOver = React.useCallback((params, event) => {
    const dragColField = (0, _columnReorderSelector.gridColumnReorderDragColSelector)(apiRef);

    if (!dragColField) {
      return;
    }

    logger.debug(`Dragging over col ${params.field}`);
    event.preventDefault(); // Prevent drag events propagation.
    // For more information check here https://github.com/mui/mui-x/issues/2680.

    event.stopPropagation();
    const coordinates = {
      x: event.clientX,
      y: event.clientY
    };

    if (params.field !== dragColField && hasCursorPositionChanged(cursorPosition.current, coordinates)) {
      const targetColIndex = apiRef.current.getColumnIndex(params.field, false);
      const targetColVisibleIndex = apiRef.current.getColumnIndex(params.field, true);
      const targetCol = apiRef.current.getColumn(params.field);
      const dragColIndex = apiRef.current.getColumnIndex(dragColField, false);
      const visibleColumns = apiRef.current.getVisibleColumns();
      const cursorMoveDirectionX = getCursorMoveDirectionX(cursorPosition.current, coordinates);
      const hasMovedLeft = cursorMoveDirectionX === CURSOR_MOVE_DIRECTION_LEFT && targetColIndex < dragColIndex;
      const hasMovedRight = cursorMoveDirectionX === CURSOR_MOVE_DIRECTION_RIGHT && dragColIndex < targetColIndex;

      if (hasMovedLeft || hasMovedRight) {
        let canBeReordered;

        if (!targetCol.disableReorder) {
          canBeReordered = true;
        } else if (hasMovedLeft) {
          canBeReordered = targetColIndex > 0 && !visibleColumns[targetColIndex - 1].disableReorder;
        } else {
          canBeReordered = targetColIndex < visibleColumns.length - 1 && !visibleColumns[targetColIndex + 1].disableReorder;
        }

        const canBeReorderedProcessed = apiRef.current.unstable_applyPipeProcessors('canBeReordered', canBeReordered, {
          targetIndex: targetColVisibleIndex
        });

        if (canBeReorderedProcessed) {
          apiRef.current.setColumnIndex(dragColField, targetColIndex);
        }
      }

      cursorPosition.current = coordinates;
    }
  }, [apiRef, logger]);
  const handleDragEnd = React.useCallback((params, event) => {
    const dragColField = (0, _columnReorderSelector.gridColumnReorderDragColSelector)(apiRef);

    if (props.disableColumnReorder || !dragColField) {
      return;
    }

    logger.debug('End dragging col');
    event.preventDefault(); // Prevent drag events propagation.
    // For more information check here https://github.com/mui/mui-x/issues/2680.

    event.stopPropagation();
    clearTimeout(removeDnDStylesTimeout.current);
    dragColNode.current = null; // Check if the column was dropped outside the grid.

    if (event.dataTransfer.dropEffect === 'none') {
      // Accessing params.field may contain the wrong field as header elements are reused
      apiRef.current.setColumnIndex(dragColField, originColumnIndex.current);
      originColumnIndex.current = null;
    }

    apiRef.current.setState(state => (0, _extends2.default)({}, state, {
      columnReorder: (0, _extends2.default)({}, state.columnReorder, {
        dragCol: ''
      })
    }));
    apiRef.current.forceUpdate();
  }, [props.disableColumnReorder, logger, apiRef]);
  (0, _xDataGrid.useGridApiEventHandler)(apiRef, _xDataGrid.GridEvents.columnHeaderDragStart, handleColumnHeaderDragStart);
  (0, _xDataGrid.useGridApiEventHandler)(apiRef, _xDataGrid.GridEvents.columnHeaderDragEnter, handleDragEnter);
  (0, _xDataGrid.useGridApiEventHandler)(apiRef, _xDataGrid.GridEvents.columnHeaderDragOver, handleDragOver);
  (0, _xDataGrid.useGridApiEventHandler)(apiRef, _xDataGrid.GridEvents.columnHeaderDragEnd, handleDragEnd);
  (0, _xDataGrid.useGridApiEventHandler)(apiRef, _xDataGrid.GridEvents.cellDragEnter, handleDragEnter);
  (0, _xDataGrid.useGridApiEventHandler)(apiRef, _xDataGrid.GridEvents.cellDragOver, handleDragOver);
};

exports.useGridColumnReorder = useGridColumnReorder;