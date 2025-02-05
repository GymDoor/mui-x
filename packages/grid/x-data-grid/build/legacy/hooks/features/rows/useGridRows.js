import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import { GridEvents } from '../../../models/events';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { useGridLogger } from '../../utils/useGridLogger';
import { gridRowCountSelector, gridRowsLookupSelector, gridRowTreeSelector, gridRowIdsSelector, gridRowGroupingNameSelector } from './gridRowsSelector';
import { GridSignature, useGridApiEventHandler } from '../../utils/useGridApiEventHandler';
import { useGridVisibleRows } from '../../utils/useGridVisibleRows';
import { checkGridRowIdIsValid } from './gridRowsUtils';

function getGridRowId(rowModel, getRowId, detailErrorMessage) {
  var id = getRowId ? getRowId(rowModel) : rowModel.id;
  checkGridRowIdIsValid(id, rowModel, detailErrorMessage);
  return id;
}

var convertGridRowsPropToState = function convertGridRowsPropToState(_ref) {
  var prevState = _ref.prevState,
      rows = _ref.rows,
      getRowId = _ref.getRowId;
  var value;

  if (rows) {
    value = {
      idRowsLookup: {},
      ids: []
    };

    for (var i = 0; i < rows.length; i += 1) {
      var row = rows[i];
      var id = getGridRowId(row, getRowId);
      value.idRowsLookup[id] = row;
      value.ids.push(id);
    }
  } else {
    value = prevState.value;
  }

  return {
    value: value,
    rowsBeforePartialUpdates: rows != null ? rows : prevState.rowsBeforePartialUpdates
  };
};

var getRowsStateFromCache = function getRowsStateFromCache(rowsCache, previousTree, apiRef, rowCountProp, loadingProp) {
  var value = rowsCache.state.value;
  var rowCount = rowCountProp != null ? rowCountProp : 0;
  var groupingResponse = apiRef.current.unstable_applyStrategyProcessor('rowTreeCreation', _extends({}, value, {
    previousTree: previousTree
  }));
  var dataTopLevelRowCount = groupingResponse.treeDepth === 1 ? groupingResponse.ids.length : Object.values(groupingResponse.tree).filter(function (node) {
    return node.parent == null;
  }).length;
  return _extends({}, groupingResponse, {
    loading: loadingProp,
    totalRowCount: Math.max(rowCount, groupingResponse.ids.length),
    totalTopLevelRowCount: Math.max(rowCount, dataTopLevelRowCount)
  });
};

