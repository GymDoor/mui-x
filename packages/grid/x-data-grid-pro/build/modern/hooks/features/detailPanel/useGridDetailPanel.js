import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import { GridEvents, useGridSelector, useGridApiEventHandler, useGridApiMethod } from '@mui/x-data-grid';
import { useGridRegisterPipeProcessor } from '@mui/x-data-grid/internals';
import { GRID_DETAIL_PANEL_TOGGLE_FIELD } from './gridDetailPanelToggleColDef';
import { gridDetailPanelExpandedRowIdsSelector, gridDetailPanelExpandedRowsContentCacheSelector, gridDetailPanelExpandedRowsHeightCacheSelector } from './gridDetailPanelSelector';
export const detailPanelStateInitializer = (state, props) => {
  return _extends({}, state, {
    detailPanel: {
      expandedRowIds: props.detailPanelExpandedRowIds ?? props.initialState?.detailPanel?.expandedRowIds ?? []
    }
  });
};
export const useGridDetailPanel = (apiRef, props) => {
  const expandedRowIds = useGridSelector(apiRef, gridDetailPanelExpandedRowIdsSelector);
  const contentCache = useGridSelector(apiRef, gridDetailPanelExpandedRowsContentCacheSelector);
  const handleCellClick = React.useCallback((params, event) => {
    if (params.field !== GRID_DETAIL_PANEL_TOGGLE_FIELD || props.getDetailPanelContent == null) {
      return;
    }

    const content = contentCache[params.id];

    if (! /*#__PURE__*/React.isValidElement(content)) {
      return;
    } // Ignore if the user didn't click specifically in the "i" button


    if (event.target === event.currentTarget) {
      return;
    }

    apiRef.current.toggleDetailPanel(params.id);
  }, [apiRef, contentCache, props.getDetailPanelContent]);
  const handleCellKeyDown = React.useCallback((params, event) => {
    if (!event.ctrlKey || event.key !== 'Enter' || props.getDetailPanelContent == null) {
      return;
    }

    apiRef.current.toggleDetailPanel(params.id);
  }, [apiRef, props.getDetailPanelContent]);
  useGridApiEventHandler(apiRef, GridEvents.cellClick, handleCellClick);
  useGridApiEventHandler(apiRef, GridEvents.cellKeyDown, handleCellKeyDown);
  const addDetailHeight = React.useCallback((initialValue, row) => {
    if (expandedRowIds.length === 0 || !expandedRowIds.includes(row.id)) {
      return _extends({}, initialValue, {
        detail: 0
      });
    }

    const heightCache = gridDetailPanelExpandedRowsHeightCacheSelector(apiRef.current.state);
    return _extends({}, initialValue, {
      detail: heightCache[row.id] ?? 0 // Fallback to zero because the cache might not be ready yet (e.g. page was changed)

    });
  }, [apiRef, expandedRowIds]);
  useGridRegisterPipeProcessor(apiRef, 'rowHeight', addDetailHeight);
  apiRef.current.unstable_updateControlState({
    stateId: 'detailPanels',
    propModel: props.detailPanelExpandedRowIds,
    propOnChange: props.onDetailPanelExpandedRowIdsChange,
    stateSelector: gridDetailPanelExpandedRowIdsSelector,
    changeEvent: GridEvents.detailPanelsExpandedRowIdsChange
  });
  const toggleDetailPanel = React.useCallback(id => {
    if (props.getDetailPanelContent == null) {
      return;
    }

    const content = contentCache[id];

    if (! /*#__PURE__*/React.isValidElement(content)) {
      return;
    }

    const ids = apiRef.current.getExpandedDetailPanels();
    apiRef.current.setExpandedDetailPanels(ids.includes(id) ? ids.filter(rowId => rowId !== id) : [...ids, id]);
  }, [apiRef, contentCache, props.getDetailPanelContent]);
  const getExpandedDetailPanels = React.useCallback(() => gridDetailPanelExpandedRowIdsSelector(apiRef.current.state), [apiRef]);
  const setExpandedDetailPanels = React.useCallback(ids => {
    apiRef.current.setState(state => {
      return _extends({}, state, {
        detailPanel: _extends({}, state.detailPanel, {
          expandedRowIds: ids
        })
      });
    });
    apiRef.current.forceUpdate();
  }, [apiRef]);
  const detailPanelApi = {
    toggleDetailPanel,
    getExpandedDetailPanels,
    setExpandedDetailPanels
  };
  useGridApiMethod(apiRef, detailPanelApi, 'detailPanelApi');
  React.useEffect(() => {
    if (props.detailPanelExpandedRowIds) {
      const currentModel = gridDetailPanelExpandedRowIdsSelector(apiRef.current.state);

      if (currentModel !== props.detailPanelExpandedRowIds) {
        apiRef.current.setExpandedDetailPanels(props.detailPanelExpandedRowIds);
      }
    }
  }, [apiRef, props.detailPanelExpandedRowIds]);
};