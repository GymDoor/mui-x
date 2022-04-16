"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useDataGridProComponent = void 0;

var _internals = require("@mui/x-data-grid/internals");

var _useGridInfiniteLoader = require("../hooks/features/infiniteLoader/useGridInfiniteLoader");

var _useGridColumnReorder = require("../hooks/features/columnReorder/useGridColumnReorder");

var _useGridColumnResize = require("../hooks/features/columnResize/useGridColumnResize");

var _useGridTreeData = require("../hooks/features/treeData/useGridTreeData");

var _useGridTreeDataPreProcessors = require("../hooks/features/treeData/useGridTreeDataPreProcessors");

var _useGridRowGrouping = require("../hooks/features/rowGrouping/useGridRowGrouping");

var _useGridRowGroupingPreProcessors = require("../hooks/features/rowGrouping/useGridRowGroupingPreProcessors");

var _useGridColumnPinning = require("../hooks/features/columnPinning/useGridColumnPinning");

var _useGridColumnPinningPreProcessors = require("../hooks/features/columnPinning/useGridColumnPinningPreProcessors");

var _useGridDetailPanel = require("../hooks/features/detailPanel/useGridDetailPanel");

var _useGridDetailPanelCache = require("../hooks/features/detailPanel/useGridDetailPanelCache");

var _useGridDetailPanelPreProcessors = require("../hooks/features/detailPanel/useGridDetailPanelPreProcessors");

// Pro-only features
const useDataGridProComponent = (inputApiRef, props) => {
  var _props$experimentalFe, _props$experimentalFe2;

  const apiRef = (0, _internals.useGridInitialization)(inputApiRef, props);
  /**
   * Register all pre-processors called during state initialization here.
   */

  (0, _internals.useGridSelectionPreProcessors)(apiRef, props);
  (0, _useGridRowGroupingPreProcessors.useGridRowGroupingPreProcessors)(apiRef, props);
  (0, _useGridTreeDataPreProcessors.useGridTreeDataPreProcessors)(apiRef, props);
  (0, _useGridDetailPanelPreProcessors.useGridDetailPanelPreProcessors)(apiRef, props); // The column pinning `hydrateColumns` pre-processor must be after every other `hydrateColumns` pre-processors
  // Because it changes the order of the columns.

  (0, _useGridColumnPinningPreProcessors.useGridColumnPinningPreProcessors)(apiRef, props);
  (0, _internals.useGridRowsPreProcessors)(apiRef);
  /**
   * Register all state initializers here.
   */

  (0, _internals.useGridInitializeState)(_useGridRowGrouping.rowGroupingStateInitializer, apiRef, props);
  (0, _internals.useGridInitializeState)(_internals.selectionStateInitializer, apiRef, props);
  (0, _internals.useGridInitializeState)(_useGridDetailPanel.detailPanelStateInitializer, apiRef, props);
  (0, _internals.useGridInitializeState)(_useGridColumnPinning.columnPinningStateInitializer, apiRef, props);
  (0, _internals.useGridInitializeState)(_internals.columnsStateInitializer, apiRef, props);
  (0, _internals.useGridInitializeState)(_internals.rowsStateInitializer, apiRef, props);
  (0, _internals.useGridInitializeState)((_props$experimentalFe = props.experimentalFeatures) != null && _props$experimentalFe.newEditingApi ? _internals.editingStateInitializer_new : _internals.editingStateInitializer_old, apiRef, props);
  (0, _internals.useGridInitializeState)(_internals.focusStateInitializer, apiRef, props);
  (0, _internals.useGridInitializeState)(_internals.sortingStateInitializer, apiRef, props);
  (0, _internals.useGridInitializeState)(_internals.preferencePanelStateInitializer, apiRef, props);
  (0, _internals.useGridInitializeState)(_internals.filterStateInitializer, apiRef, props);
  (0, _internals.useGridInitializeState)(_internals.densityStateInitializer, apiRef, props);
  (0, _internals.useGridInitializeState)(_useGridColumnReorder.columnReorderStateInitializer, apiRef, props);
  (0, _internals.useGridInitializeState)(_useGridColumnResize.columnResizeStateInitializer, apiRef, props);
  (0, _internals.useGridInitializeState)(_internals.paginationStateInitializer, apiRef, props);
  (0, _internals.useGridInitializeState)(_internals.rowsMetaStateInitializer, apiRef, props);
  (0, _internals.useGridInitializeState)(_internals.columnMenuStateInitializer, apiRef, props);
  (0, _useGridRowGrouping.useGridRowGrouping)(apiRef, props);
  (0, _useGridTreeData.useGridTreeData)(apiRef);
  (0, _internals.useGridKeyboardNavigation)(apiRef, props);
  (0, _internals.useGridSelection)(apiRef, props);
  (0, _useGridDetailPanel.useGridDetailPanel)(apiRef, props);
  (0, _useGridColumnPinning.useGridColumnPinning)(apiRef, props);
  (0, _internals.useGridColumns)(apiRef, props);
  (0, _internals.useGridRows)(apiRef, props);
  (0, _internals.useGridParamsApi)(apiRef);
  (0, _internals.useGridColumnSpanning)(apiRef);
  (0, _useGridDetailPanelCache.useGridDetailPanelCache)(apiRef, props);
  const useGridEditing = (_props$experimentalFe2 = props.experimentalFeatures) != null && _props$experimentalFe2.newEditingApi ? _internals.useGridEditing_new : _internals.useGridEditing_old;
  useGridEditing(apiRef, props);
  (0, _internals.useGridFocus)(apiRef, props);
  (0, _internals.useGridPreferencesPanel)(apiRef);
  (0, _internals.useGridFilter)(apiRef, props);
  (0, _internals.useGridSorting)(apiRef, props);
  (0, _internals.useGridDensity)(apiRef, props);
  (0, _useGridColumnReorder.useGridColumnReorder)(apiRef, props);
  (0, _useGridColumnResize.useGridColumnResize)(apiRef, props);
  (0, _internals.useGridPagination)(apiRef, props);
  (0, _internals.useGridRowsMeta)(apiRef, props);
  (0, _internals.useGridScroll)(apiRef, props);
  (0, _useGridInfiniteLoader.useGridInfiniteLoader)(apiRef, props);
  (0, _internals.useGridColumnMenu)(apiRef);
  (0, _internals.useGridCsvExport)(apiRef);
  (0, _internals.useGridPrintExport)(apiRef, props);
  (0, _internals.useGridClipboard)(apiRef);
  (0, _internals.useGridDimensions)(apiRef, props);
  (0, _internals.useGridEvents)(apiRef, props);
  (0, _internals.useGridStatePersistence)(apiRef);
  return apiRef;
};

exports.useDataGridProComponent = useDataGridProComponent;