import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import { GridEvents } from '../../../models/events';
import { GridFeatureModeConstant } from '../../../models/gridFeatureMode';
import { isEnterKey } from '../../../utils/keyboardUtils';
import { useGridApiEventHandler } from '../../utils/useGridApiEventHandler';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { useGridLogger } from '../../utils/useGridLogger';
import { gridColumnLookupSelector } from '../columns/gridColumnsSelector';
import { gridSortedRowEntriesSelector, gridSortedRowIdsSelector, gridSortModelSelector } from './gridSortingSelector';
import { gridRowIdsSelector, gridRowTreeSelector } from '../rows';
import { useFirstRender } from '../../utils/useFirstRender';
import { useGridRegisterStrategyProcessor, GRID_DEFAULT_STRATEGY } from '../../core/strategyProcessing';
import { buildAggregatedSortingApplier, mergeStateWithSortModel, getNextGridSortDirection, sanitizeSortModel } from './gridSortingUtils';
import { useGridRegisterPipeProcessor } from '../../core/pipeProcessing';
export const sortingStateInitializer = (state, props) => {
  const sortModel = props.sortModel ?? props.initialState?.sorting?.sortModel ?? [];
  return _extends({}, state, {
    sorting: {
      sortModel: sanitizeSortModel(sortModel, props.disableMultipleColumnsSorting),
      sortedRows: []
    }
  });
};
/**
 * @requires useGridRows (event)
 * @requires useGridColumns (event)
 */

