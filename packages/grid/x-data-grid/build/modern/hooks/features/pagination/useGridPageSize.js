import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import { GridEvents } from '../../../models/events';
import { useGridLogger, useGridApiMethod, useGridApiEventHandler, useGridSelector } from '../../utils';
import { gridPageSizeSelector } from './gridPaginationSelector';
import { gridDensityRowHeightSelector } from '../density';
import { useGridRegisterPipeProcessor } from '../../core/pipeProcessing';
export const defaultPageSize = autoPageSize => autoPageSize ? 0 : 100;

const mergeStateWithPageSize = pageSize => state => _extends({}, state, {
  pagination: _extends({}, state.pagination, {
    pageSize
  })
});
/**
 * @requires useGridDimensions (event) - can be after
 */


export const useGridPageSize = (apiRef, props) => {
  const logger = useGridLogger(apiRef, 'useGridPageSize');
  const rowHeight = useGridSelector(apiRef, gridDensityRowHeightSelector);
  apiRef.current.unstable_updateControlState({
    stateId: 'pageSize',
    propModel: props.pageSize,
    propOnChange: props.onPageSizeChange,
    stateSelector: gridPageSizeSelector,
    changeEvent: GridEvents.pageSizeChange
  });
  /**
   * API METHODS
   */

  const setPageSize = React.useCallback(pageSize => {
    if (pageSize === gridPageSizeSelector(apiRef)) {
      return;
    }

    logger.debug(`Setting page size to ${pageSize}`);
    apiRef.current.setState(mergeStateWithPageSize(pageSize));
    apiRef.current.forceUpdate();
  }, [apiRef, logger]);
  const pageSizeApi = {
    setPageSize
  };
  useGridApiMethod(apiRef, pageSizeApi, 'GridPageSizeApi');
  /**
   * PRE-PROCESSING
   */

  const stateExportPreProcessing = React.useCallback(prevState => {
    const pageSizeToExport = gridPageSizeSelector(apiRef);
    const shouldExportPageSize = // Always export if the page size is controlled
    props.pageSize != null || // Always export if the page size has been initialized
    props.initialState?.pagination?.pageSize != null || // Export if the page size value is not equal to the default value
    pageSizeToExport !== defaultPageSize(props.autoPageSize);

    if (!shouldExportPageSize) {
      return prevState;
    }

    return _extends({}, prevState, {
      pagination: _extends({}, prevState.pagination, {
        pageSize: pageSizeToExport
      })
    });
  }, [apiRef, props.pageSize, props.initialState?.pagination?.pageSize, props.autoPageSize]);
  /**
   * TODO: Add error if `prop.autoHeight = true`
   */

  const stateRestorePreProcessing = React.useCallback((params, context) => {
    const pageSize = context.stateToRestore.pagination?.pageSize;

    if (pageSize != null) {
      apiRef.current.setState(mergeStateWithPageSize(pageSize));
    }

    return params;
  }, [apiRef]);
  useGridRegisterPipeProcessor(apiRef, 'exportState', stateExportPreProcessing);
  useGridRegisterPipeProcessor(apiRef, 'restoreState', stateRestorePreProcessing);
  /**
   * EVENTS
   */

  const handleUpdateAutoPageSize = React.useCallback(() => {
    const dimensions = apiRef.current.getRootDimensions();

    if (!props.autoPageSize || !dimensions) {
      return;
    }

    const maximumPageSizeWithoutScrollBar = Math.floor(dimensions.viewportInnerSize.height / rowHeight);
    apiRef.current.setPageSize(maximumPageSizeWithoutScrollBar);
  }, [apiRef, props.autoPageSize, rowHeight]);
  useGridApiEventHandler(apiRef, GridEvents.viewportInnerSizeChange, handleUpdateAutoPageSize);
  /**
   * EFFECTS
   */

  React.useEffect(() => {
    if (props.pageSize != null && !props.autoPageSize) {
      apiRef.current.setPageSize(props.pageSize);
    }
  }, [apiRef, props.autoPageSize, props.pageSize]);
  React.useEffect(() => {
    handleUpdateAutoPageSize();
  }, [handleUpdateAutoPageSize]);
};