import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import { GridEvents } from '../../../models/events';
import { GridFeatureModeConstant } from '../../../models/gridFeatureMode';
import { useGridApiEventHandler } from '../../utils/useGridApiEventHandler';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { useGridLogger } from '../../utils/useGridLogger';
import { gridFilterableColumnLookupSelector } from '../columns/gridColumnsSelector';
import { GridPreferencePanelsValue } from '../preferencesPanel/gridPreferencePanelsValue';
import { getDefaultGridFilterModel } from './gridFilterState';
import { gridFilterModelSelector, gridVisibleSortedRowEntriesSelector } from './gridFilterSelector';
import { useFirstRender } from '../../utils/useFirstRender';
import { gridRowIdsSelector } from '../rows';
import { useGridRegisterPipeProcessor } from '../../core/pipeProcessing';
import { GRID_DEFAULT_STRATEGY, useGridRegisterStrategyProcessor } from '../../core/strategyProcessing';
import { buildAggregatedFilterApplier, sanitizeFilterModel, mergeStateWithFilterModel } from './gridFilterUtils';
import { jsx as _jsx } from "react/jsx-runtime";
export const filterStateInitializer = (state, props, apiRef) => {
  const filterModel = props.filterModel ?? props.initialState?.filter?.filterModel ?? getDefaultGridFilterModel();
  return _extends({}, state, {
    filter: {
      filterModel: sanitizeFilterModel(filterModel, props.disableMultipleColumnsFiltering, apiRef),
      visibleRowsLookup: {},
      filteredDescendantCountLookup: {}
    }
  });
};
/**
 * @requires useGridColumns (method, event)
 * @requires useGridParamsApi (method)
 * @requires useGridRows (event)
 */

