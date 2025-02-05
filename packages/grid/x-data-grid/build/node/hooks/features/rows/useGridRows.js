"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useGridRows = exports.rowsStateInitializer = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var React = _interopRequireWildcard(require("react"));

var _events = require("../../../models/events");

var _useGridApiMethod = require("../../utils/useGridApiMethod");

var _useGridLogger = require("../../utils/useGridLogger");

var _gridRowsSelector = require("./gridRowsSelector");

var _useGridApiEventHandler = require("../../utils/useGridApiEventHandler");

var _useGridVisibleRows = require("../../utils/useGridVisibleRows");

var _gridRowsUtils = require("./gridRowsUtils");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function getGridRowId(rowModel, getRowId, detailErrorMessage) {
  const id = getRowId ? getRowId(rowModel) : rowModel.id;
  (0, _gridRowsUtils.checkGridRowIdIsValid)(id, rowModel, detailErrorMessage);
  return id;
}

const convertGridRowsPropToState = ({
  prevState,
  rows,
  getRowId
}) => {
  let value;

  if (rows) {
    value = {
      idRowsLookup: {},
      ids: []
    };

    for (let i = 0; i < rows.length; i += 1) {
      const row = rows[i];
      const id = getGridRowId(row, getRowId);
      value.idRowsLookup[id] = row;
      value.ids.push(id);
    }
  } else {
    value = prevState.value;
  }

  return {
    value,
    rowsBeforePartialUpdates: rows != null ? rows : prevState.rowsBeforePartialUpdates
  };
};

const getRowsStateFromCache = (rowsCache, previousTree, apiRef, rowCountProp, loadingProp) => {
  const {
    value
  } = rowsCache.state;
  const rowCount = rowCountProp != null ? rowCountProp : 0;
  const groupingResponse = apiRef.current.unstable_applyStrategyProcessor('rowTreeCreation', (0, _extends2.default)({}, value, {
    previousTree
  }));
  const dataTopLevelRowCount = groupingResponse.treeDepth === 1 ? groupingResponse.ids.length : Object.values(groupingResponse.tree).filter(node => node.parent == null).length;
  return (0, _extends2.default)({}, groupingResponse, {
    loading: loadingProp,
    totalRowCount: Math.max(rowCount, groupingResponse.ids.length),
    totalTopLevelRowCount: Math.max(rowCount, dataTopLevelRowCount)
  });
};

