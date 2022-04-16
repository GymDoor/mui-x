import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import { GridEvents, useGridSelector, useGridApiEventHandler, useGridApiMethod } from '@mui/x-data-grid';
import { useGridRegisterPipeProcessor } from '@mui/x-data-grid/internals';
import { GRID_DETAIL_PANEL_TOGGLE_FIELD } from './gridDetailPanelToggleColDef';
import { gridDetailPanelExpandedRowIdsSelector, gridDetailPanelExpandedRowsContentCacheSelector, gridDetailPanelExpandedRowsHeightCacheSelector } from './gridDetailPanelSelector';
export var detailPanelStateInitializer = function detailPanelStateInitializer(state, props) {
  var _ref, _props$detailPanelExp, _props$initialState, _props$initialState$d;

  return _extends({}, state, {
    detailPanel: {
      expandedRowIds: (_ref = (_props$detailPanelExp = props.detailPanelExpandedRowIds) != null ? _props$detailPanelExp : (_props$initialState = props.initialState) == null ? void 0 : (_props$initialState$d = _props$initialState.detailPanel) == null ? void 0 : _props$initialState$d.expandedRowIds) != null ? _ref : []
    }
  });
};
export var useGridDetailPanel = function useGridDetailPanel(apiRef, props) {
  var expandedRowIds = useGridSelector(apiRef, gridDetailPanelExpandedRowIdsSelector);
  var contentCache = useGridSelector(apiRef, gridDetailPanelExpandedRowsContentCacheSelector);
  var handleCellClick = React.useCallback(function (params, event) {
    if (params.field !== GRID_DETAIL_PANEL_TOGGLE_FIELD || props.getDetailPanelContent == null) {
      return;
    }

    var content = contentCache[params.id];

    if (! /*#__PURE__*/React.isValidElement(content)) {
      return;
    } // Ignore if the user didn't click specifically in the "i" button


    if (event.target === event.currentTarget) {
      return;
    }

    apiRef.current.toggleDetailPanel(params.id);
  }, [apiRef, contentCache, props.getDetailPanelContent]);
  var handleCellKeyDown = React.useCallback(function (params, event) {
    if (!event.ctrlKey || event.key !== 'Enter' || props.getDetailPanelContent == null) {
      return;
    }

    apiRef.current.toggleDetailPanel(params.id);
  }, [apiRef, props.getDetailPanelContent]);
  useGridApiEventHandler(apiRef, GridEvents.cellClick, handleCellClick);
  useGridApiEventHandler(apiRef, GridEvents.cellKeyDown, handleCellKeyDown);
  var addDetailHeight = React.useCallback(function (initialValue, row) {
    var _heightCache$row$id;

    if (expandedRowIds.length === 0 || !expandedRowIds.includes(row.id)) {
      return _extends({}, initialValue, {
        detail: 0
      });
    }

    var heightCache = gridDetailPanelExpandedRowsHeightCacheSelector(apiRef.current.state);
    return _extends({}, initialValue, {
      detail: (_heightCache$row$id = heightCache[row.id]) != null ? _heightCache$row$id : 0 // Fallback to zero because the cache might not be ready yet (e.g. page was changed)

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
  var toggleDetailPanel = React.useCallback(function (id) {
    if (props.getDetailPanelContent == null) {
      return;
    }

    var content = contentCache[id];

    if (! /*#__PURE__*/React.isValidElement(content)) {
      return;
    }

    var ids = apiRef.current.getExpandedDetailPanels();
    apiRef.current.setExpandedDetailPanels(ids.includes(id) ? ids.filter(function (rowId) {
      return rowId !== id;
    }) : [].concat(_toConsumableArray(ids), [id]));
  }, [apiRef, contentCache, props.getDetailPanelContent]);
  var getExpandedDetailPanels = React.useCallback(function () {
    return gridDetailPanelExpandedRowIdsSelector(apiRef.current.state);
  }, [apiRef]);
  var setExpandedDetailPanels = React.useCallback(function (ids) {
    apiRef.current.setState(function (state) {
      return _extends({}, state, {
        detailPanel: _extends({}, state.detailPanel, {
          expandedRowIds: ids
        })
      });
    });
    apiRef.current.forceUpdate();
  }, [apiRef]);
  var detailPanelApi = {
    toggleDetailPanel: toggleDetailPanel,
    getExpandedDetailPanels: getExpandedDetailPanels,
    setExpandedDetailPanels: setExpandedDetailPanels
  };
  useGridApiMethod(apiRef, detailPanelApi, 'detailPanelApi');
  React.useEffect(function () {
    if (props.detailPanelExpandedRowIds) {
      var currentModel = gridDetailPanelExpandedRowIdsSelector(apiRef.current.state);

      if (currentModel !== props.detailPanelExpandedRowIds) {
        apiRef.current.setExpandedDetailPanels(props.detailPanelExpandedRowIds);
      }
    }
  }, [apiRef, props.detailPanelExpandedRowIds]);
};