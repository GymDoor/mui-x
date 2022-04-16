"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useGridDetailPanel = exports.detailPanelStateInitializer = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var React = _interopRequireWildcard(require("react"));

var _xDataGrid = require("@mui/x-data-grid");

var _internals = require("@mui/x-data-grid/internals");

var _gridDetailPanelToggleColDef = require("./gridDetailPanelToggleColDef");

var _gridDetailPanelSelector = require("./gridDetailPanelSelector");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const detailPanelStateInitializer = (state, props) => {
  var _ref, _props$detailPanelExp, _props$initialState, _props$initialState$d;

  return (0, _extends2.default)({}, state, {
    detailPanel: {
      expandedRowIds: (_ref = (_props$detailPanelExp = props.detailPanelExpandedRowIds) != null ? _props$detailPanelExp : (_props$initialState = props.initialState) == null ? void 0 : (_props$initialState$d = _props$initialState.detailPanel) == null ? void 0 : _props$initialState$d.expandedRowIds) != null ? _ref : []
    }
  });
};

exports.detailPanelStateInitializer = detailPanelStateInitializer;

const useGridDetailPanel = (apiRef, props) => {
  const expandedRowIds = (0, _xDataGrid.useGridSelector)(apiRef, _gridDetailPanelSelector.gridDetailPanelExpandedRowIdsSelector);
  const contentCache = (0, _xDataGrid.useGridSelector)(apiRef, _gridDetailPanelSelector.gridDetailPanelExpandedRowsContentCacheSelector);
  const handleCellClick = React.useCallback((params, event) => {
    if (params.field !== _gridDetailPanelToggleColDef.GRID_DETAIL_PANEL_TOGGLE_FIELD || props.getDetailPanelContent == null) {
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
  (0, _xDataGrid.useGridApiEventHandler)(apiRef, _xDataGrid.GridEvents.cellClick, handleCellClick);
  (0, _xDataGrid.useGridApiEventHandler)(apiRef, _xDataGrid.GridEvents.cellKeyDown, handleCellKeyDown);
  const addDetailHeight = React.useCallback((initialValue, row) => {
    var _heightCache$row$id;

    if (expandedRowIds.length === 0 || !expandedRowIds.includes(row.id)) {
      return (0, _extends2.default)({}, initialValue, {
        detail: 0
      });
    }

    const heightCache = (0, _gridDetailPanelSelector.gridDetailPanelExpandedRowsHeightCacheSelector)(apiRef.current.state);
    return (0, _extends2.default)({}, initialValue, {
      detail: (_heightCache$row$id = heightCache[row.id]) != null ? _heightCache$row$id : 0 // Fallback to zero because the cache might not be ready yet (e.g. page was changed)

    });
  }, [apiRef, expandedRowIds]);
  (0, _internals.useGridRegisterPipeProcessor)(apiRef, 'rowHeight', addDetailHeight);
  apiRef.current.unstable_updateControlState({
    stateId: 'detailPanels',
    propModel: props.detailPanelExpandedRowIds,
    propOnChange: props.onDetailPanelExpandedRowIdsChange,
    stateSelector: _gridDetailPanelSelector.gridDetailPanelExpandedRowIdsSelector,
    changeEvent: _xDataGrid.GridEvents.detailPanelsExpandedRowIdsChange
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
  const getExpandedDetailPanels = React.useCallback(() => (0, _gridDetailPanelSelector.gridDetailPanelExpandedRowIdsSelector)(apiRef.current.state), [apiRef]);
  const setExpandedDetailPanels = React.useCallback(ids => {
    apiRef.current.setState(state => {
      return (0, _extends2.default)({}, state, {
        detailPanel: (0, _extends2.default)({}, state.detailPanel, {
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
  (0, _xDataGrid.useGridApiMethod)(apiRef, detailPanelApi, 'detailPanelApi');
  React.useEffect(() => {
    if (props.detailPanelExpandedRowIds) {
      const currentModel = (0, _gridDetailPanelSelector.gridDetailPanelExpandedRowIdsSelector)(apiRef.current.state);

      if (currentModel !== props.detailPanelExpandedRowIds) {
        apiRef.current.setExpandedDetailPanels(props.detailPanelExpandedRowIds);
      }
    }
  }, [apiRef, props.detailPanelExpandedRowIds]);
};

exports.useGridDetailPanel = useGridDetailPanel;