const rowsStateInitializer = (state, props, apiRef) => {
  const rowsCache = {
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
  return (0, _extends2.default)({}, state, {
    rows: getRowsStateFromCache(rowsCache, null, apiRef, props.rowCount, props.loading),
    rowsCache // TODO remove from state

  });
};

exports.rowsStateInitializer = rowsStateInitializer;

const useGridRows = (apiRef, props) => {
  if (process.env.NODE_ENV !== 'production') {
    // Freeze rows for immutability
    Object.freeze(props.rows);
  }

  const logger = (0, _useGridLogger.useGridLogger)(apiRef, 'useGridRows');
  const rowsCache = React.useRef(apiRef.current.state.rowsCache); // To avoid listing rowsCache as useEffect dep

  const currentPage = (0, _useGridVisibleRows.useGridVisibleRows)(apiRef, props);
  const getRow = React.useCallback(id => {
    var _ref;

    return (_ref = (0, _gridRowsSelector.gridRowsLookupSelector)(apiRef)[id]) != null ? _ref : null;
  }, [apiRef]);
  const lookup = React.useMemo(() => currentPage.rows.reduce((acc, {
    id
  }, index) => {
    acc[id] = index;
    return acc;
  }, {}), [currentPage.rows]);
  const throttledRowsChange = React.useCallback((newState, throttle) => {
    const run = () => {
      rowsCache.current.timeout = null;
      rowsCache.current.lastUpdateMs = Date.now();
      apiRef.current.setState(state => (0, _extends2.default)({}, state, {
        rows: getRowsStateFromCache(rowsCache.current, (0, _gridRowsSelector.gridRowTreeSelector)(apiRef), apiRef, props.rowCount, props.loading)
      }));
      apiRef.current.publishEvent(_events.GridEvents.rowsSet);
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

    const throttleRemainingTimeMs = props.throttleRowsMs - (Date.now() - rowsCache.current.lastUpdateMs);

    if (throttleRemainingTimeMs > 0) {
      rowsCache.current.timeout = setTimeout(run, throttleRemainingTimeMs);
      return;
    }

    run();
  }, [props.throttleRowsMs, props.rowCount, props.loading, apiRef]);
  /**
   * API METHODS
   */

  const setRows = React.useCallback(rows => {
    logger.debug(`Updating all rows, new length ${rows.length}`);
    throttledRowsChange(convertGridRowsPropToState({
      rows,
      prevState: rowsCache.current.state,
      getRowId: props.getRowId
    }), true);
  }, [logger, props.getRowId, throttledRowsChange]);
  const updateRows = React.useCallback(updates => {
    if (props.signature === _useGridApiEventHandler.GridSignature.DataGrid && updates.length > 1) {
      // TODO: Add test with direct call to `apiRef.current.updateRows` in DataGrid after enabling the `apiRef` on the free plan.
      throw new Error(["MUI: You can't update several rows at once in `apiRef.current.updateRows` on the DataGrid.", 'You need to upgrade to the DataGridPro component to unlock this feature.'].join('\n'));
    } // we remove duplicate updates. A server can batch updates, and send several updates for the same row in one fn call.


    const uniqUpdates = new Map();
    updates.forEach(update => {
      const id = getGridRowId(update, props.getRowId, 'A row was provided without id when calling updateRows():');

      if (uniqUpdates.has(id)) {
        uniqUpdates.set(id, (0, _extends2.default)({}, uniqUpdates.get(id), update));
      } else {
        uniqUpdates.set(id, update);
      }
    });
    const deletedRowIds = [];
    const newStateValue = {
      idRowsLookup: (0, _extends2.default)({}, rowsCache.current.state.value.idRowsLookup),
      ids: [...rowsCache.current.state.value.ids]
    };
    uniqUpdates.forEach((partialRow, id) => {
      // eslint-disable-next-line no-underscore-dangle
      if (partialRow._action === 'delete') {
        delete newStateValue.idRowsLookup[id];
        deletedRowIds.push(id);
        return;
      }

      const oldRow = apiRef.current.getRow(id);

      if (!oldRow) {
        newStateValue.idRowsLookup[id] = partialRow;
        newStateValue.ids.push(id);
        return;
      }

      newStateValue.idRowsLookup[id] = (0, _extends2.default)({}, apiRef.current.getRow(id), partialRow);
    });

    if (deletedRowIds.length > 0) {
      newStateValue.ids = newStateValue.ids.filter(id => !deletedRowIds.includes(id));
    }

    const state = (0, _extends2.default)({}, rowsCache.current.state, {
      value: newStateValue
    });
    throttledRowsChange(state, true);
  }, [apiRef, props.getRowId, throttledRowsChange, props.signature]);
  const getRowModels = React.useCallback(() => {
    const allRows = (0, _gridRowsSelector.gridRowIdsSelector)(apiRef);
    const idRowsLookup = (0, _gridRowsSelector.gridRowsLookupSelector)(apiRef);
    return new Map(allRows.map(id => [id, idRowsLookup[id]]));
  }, [apiRef]);
  const getRowsCount = React.useCallback(() => (0, _gridRowsSelector.gridRowCountSelector)(apiRef), [apiRef]);
  const getAllRowIds = React.useCallback(() => (0, _gridRowsSelector.gridRowIdsSelector)(apiRef), [apiRef]);
  const getRowIndexRelativeToVisibleRows = React.useCallback(id => lookup[id], [lookup]);
  const setRowChildrenExpansion = React.useCallback((id, isExpanded) => {
    const currentNode = apiRef.current.getRowNode(id);

    if (!currentNode) {
      throw new Error(`MUI: No row with id #${id} found`);
    }

    const newNode = (0, _extends2.default)({}, currentNode, {
      childrenExpanded: isExpanded
    });
    apiRef.current.setState(state => {
      return (0, _extends2.default)({}, state, {
        rows: (0, _extends2.default)({}, state.rows, {
          tree: (0, _extends2.default)({}, state.rows.tree, {
            [id]: newNode
          })
        })
      });
    });
    apiRef.current.forceUpdate();
    apiRef.current.publishEvent(_events.GridEvents.rowExpansionChange, newNode);
  }, [apiRef]);
  const getRowNode = React.useCallback(id => {
    var _gridRowTreeSelector$;

    return (_gridRowTreeSelector$ = (0, _gridRowsSelector.gridRowTreeSelector)(apiRef)[id]) != null ? _gridRowTreeSelector$ : null;
  }, [apiRef]);
  const rowApi = {
    getRow,
    getRowModels,
    getRowsCount,
    getAllRowIds,
    setRows,
    updateRows,
    setRowChildrenExpansion,
    getRowNode,
    getRowIndexRelativeToVisibleRows
  };
  /**
   * EVENTS
   */

  const groupRows = React.useCallback(() => {
    logger.info(`Row grouping pre-processing have changed, regenerating the row tree`);
    let rows;

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
      rows,
      getRowId: props.getRowId,
      prevState: rowsCache.current.state
    }), false);
  }, [logger, throttledRowsChange, props.getRowId, props.rows]);
  const handleStrategyProcessorChange = React.useCallback(methodName => {
    if (methodName === 'rowTreeCreation') {
      groupRows();
    }
  }, [groupRows]);
  const handleStrategyActivityChange = React.useCallback(() => {
    // `rowTreeCreation` is the only processor ran when `strategyAvailabilityChange` is fired.
    // All the other processors listen to `rowsSet` which will be published by the `groupRows` method below.
    if (apiRef.current.unstable_getActiveStrategy('rowTree') !== (0, _gridRowsSelector.gridRowGroupingNameSelector)(apiRef)) {
      groupRows();
    }
  }, [apiRef, groupRows]);
  (0, _useGridApiEventHandler.useGridApiEventHandler)(apiRef, _events.GridEvents.activeStrategyProcessorChange, handleStrategyProcessorChange);
  (0, _useGridApiEventHandler.useGridApiEventHandler)(apiRef, _events.GridEvents.strategyAvailabilityChange, handleStrategyActivityChange);
  (0, _useGridApiMethod.useGridApiMethod)(apiRef, rowApi, 'GridRowApi');
  /**
   * EFFECTS
   */

  React.useEffect(() => {
    return () => {
      if (rowsCache.current.timeout !== null) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        clearTimeout(rowsCache.current.timeout);
      }
    };
  }, []); // The effect do not track any value defined synchronously during the 1st render by hooks called after `useGridRows`
  // As a consequence, the state generated by the 1st run of this useEffect will always be equal to the initialization one

  const isFirstRender = React.useRef(true);
  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    } // The new rows have already been applied (most likely in the `GridEvents.rowGroupsPreProcessingChange` listener)


    if (rowsCache.current.state.rowsBeforePartialUpdates === props.rows) {
      return;
    }

    logger.debug(`Updating all rows, new length ${props.rows.length}`);
    throttledRowsChange(convertGridRowsPropToState({
      rows: props.rows,
      getRowId: props.getRowId,
      prevState: rowsCache.current.state
    }), false);
  }, [props.rows, props.rowCount, props.getRowId, logger, throttledRowsChange]);
};

exports.useGridRows = useGridRows;