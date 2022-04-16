import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import { unstable_composeClasses as composeClasses } from '@mui/material';
import { useGridApiEventHandler, getDataGridUtilityClass, GridEvents, useGridLogger } from '@mui/x-data-grid';
import { gridColumnReorderDragColSelector } from './columnReorderSelector';
var CURSOR_MOVE_DIRECTION_LEFT = 'left';
var CURSOR_MOVE_DIRECTION_RIGHT = 'right';

var getCursorMoveDirectionX = function getCursorMoveDirectionX(currentCoordinates, nextCoordinates) {
  return currentCoordinates.x <= nextCoordinates.x ? CURSOR_MOVE_DIRECTION_RIGHT : CURSOR_MOVE_DIRECTION_LEFT;
};

var hasCursorPositionChanged = function hasCursorPositionChanged(currentCoordinates, nextCoordinates) {
  return currentCoordinates.x !== nextCoordinates.x || currentCoordinates.y !== nextCoordinates.y;
};

var useUtilityClasses = function useUtilityClasses(ownerState) {
  var classes = ownerState.classes;
  var slots = {
    columnHeaderDragging: ['columnHeader--dragging']
  };
  return composeClasses(slots, getDataGridUtilityClass, classes);
};

export var columnReorderStateInitializer = function columnReorderStateInitializer(state) {
  return _extends({}, state, {
    columnReorder: {
      dragCol: ''
    }
  });
};
/**
 * Only available in DataGridPro
 * @requires useGridColumns (method)
 */

export var useGridColumnReorder = function useGridColumnReorder(apiRef, props) {
  var logger = useGridLogger(apiRef, 'useGridColumnReorder');
  var dragColNode = React.useRef(null);
  var cursorPosition = React.useRef({
    x: 0,
    y: 0
  });
  var originColumnIndex = React.useRef(null);
  var removeDnDStylesTimeout = React.useRef();
  var ownerState = {
    classes: props.classes
  };
  var classes = useUtilityClasses(ownerState);
  React.useEffect(function () {
    return function () {
      clearTimeout(removeDnDStylesTimeout.current);
    };
  }, []);
  var handleColumnHeaderDragStart = React.useCallback(function (params, event) {
    if (props.disableColumnReorder || params.colDef.disableReorder) {
      return;
    }

    logger.debug("Start dragging col ".concat(params.field)); // Prevent drag events propagation.
    // For more information check here https://github.com/mui/mui-x/issues/2680.

    event.stopPropagation();
    dragColNode.current = event.currentTarget;
    dragColNode.current.classList.add(classes.columnHeaderDragging);
    apiRef.current.setState(function (state) {
      return _extends({}, state, {
        columnReorder: _extends({}, state.columnReorder, {
          dragCol: params.field
        })
      });
    });
    apiRef.current.forceUpdate();
    removeDnDStylesTimeout.current = setTimeout(function () {
      dragColNode.current.classList.remove(classes.columnHeaderDragging);
    });
    originColumnIndex.current = apiRef.current.getColumnIndex(params.field, false);
  }, [props.disableColumnReorder, classes.columnHeaderDragging, logger, apiRef]);
  var handleDragEnter = React.useCallback(function (params, event) {
    event.preventDefault(); // Prevent drag events propagation.
    // For more information check here https://github.com/mui/mui-x/issues/2680.

    event.stopPropagation();
  }, []);
  var handleDragOver = React.useCallback(function (params, event) {
    var dragColField = gridColumnReorderDragColSelector(apiRef);

    if (!dragColField) {
      return;
    }

    logger.debug("Dragging over col ".concat(params.field));
    event.preventDefault(); // Prevent drag events propagation.
    // For more information check here https://github.com/mui/mui-x/issues/2680.

    event.stopPropagation();
    var coordinates = {
      x: event.clientX,
      y: event.clientY
    };

    if (params.field !== dragColField && hasCursorPositionChanged(cursorPosition.current, coordinates)) {
      var targetColIndex = apiRef.current.getColumnIndex(params.field, false);
      var targetColVisibleIndex = apiRef.current.getColumnIndex(params.field, true);
      var targetCol = apiRef.current.getColumn(params.field);
      var dragColIndex = apiRef.current.getColumnIndex(dragColField, false);
      var visibleColumns = apiRef.current.getVisibleColumns();
      var cursorMoveDirectionX = getCursorMoveDirectionX(cursorPosition.current, coordinates);
      var hasMovedLeft = cursorMoveDirectionX === CURSOR_MOVE_DIRECTION_LEFT && targetColIndex < dragColIndex;
      var hasMovedRight = cursorMoveDirectionX === CURSOR_MOVE_DIRECTION_RIGHT && dragColIndex < targetColIndex;

      if (hasMovedLeft || hasMovedRight) {
        var canBeReordered;

        if (!targetCol.disableReorder) {
          canBeReordered = true;
        } else if (hasMovedLeft) {
          canBeReordered = targetColIndex > 0 && !visibleColumns[targetColIndex - 1].disableReorder;
        } else {
          canBeReordered = targetColIndex < visibleColumns.length - 1 && !visibleColumns[targetColIndex + 1].disableReorder;
        }

        var canBeReorderedProcessed = apiRef.current.unstable_applyPipeProcessors('canBeReordered', canBeReordered, {
          targetIndex: targetColVisibleIndex
        });

        if (canBeReorderedProcessed) {
          apiRef.current.setColumnIndex(dragColField, targetColIndex);
        }
      }

      cursorPosition.current = coordinates;
    }
  }, [apiRef, logger]);
  var handleDragEnd = React.useCallback(function (params, event) {
    var dragColField = gridColumnReorderDragColSelector(apiRef);

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

    apiRef.current.setState(function (state) {
      return _extends({}, state, {
        columnReorder: _extends({}, state.columnReorder, {
          dragCol: ''
        })
      });
    });
    apiRef.current.forceUpdate();
  }, [props.disableColumnReorder, logger, apiRef]);
  useGridApiEventHandler(apiRef, GridEvents.columnHeaderDragStart, handleColumnHeaderDragStart);
  useGridApiEventHandler(apiRef, GridEvents.columnHeaderDragEnter, handleDragEnter);
  useGridApiEventHandler(apiRef, GridEvents.columnHeaderDragOver, handleDragOver);
  useGridApiEventHandler(apiRef, GridEvents.columnHeaderDragEnd, handleDragEnd);
  useGridApiEventHandler(apiRef, GridEvents.cellDragEnter, handleDragEnter);
  useGridApiEventHandler(apiRef, GridEvents.cellDragOver, handleDragOver);
};