export const useGridSorting = (apiRef, props) => {
  const logger = useGridLogger(apiRef, 'useGridSorting');
  apiRef.current.unstable_updateControlState({
    stateId: 'sortModel',
    propModel: props.sortModel,
    propOnChange: props.onSortModelChange,
    stateSelector: gridSortModelSelector,
    changeEvent: GridEvents.sortModelChange
  });
  const upsertSortModel = React.useCallback((field, sortItem) => {
    const sortModel = gridSortModelSelector(apiRef);
    const existingIdx = sortModel.findIndex(c => c.field === field);
    let newSortModel = [...sortModel];

    if (existingIdx > -1) {
      if (!sortItem) {
        newSortModel.splice(existingIdx, 1);
      } else {
        newSortModel.splice(existingIdx, 1, sortItem);
      }
    } else {
      newSortModel = [...sortModel, sortItem];
    }

    return newSortModel;
  }, [apiRef]);
  const createSortItem = React.useCallback((col, directionOverride) => {
    const sortModel = gridSortModelSelector(apiRef);
    const existing = sortModel.find(c => c.field === col.field);

    if (existing) {
      const nextSort = directionOverride === undefined ? getNextGridSortDirection(col.sortingOrder ?? props.sortingOrder, existing.sort) : directionOverride;
      return nextSort == null ? undefined : _extends({}, existing, {
        sort: nextSort
      });
    }

    return {
      field: col.field,
      sort: directionOverride === undefined ? getNextGridSortDirection(col.sortingOrder ?? props.sortingOrder) : directionOverride
    };
  }, [apiRef, props.sortingOrder]);
  /**
   * API METHODS
   */

  const applySorting = React.useCallback(() => {
    apiRef.current.setState(state => {
      if (props.sortingMode === GridFeatureModeConstant.server) {
        logger.debug('Skipping sorting rows as sortingMode = server');
        return _extends({}, state, {
          sorting: _extends({}, state.sorting, {
            sortedRows: gridRowIdsSelector(state, apiRef.current.instanceId)
          })
        });
      }

      const sortModel = gridSortModelSelector(state, apiRef.current.instanceId);
      const sortRowList = buildAggregatedSortingApplier(sortModel, apiRef);
      const sortedRows = apiRef.current.unstable_applyStrategyProcessor('sorting', {
        sortRowList
      });
      return _extends({}, state, {
        sorting: _extends({}, state.sorting, {
          sortedRows
        })
      });
    });
    apiRef.current.publishEvent(GridEvents.sortedRowsSet);
    apiRef.current.forceUpdate();
  }, [apiRef, logger, props.sortingMode]);
  const setSortModel = React.useCallback(model => {
    const currentModel = gridSortModelSelector(apiRef);

    if (currentModel !== model) {
      logger.debug(`Setting sort model`);
      apiRef.current.setState(mergeStateWithSortModel(model, props.disableMultipleColumnsSorting));
      apiRef.current.forceUpdate();
      apiRef.current.applySorting();
    }
  }, [apiRef, logger, props.disableMultipleColumnsSorting]);
  const sortColumn = React.useCallback((column, direction, allowMultipleSorting) => {
    if (!column.sortable) {
      return;
    }

    const sortItem = createSortItem(column, direction);
    let sortModel;

    if (!allowMultipleSorting || props.disableMultipleColumnsSorting) {
      sortModel = !sortItem ? [] : [sortItem];
    } else {
      sortModel = upsertSortModel(column.field, sortItem);
    }

    apiRef.current.setSortModel(sortModel);
  }, [apiRef, upsertSortModel, createSortItem, props.disableMultipleColumnsSorting]);
  const getSortModel = React.useCallback(() => gridSortModelSelector(apiRef), [apiRef]);
  const getSortedRows = React.useCallback(() => {
    const sortedRows = gridSortedRowEntriesSelector(apiRef);
    return sortedRows.map(row => row.model);
  }, [apiRef]);
  const getSortedRowIds = React.useCallback(() => gridSortedRowIdsSelector(apiRef), [apiRef]);
  const getRowIndex = React.useCallback(id => apiRef.current.getSortedRowIds().indexOf(id), [apiRef]);
  const getRowIdFromRowIndex = React.useCallback(index => apiRef.current.getSortedRowIds()[index], [apiRef]);
  const sortApi = {
    getSortModel,
    getSortedRows,
    getSortedRowIds,
    getRowIndex,
    getRowIdFromRowIndex,
    setSortModel,
    sortColumn,
    applySorting
  };
  useGridApiMethod(apiRef, sortApi, 'GridSortApi');
  /**
   * PRE-PROCESSING
   */

  const stateExportPreProcessing = React.useCallback(prevState => {
    const sortModelToExport = gridSortModelSelector(apiRef);

    if (sortModelToExport.length === 0) {
      return prevState;
    }

    return _extends({}, prevState, {
      sorting: {
        sortModel: sortModelToExport
      }
    });
  }, [apiRef]);
  const stateRestorePreProcessing = React.useCallback((params, context) => {
    const sortModel = context.stateToRestore.sorting?.sortModel;

    if (sortModel == null) {
      return params;
    }

    apiRef.current.setState(mergeStateWithSortModel(sortModel, props.disableMultipleColumnsSorting));
    return _extends({}, params, {
      callbacks: [...params.callbacks, apiRef.current.applySorting]
    });
  }, [apiRef, props.disableMultipleColumnsSorting]);
  const flatSortingMethod = React.useCallback(params => {
    if (!params.sortRowList) {
      return gridRowIdsSelector(apiRef);
    }

    const rowTree = gridRowTreeSelector(apiRef);
    return params.sortRowList(Object.values(rowTree));
  }, [apiRef]);
  useGridRegisterPipeProcessor(apiRef, 'exportState', stateExportPreProcessing);
  useGridRegisterPipeProcessor(apiRef, 'restoreState', stateRestorePreProcessing);
  useGridRegisterStrategyProcessor(apiRef, GRID_DEFAULT_STRATEGY, 'sorting', flatSortingMethod);
  /**
   * EVENTS
   */

  const handleColumnHeaderClick = React.useCallback(({
    colDef
  }, event) => {
    const allowMultipleSorting = event.shiftKey || event.metaKey || event.ctrlKey;
    sortColumn(colDef, undefined, allowMultipleSorting);
  }, [sortColumn]);
  const handleColumnHeaderKeyDown = React.useCallback(({
    colDef
  }, event) => {
    // CTRL + Enter opens the column menu
    if (isEnterKey(event.key) && !event.ctrlKey && !event.metaKey) {
      sortColumn(colDef, undefined, event.shiftKey);
    }
  }, [sortColumn]);
  const handleColumnsChange = React.useCallback(() => {
    // When the columns change we check that the sorted columns are still part of the dataset
    const sortModel = gridSortModelSelector(apiRef);
    const latestColumns = gridColumnLookupSelector(apiRef);

    if (sortModel.length > 0) {
      const newModel = sortModel.filter(sortItem => latestColumns[sortItem.field]);

      if (newModel.length < sortModel.length) {
        apiRef.current.setSortModel(newModel);
      }
    }
  }, [apiRef]);
  const handleStrategyProcessorChange = React.useCallback(methodName => {
    if (methodName === 'sorting') {
      apiRef.current.applySorting();
    }
  }, [apiRef]);
  useGridApiEventHandler(apiRef, GridEvents.columnHeaderClick, handleColumnHeaderClick);
  useGridApiEventHandler(apiRef, GridEvents.columnHeaderKeyDown, handleColumnHeaderKeyDown);
  useGridApiEventHandler(apiRef, GridEvents.rowsSet, apiRef.current.applySorting);
  useGridApiEventHandler(apiRef, GridEvents.columnsChange, handleColumnsChange);
  useGridApiEventHandler(apiRef, GridEvents.activeStrategyProcessorChange, handleStrategyProcessorChange);
  /**
   * 1ST RENDER
   */

  useFirstRender(() => {
    apiRef.current.applySorting();
  });
  /**
   * EFFECTS
   */

  React.useEffect(() => {
    if (props.sortModel !== undefined) {
      apiRef.current.setSortModel(props.sortModel);
    }
  }, [apiRef, props.sortModel]);
};