export const useGridFilter = (apiRef, props) => {
  const logger = useGridLogger(apiRef, 'useGridFilter');
  apiRef.current.unstable_updateControlState({
    stateId: 'filter',
    propModel: props.filterModel,
    propOnChange: props.onFilterModelChange,
    stateSelector: gridFilterModelSelector,
    changeEvent: GridEvents.filterModelChange
  });
  const updateFilteredRows = React.useCallback(() => {
    apiRef.current.setState(state => {
      const filterModel = gridFilterModelSelector(state, apiRef.current.instanceId);
      const isRowMatchingFilters = props.filterMode === GridFeatureModeConstant.client ? buildAggregatedFilterApplier(filterModel, apiRef) : null;
      const filteringResult = apiRef.current.unstable_applyStrategyProcessor('filtering', {
        isRowMatchingFilters
      });
      return _extends({}, state, {
        filter: _extends({}, state.filter, filteringResult)
      });
    });
    apiRef.current.publishEvent(GridEvents.filteredRowsSet);
  }, [props.filterMode, apiRef]);
  /**
   * API METHODS
   */

  const applyFilters = React.useCallback(() => {
    updateFilteredRows();
    apiRef.current.forceUpdate();
  }, [apiRef, updateFilteredRows]);
  const upsertFilterItem = React.useCallback(item => {
    const filterModel = gridFilterModelSelector(apiRef);
    const items = [...filterModel.items];
    const itemIndex = items.findIndex(filterItem => filterItem.id === item.id);

    if (itemIndex === -1) {
      items.push(item);
    } else {
      items[itemIndex] = item;
    }

    apiRef.current.setFilterModel(_extends({}, filterModel, {
      items
    }));
  }, [apiRef]);
  const deleteFilterItem = React.useCallback(itemToDelete => {
    const filterModel = gridFilterModelSelector(apiRef);
    const items = filterModel.items.filter(item => item.id !== itemToDelete.id);

    if (items.length === filterModel.items.length) {
      return;
    }

    apiRef.current.setFilterModel(_extends({}, filterModel, {
      items
    }));
  }, [apiRef]);
  const showFilterPanel = React.useCallback(targetColumnField => {
    logger.debug('Displaying filter panel');

    if (targetColumnField) {
      const filterModel = gridFilterModelSelector(apiRef);
      const filterItemsWithValue = filterModel.items.filter(item => item.value !== undefined);
      let newFilterItems;
      const filterItemOnTarget = filterItemsWithValue.find(item => item.columnField === targetColumnField);

      if (filterItemOnTarget) {
        newFilterItems = filterItemsWithValue;
      } else if (props.disableMultipleColumnsFiltering) {
        newFilterItems = [{
          columnField: targetColumnField
        }];
      } else {
        newFilterItems = [...filterItemsWithValue, {
          columnField: targetColumnField
        }];
      }

      apiRef.current.setFilterModel(_extends({}, filterModel, {
        items: newFilterItems
      }));
    }

    apiRef.current.showPreferences(GridPreferencePanelsValue.filters);
  }, [apiRef, logger, props.disableMultipleColumnsFiltering]);
  const hideFilterPanel = React.useCallback(() => {
    logger.debug('Hiding filter panel');
    apiRef.current.hidePreferences();
  }, [apiRef, logger]);
  const setFilterLinkOperator = React.useCallback(linkOperator => {
    const filterModel = gridFilterModelSelector(apiRef);

    if (filterModel.linkOperator === linkOperator) {
      return;
    }

    apiRef.current.setFilterModel(_extends({}, filterModel, {
      linkOperator
    }));
  }, [apiRef]);
  const setFilterModel = React.useCallback(model => {
    const currentModel = gridFilterModelSelector(apiRef);

    if (currentModel !== model) {
      logger.debug('Setting filter model');
      apiRef.current.setState(mergeStateWithFilterModel(model, props.disableMultipleColumnsFiltering, apiRef));
      apiRef.current.unstable_applyFilters();
    }
  }, [apiRef, logger, props.disableMultipleColumnsFiltering]);
  const getVisibleRowModels = React.useCallback(() => {
    const visibleSortedRows = gridVisibleSortedRowEntriesSelector(apiRef);
    return new Map(visibleSortedRows.map(row => [row.id, row.model]));
  }, [apiRef]);
  const filterApi = {
    setFilterLinkOperator,
    unstable_applyFilters: applyFilters,
    deleteFilterItem,
    upsertFilterItem,
    setFilterModel,
    showFilterPanel,
    hideFilterPanel,
    getVisibleRowModels
  };
  useGridApiMethod(apiRef, filterApi, 'GridFilterApi');
  /**
   * PRE-PROCESSING
   */

  const stateExportPreProcessing = React.useCallback(prevState => {
    const filterModelToExport = gridFilterModelSelector(apiRef);

    if (filterModelToExport.items.length === 0 && filterModelToExport.linkOperator === getDefaultGridFilterModel().linkOperator) {
      return prevState;
    }

    return _extends({}, prevState, {
      filter: {
        filterModel: filterModelToExport
      }
    });
  }, [apiRef]);
  const stateRestorePreProcessing = React.useCallback((params, context) => {
    const filterModel = context.stateToRestore.filter?.filterModel;

    if (filterModel == null) {
      return params;
    }

    apiRef.current.setState(mergeStateWithFilterModel(filterModel, props.disableMultipleColumnsFiltering, apiRef));
    return _extends({}, params, {
      callbacks: [...params.callbacks, apiRef.current.unstable_applyFilters]
    });
  }, [apiRef, props.disableMultipleColumnsFiltering]);
  const preferencePanelPreProcessing = React.useCallback((initialValue, value) => {
    if (value === GridPreferencePanelsValue.filters) {
      const FilterPanel = props.components.FilterPanel;
      return /*#__PURE__*/_jsx(FilterPanel, _extends({}, props.componentsProps?.filterPanel));
    }

    return initialValue;
  }, [props.components.FilterPanel, props.componentsProps?.filterPanel]);
  const flatFilteringMethod = React.useCallback(params => {
    if (props.filterMode === GridFeatureModeConstant.client && params.isRowMatchingFilters) {
      const rowIds = gridRowIdsSelector(apiRef);
      const filteredRowsLookup = {};

      for (let i = 0; i < rowIds.length; i += 1) {
        const rowId = rowIds[i];
        filteredRowsLookup[rowId] = params.isRowMatchingFilters(rowId);
      }

      return {
        filteredRowsLookup,
        // For flat tree, the `visibleRowsLookup` and the `filteredRowsLookup` since no row is collapsed.
        visibleRowsLookup: filteredRowsLookup,
        filteredDescendantCountLookup: {}
      };
    }

    return {
      visibleRowsLookup: {},
      filteredRowsLookup: {},
      filteredDescendantCountLookup: {}
    };
  }, [apiRef, props.filterMode]);
  useGridRegisterPipeProcessor(apiRef, 'exportState', stateExportPreProcessing);
  useGridRegisterPipeProcessor(apiRef, 'restoreState', stateRestorePreProcessing);
  useGridRegisterPipeProcessor(apiRef, 'preferencePanel', preferencePanelPreProcessing);
  useGridRegisterStrategyProcessor(apiRef, GRID_DEFAULT_STRATEGY, 'filtering', flatFilteringMethod);
  /**
   * EVENTS
   */

  const handleColumnsChange = React.useCallback(() => {
    logger.debug('onColUpdated - GridColumns changed, applying filters');
    const filterModel = gridFilterModelSelector(apiRef);
    const filterableColumnsLookup = gridFilterableColumnLookupSelector(apiRef);
    const newFilterItems = filterModel.items.filter(item => item.columnField && filterableColumnsLookup[item.columnField]);

    if (newFilterItems.length < filterModel.items.length) {
      apiRef.current.setFilterModel(_extends({}, filterModel, {
        items: newFilterItems
      }));
    }
  }, [apiRef, logger]);
  const handleStrategyProcessorChange = React.useCallback(methodName => {
    if (methodName === 'filtering') {
      apiRef.current.unstable_applyFilters();
    }
  }, [apiRef]); // Do not call `apiRef.current.forceUpdate` to avoid re-render before updating the sorted rows.
  // Otherwise, the state is not consistent during the render

  useGridApiEventHandler(apiRef, GridEvents.rowsSet, updateFilteredRows);
  useGridApiEventHandler(apiRef, GridEvents.rowExpansionChange, apiRef.current.unstable_applyFilters);
  useGridApiEventHandler(apiRef, GridEvents.columnsChange, handleColumnsChange);
  useGridApiEventHandler(apiRef, GridEvents.activeStrategyProcessorChange, handleStrategyProcessorChange);
  /**
   * 1ST RENDER
   */

  useFirstRender(() => {
    apiRef.current.unstable_applyFilters();
  });
  /**
   * EFFECTS
   */

  React.useEffect(() => {
    if (props.filterModel !== undefined) {
      apiRef.current.setFilterModel(props.filterModel);
    }
  }, [apiRef, logger, props.filterModel]);
};