export var rowsStateInitializer = function rowsStateInitializer(state, props, apiRef) {
  var rowsCache = {
    state: convertGridRowsPropToState({
      rows: props.rows,
      getRowId: props.getRowId,
      prevState: {
        value: {
          idRowsLookup: {},
          ids: []
        },
        rowsBeforePartialUpdates: []
      }
    }),
    timeout: null,
    lastUpdateMs: Date.now()
  };
  return _extends({}, state, {
    rows: getRowsStateFromCache(rowsCache, null, apiRef, props.rowCount, props.loading),
    rowsCache: rowsCache // TODO remove from state

  });
};
export var useGridRows = function useGridRows(apiRef, props) {
  if (process.env.NODE_ENV !== 'production') {
    // Freeze rows for immutability
    Object.freeze(props.rows);
  }

  var logger = useGridLogger(apiRef, 'useGridRows');
  var rowsCache = React.useRef(apiRef.current.state.rowsCache); // To avoid listing rowsCache as useEffect dep

  var currentPage = useGridVisibleRows(apiRef, props);
  var getRow = React.useCallback(function (id) {
    var _ref2;

    return (_ref2 = gridRowsLookupSelector(apiRef)[id]) != null ? _ref2 : null;
  }, [apiRef]);
  var lookup = React.useMemo(function () {
    return currentPage.rows.reduce(function (acc, _ref3, index) {
      var id = _ref3.id;
      acc[id] = index;
      return acc;
    }, {});
  }, [currentPage.rows]);
  var throttledRowsChange = React.useCallback(function (newState, throttle) {
    var run = function run() {
      rowsCache.current.timeout = null;
      rowsCache.current.lastUpdateMs = Date.now();
      apiRef.current.setState(function (state) {
        return _extends({}, state, {
          rows: getRowsStateFromCache(rowsCache.current, gridRowTreeSelector(apiRef), apiRef, props.rowCount, props.loading)
        });
      });
      apiRef.current.publishEvent(GridEvents.rowsSet);
      apiRef.current.forceUpdate();
    };

    if (rowsCache.current.timeout) {
      clearTimeout(rowsCache.current.timeout);
    }

    rowsCache.current.state = newState;
    rowsCache.current.timeout = null;

    if (!throttle) {
      run();
      return;
    }

    var throttleRemainingTimeMs = props.throttleRowsMs - (Date.now() - rowsCache.current.lastUpdateMs);

    if (throttleRemainingTimeMs > 0) {
      rowsCache.current.timeout = setTimeout(run, throttleRemainingTimeMs);
      return;
    }

    run();
  }, [props.throttleRowsMs, props.rowCount, props.loading, apiRef]);
  /**
   * API METHODS
   */

  var setRows = React.useCallback(function (rows) {
    logger.debug("Updating all rows, new length ".concat(rows.length));
    throttledRowsChange(convertGridRowsPropToState({
      rows: rows,
      prevState: rowsCache.current.state,
      getRowId: props.getRowId
    }), true);
  }, [logger, props.getRowId, throttledRowsChange]);
  var updateRows = React.useCallback(function (updates) {
    if (props.signature === GridSignature.DataGrid && updates.length > 1) {
      // TODO: Add test with direct call to `apiRef.current.updateRows` in DataGrid after enabling the `apiRef` on the free plan.
      throw new Error(["MUI: You can't update several rows at once in `apiRef.current.updateRows` on the DataGrid.", 'You need to upgrade to the DataGridPro component to unlock this feature.'].join('\n'));
    } // we remove duplicate updates. A server can batch updates, and send several updates for the same row in one fn call.


    var uniqUpdates = new Map();
    updates.forEach(function (update) {
      var id = getGridRowId(update, props.getRowId, 'A row was provided without id when calling updateRows():');

      if (uniqUpdates.has(id)) {
        uniqUpdates.set(id, _extends({}, uniqUpdates.get(id), update));
      } else {
        uniqUpdates.set(id, update);
      }
    });
    var deletedRowIds = [];
    var newStateValue = {
      idRowsLookup: _extends({}, rowsCache.current.state.value.idRowsLookup),
      ids: _toConsumableArray(rowsCache.current.state.value.ids)
    };
    uniqUpdates.forEach(function (partialRow, id) {
      // eslint-disable-next-line no-underscore-dangle
      if (partialRow._action === 'delete') {
        delete newStateValue.idRowsLookup[id];
        deletedRowIds.push(id);
        return;
      }

      var oldRow = apiRef.current.getRow(id);

      if (!oldRow) {
        newStateValue.idRowsLookup[id] = partialRow;
        newStateValue.ids.push(id);
        return;
      }

      newStateValue.idRowsLookup[id] = _extends({}, apiRef.current.getRow(id), partialRow);
    });

    if (deletedRowIds.length > 0) {
      newStateValue.ids = newStateValue.ids.filter(function (id) {
        return !deletedRowIds.includes(id);
      });
    }

    var state = _extends({}, rowsCache.current.state, {
      value: newStateValue
    });

    throttledRowsChange(state, true);
  }, [apiRef, props.getRowId, throttledRowsChange, props.signature]);
  var getRowModels = React.useCallback(function () {
    var allRows = gridRowIdsSelector(apiRef);
    var idRowsLookup = gridRowsLookupSelector(apiRef);
    return new Map(allRows.map(function (id) {
      return [id, idRowsLookup[id]];
    }));
  }, [apiRef]);
  var getRowsCount = React.useCallback(function () {
    return gridRowCountSelector(apiRef);
  }, [apiRef]);
  var getAllRowIds = React.useCallback(function () {
    return gridRowIdsSelector(apiRef);
  }, [apiRef]);
  var getRowIndexRelativeToVisibleRows = React.useCallback(function (id) {
    return lookup[id];
  }, [lookup]);
  var setRowChildrenExpansion = React.useCallback(function (id, isExpanded) {
    var currentNode = apiRef.current.getRowNode(id);

    if (!currentNode) {
      throw new Error("MUI: No row with id #".concat(id, " found"));
    }

    var newNode = _extends({}, currentNode, {
      childrenExpanded: isExpanded
    });

    apiRef.current.setState(function (state) {
      return _extends({}, state, {
        rows: _extends({}, state.rows, {
          tree: _extends({}, state.rows.tree, _defineProperty({}, id, newNode))
        })
      });
    });
    apiRef.current.forceUpdate();
    apiRef.current.publishEvent(GridEvents.rowExpansionChange, newNode);
  }, [apiRef]);
  var getRowNode = React.useCallback(function (id) {
    var _gridRowTreeSelector$;

    return (_gridRowTreeSelector$ = gridRowTreeSelector(apiRef)[id]) != null ? _gridRowTreeSelector$ : null;
  }, [apiRef]);
  var rowApi = {
    getRow: getRow,
    getRowModels: getRowModels,
    getRowsCount: getRowsCount,
    getAllRowIds: getAllRowIds,
    setRows: setRows,
    updateRows: updateRows,
    setRowChildrenExpansion: setRowChildrenExpansion,
    getRowNode: getRowNode,
    getRowIndexRelativeToVisibleRows: getRowIndexRelativeToVisibleRows
  };
  /**
   * EVENTS
   */

  var groupRows = React.useCallback(function () {
    logger.info("Row grouping pre-processing have changed, regenerating the row tree");
    var rows;

    if (rowsCache.current.state.rowsBeforePartialUpdates === props.rows) {
      // The `props.rows` has not changed since the last row grouping
      // We can keep the potential updates stored in `inputRowsAfterUpdates` on the new grouping
      rows = undefined;
    } else {
      // The `props.rows` has changed since the last row grouping
      // We must use the new `props.rows` on the new grouping
      // This occurs because this event is triggered before the `useEffect` on the rows when both the grouping pre-processing and the rows changes on the same render
      rows = props.rows;
    }

    throttledRowsChange(convertGridRowsPropToState({
      rows: rows,
      getRowId: props.getRowId,
      prevState: rowsCache.current.state
    }), false);
  }, [logger, throttledRowsChange, props.getRowId, props.rows]);
  var handleStrategyProcessorChange = React.useCallback(function (methodName) {
    if (methodName === 'rowTreeCreation') {
      groupRows();
    }
  }, [groupRows]);
  var handleStrategyActivityChange = React.useCallback(function () {
    // `rowTreeCreation` is the only processor ran when `strategyAvailabilityChange` is fired.
    // All the other processors listen to `rowsSet` which will be published by the `groupRows` method below.
    if (apiRef.current.unstable_getActiveStrategy('rowTree') !== gridRowGroupingNameSelector(apiRef)) {
      groupRows();
    }
  }, [apiRef, groupRows]);
  useGridApiEventHandler(apiRef, GridEvents.activeStrategyProcessorChange, handleStrategyProcessorChange);
  useGridApiEventHandler(apiRef, GridEvents.strategyAvailabilityChange, handleStrategyActivityChange);
  useGridApiMethod(apiRef, rowApi, 'GridRowApi');
  /**
   * EFFECTS
   */

  React.useEffect(function () {
    return function () {
      if (rowsCache.current.timeout !== null) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        clearTimeout(rowsCache.current.timeout);
      }
    };
  }, []); // The effect do not track any value defined synchronously during the 1st render by hooks called after `useGridRows`
  // As a consequence, the state generated by the 1st run of this useEffect will always be equal to the initialization one

  var isFirstRender = React.useRef(true);
  React.useEffect(function () {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    } // The new rows have already been applied (most likely in the `GridEvents.rowGroupsPreProcessingChange` listener)


    if (rowsCache.current.state.rowsBeforePartialUpdates === props.rows) {
      return;
    }

    logger.debug("Updating all rows, new length ".concat(props.rows.length));
    throttledRowsChange(convertGridRowsPropToState({
      rows: props.rows,
      getRowId: props.getRowId,
      prevState: rowsCache.current.state
    }), false);
  }, [props.rows, props.rowCount, props.getRowId, logger, throttledRowsChange]);
};