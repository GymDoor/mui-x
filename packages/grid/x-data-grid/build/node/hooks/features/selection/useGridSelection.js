"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useGridSelection = exports.selectionStateInitializer = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var React = _interopRequireWildcard(require("react"));

var _events = require("../../../models/events");

var _useGridApiEventHandler = require("../../utils/useGridApiEventHandler");

var _useGridApiMethod = require("../../utils/useGridApiMethod");

var _useGridLogger = require("../../utils/useGridLogger");

var _gridRowsSelector = require("../rows/gridRowsSelector");

var _gridSelectionSelector = require("./gridSelectionSelector");

var _pagination = require("../pagination");

var _gridFocusStateSelector = require("../focus/gridFocusStateSelector");

var _gridFilterSelector = require("../filter/gridFilterSelector");

var _colDef = require("../../../colDef");

var _gridEditRowModel = require("../../../models/gridEditRowModel");

var _keyboardUtils = require("../../../utils/keyboardUtils");

var _useGridVisibleRows = require("../../utils/useGridVisibleRows");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const getSelectionModelPropValue = (selectionModelProp, prevSelectionModel) => {
  if (selectionModelProp == null) {
    return selectionModelProp;
  }

  if (Array.isArray(selectionModelProp)) {
    return selectionModelProp;
  }

  if (prevSelectionModel && prevSelectionModel[0] === selectionModelProp) {
    return prevSelectionModel;
  }

  return [selectionModelProp];
};

const selectionStateInitializer = (state, props) => {
  var _getSelectionModelPro;

  return (0, _extends2.default)({}, state, {
    selection: (_getSelectionModelPro = getSelectionModelPropValue(props.selectionModel)) != null ? _getSelectionModelPro : []
  });
};
/**
 * @requires useGridRows (state, method) - can be after
 * @requires useGridParamsApi (method) - can be after
 * @requires useGridFocus (state) - can be after
 * @requires useGridKeyboardNavigation (`cellKeyDown` event must first be consumed by it)
 */


exports.selectionStateInitializer = selectionStateInitializer;

const useGridSelection = (apiRef, props) => {
  const logger = (0, _useGridLogger.useGridLogger)(apiRef, 'useGridSelection');
  const propSelectionModel = React.useMemo(() => {
    return getSelectionModelPropValue(props.selectionModel, (0, _gridSelectionSelector.gridSelectionStateSelector)(apiRef.current.state));
  }, [apiRef, props.selectionModel]);
  const lastRowToggled = React.useRef(null);
  apiRef.current.unstable_updateControlState({
    stateId: 'selection',
    propModel: propSelectionModel,
    propOnChange: props.onSelectionModelChange,
    stateSelector: _gridSelectionSelector.gridSelectionStateSelector,
    changeEvent: _events.GridEvents.selectionChange
  });
  const {
    checkboxSelection,
    disableMultipleSelection,
    disableSelectionOnClick,
    isRowSelectable,
    pagination,
    paginationMode
  } = props;
  const canHaveMultipleSelection = !disableMultipleSelection || checkboxSelection;
  const visibleRows = (0, _useGridVisibleRows.useGridVisibleRows)(apiRef, props);
  const expandMouseRowRangeSelection = React.useCallback(id => {
    var _lastRowToggled$curre;

    let endId = id;
    const startId = (_lastRowToggled$curre = lastRowToggled.current) != null ? _lastRowToggled$curre : id;
    const isSelected = apiRef.current.isRowSelected(id);

    if (isSelected) {
      const visibleRowIds = (0, _gridFilterSelector.gridVisibleSortedRowIdsSelector)(apiRef);
      const startIndex = visibleRowIds.findIndex(rowId => rowId === startId);
      const endIndex = visibleRowIds.findIndex(rowId => rowId === endId);

      if (startIndex === endIndex) {
        return;
      }

      if (startIndex > endIndex) {
        endId = visibleRowIds[endIndex + 1];
      } else {
        endId = visibleRowIds[endIndex - 1];
      }
    }

    lastRowToggled.current = id;
    apiRef.current.selectRowRange({
      startId,
      endId
    }, !isSelected);
  }, [apiRef]);
  /**
   * API METHODS
   */

  const setSelectionModel = React.useCallback(model => {
    const currentModel = (0, _gridSelectionSelector.gridSelectionStateSelector)(apiRef.current.state);

    if (currentModel !== model) {
      logger.debug(`Setting selection model`);
      apiRef.current.setState(state => (0, _extends2.default)({}, state, {
        selection: model
      }));
      apiRef.current.forceUpdate();
    }
  }, [apiRef, logger]);
  const isRowSelected = React.useCallback(id => (0, _gridSelectionSelector.gridSelectionStateSelector)(apiRef.current.state).includes(id), [apiRef]);
  const getSelectedRows = React.useCallback(() => (0, _gridSelectionSelector.selectedGridRowsSelector)(apiRef), [apiRef]);
  const selectRow = React.useCallback((id, isSelected = true, resetSelection = false) => {
    if (isRowSelectable && !isRowSelectable(apiRef.current.getRowParams(id))) {
      return;
    }

    lastRowToggled.current = id;

    if (resetSelection) {
      logger.debug(`Setting selection for row ${id}`);
      apiRef.current.setSelectionModel(isSelected ? [id] : []);
    } else {
      logger.debug(`Toggling selection for row ${id}`);
      const selection = (0, _gridSelectionSelector.gridSelectionStateSelector)(apiRef.current.state);
      const newSelection = selection.filter(el => el !== id);

      if (isSelected) {
        newSelection.push(id);
      }

      const isSelectionValid = newSelection.length < 2 || canHaveMultipleSelection;

      if (isSelectionValid) {
        apiRef.current.setSelectionModel(newSelection);
      }
    }
  }, [apiRef, isRowSelectable, logger, canHaveMultipleSelection]);
  const selectRows = React.useCallback((ids, isSelected = true, resetSelection = false) => {
    logger.debug(`Setting selection for several rows`);
    const selectableIds = isRowSelectable ? ids.filter(id => isRowSelectable(apiRef.current.getRowParams(id))) : ids;
    let newSelection;

    if (resetSelection) {
      newSelection = isSelected ? selectableIds : [];
    } else {
      // We clone the existing object to avoid mutating the same object returned by the selector to others part of the project
      const selectionLookup = (0, _extends2.default)({}, (0, _gridSelectionSelector.selectedIdsLookupSelector)(apiRef));
      selectableIds.forEach(id => {
        if (isSelected) {
          selectionLookup[id] = id;
        } else {
          delete selectionLookup[id];
        }
      });
      newSelection = Object.values(selectionLookup);
    }

    const isSelectionValid = newSelection.length < 2 || canHaveMultipleSelection;

    if (isSelectionValid) {
      apiRef.current.setSelectionModel(newSelection);
    }
  }, [apiRef, isRowSelectable, logger, canHaveMultipleSelection]);
  const selectRowRange = React.useCallback(({
    startId,
    endId
  }, isSelected = true, resetSelection) => {
    if (!apiRef.current.getRow(startId) || !apiRef.current.getRow(endId)) {
      return;
    }

    logger.debug(`Expanding selection from row ${startId} to row ${endId}`); // Using rows from all pages allow to select a range across several pages

    const allPagesRowIds = (0, _gridFilterSelector.gridVisibleSortedRowIdsSelector)(apiRef);
    const startIndex = allPagesRowIds.indexOf(startId);
    const endIndex = allPagesRowIds.indexOf(endId);
    const [start, end] = startIndex > endIndex ? [endIndex, startIndex] : [startIndex, endIndex];
    const rowsBetweenStartAndEnd = allPagesRowIds.slice(start, end + 1);
    apiRef.current.selectRows(rowsBetweenStartAndEnd, isSelected, resetSelection);
  }, [apiRef, logger]);
  const selectionApi = {
    selectRow,
    selectRows,
    selectRowRange,
    setSelectionModel,
    getSelectedRows,
    isRowSelected
  };
  (0, _useGridApiMethod.useGridApiMethod)(apiRef, selectionApi, 'GridSelectionApi');
  /**
   * EVENTS
   */

  const removeOutdatedSelection = React.useCallback(() => {
    const currentSelection = (0, _gridSelectionSelector.gridSelectionStateSelector)(apiRef.current.state);
    const rowsLookup = (0, _gridRowsSelector.gridRowsLookupSelector)(apiRef); // We clone the existing object to avoid mutating the same object returned by the selector to others part of the project

    const selectionLookup = (0, _extends2.default)({}, (0, _gridSelectionSelector.selectedIdsLookupSelector)(apiRef));
    let hasChanged = false;
    currentSelection.forEach(id => {
      if (!rowsLookup[id]) {
        delete selectionLookup[id];
        hasChanged = true;
      }
    });

    if (hasChanged) {
      apiRef.current.setSelectionModel(Object.values(selectionLookup));
    }
  }, [apiRef]);
  const handleSingleRowSelection = React.useCallback((id, event) => {
    const hasCtrlKey = event.metaKey || event.ctrlKey; // multiple selection is only allowed if:
    // - it is a checkboxSelection
    // - it is a keyboard selection
    // - CTRL is pressed

    const isMultipleSelectionDisabled = !checkboxSelection && !hasCtrlKey && !(0, _keyboardUtils.isKeyboardEvent)(event);
    const resetSelection = !canHaveMultipleSelection || isMultipleSelectionDisabled;
    const isSelected = apiRef.current.isRowSelected(id);

    if (resetSelection) {
      apiRef.current.selectRow(id, !isMultipleSelectionDisabled ? !isSelected : true, true);
    } else {
      apiRef.current.selectRow(id, !isSelected, false);
    }
  }, [apiRef, canHaveMultipleSelection, checkboxSelection]);
  const handleCellClick = React.useCallback((params, event) => {
    if (disableSelectionOnClick) {
      return;
    }

    if (params.field === _colDef.GRID_CHECKBOX_SELECTION_COL_DEF.field) {
      // click on checkbox should not trigger row selection
      return;
    }

    if (params.field === '__detail_panel_toggle__') {
      // click to open the detail panel should not select the row
      return;
    }

    if (params.field) {
      const column = apiRef.current.getColumn(params.field);

      if (column.type === _colDef.GRID_ACTIONS_COLUMN_TYPE) {
        return;
      }
    }

    if (event.shiftKey && (canHaveMultipleSelection || checkboxSelection)) {
      expandMouseRowRangeSelection(params.id);
    } else {
      handleSingleRowSelection(params.id, event);
    }
  }, [disableSelectionOnClick, canHaveMultipleSelection, checkboxSelection, apiRef, expandMouseRowRangeSelection, handleSingleRowSelection]);
  const preventSelectionOnShift = React.useCallback((params, event) => {
    if (canHaveMultipleSelection && event.shiftKey) {
      var _window$getSelection;

      (_window$getSelection = window.getSelection()) == null ? void 0 : _window$getSelection.removeAllRanges();
    }
  }, [canHaveMultipleSelection]);
  const handleRowSelectionCheckboxChange = React.useCallback((params, event) => {
    if (event.nativeEvent.shiftKey) {
      expandMouseRowRangeSelection(params.id);
    } else {
      apiRef.current.selectRow(params.id, params.value);
    }
  }, [apiRef, expandMouseRowRangeSelection]);
  const handleHeaderSelectionCheckboxChange = React.useCallback(params => {
    const shouldLimitSelectionToCurrentPage = props.checkboxSelectionVisibleOnly && props.pagination;
    const rowsToBeSelected = shouldLimitSelectionToCurrentPage ? (0, _pagination.gridPaginatedVisibleSortedGridRowIdsSelector)(apiRef) : (0, _gridFilterSelector.gridVisibleSortedRowIdsSelector)(apiRef);
    apiRef.current.selectRows(rowsToBeSelected, params.value);
  }, [apiRef, props.checkboxSelectionVisibleOnly, props.pagination]);
  const handleCellKeyDown = React.useCallback((params, event) => {
    // Get the most recent cell mode because it may have been changed by another listener
    if (apiRef.current.getCellMode(params.id, params.field) === _gridEditRowModel.GridCellModes.Edit) {
      return;
    } // Ignore portal
    // Do not apply shortcuts if the focus is not on the cell root component


    if (!event.currentTarget.contains(event.target)) {
      return;
    }

    if ((0, _keyboardUtils.isNavigationKey)(event.key) && event.shiftKey) {
      // The cell that has focus after the keyboard navigation
      const focusCell = (0, _gridFocusStateSelector.gridFocusCellSelector)(apiRef);

      if (focusCell && focusCell.id !== params.id) {
        event.preventDefault();
        const isNextRowSelected = apiRef.current.isRowSelected(focusCell.id);

        if (!canHaveMultipleSelection) {
          apiRef.current.selectRow(focusCell.id, !isNextRowSelected, true);
          return;
        }

        const newRowIndex = apiRef.current.getRowIndexRelativeToVisibleRows(focusCell.id);
        const previousRowIndex = apiRef.current.getRowIndexRelativeToVisibleRows(params.id);
        let start;
        let end;

        if (newRowIndex > previousRowIndex) {
          if (isNextRowSelected) {
            // We are navigating to the bottom of the page and adding selected rows
            start = previousRowIndex;
            end = newRowIndex - 1;
          } else {
            // We are navigating to the bottom of the page and removing selected rows
            start = previousRowIndex;
            end = newRowIndex;
          }
        } else {
          // eslint-disable-next-line no-lonely-if
          if (isNextRowSelected) {
            // We are navigating to the top of the page and removing selected rows
            start = newRowIndex + 1;
            end = previousRowIndex;
          } else {
            // We are navigating to the top of the page and adding selected rows
            start = newRowIndex;
            end = previousRowIndex;
          }
        }

        const rowsBetweenStartAndEnd = visibleRows.rows.slice(start, end + 1).map(row => row.id);
        apiRef.current.selectRows(rowsBetweenStartAndEnd, !isNextRowSelected);
        return;
      }
    }

    if (event.key === ' ' && event.shiftKey) {
      event.preventDefault();
      handleSingleRowSelection(params.id, event);
      return;
    }

    if (event.key.toLowerCase() === 'a' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      selectRows(apiRef.current.getAllRowIds(), true);
    }
  }, [apiRef, handleSingleRowSelection, selectRows, visibleRows.rows, canHaveMultipleSelection]);
  (0, _useGridApiEventHandler.useGridApiEventHandler)(apiRef, _events.GridEvents.sortedRowsSet, removeOutdatedSelection);
  (0, _useGridApiEventHandler.useGridApiEventHandler)(apiRef, _events.GridEvents.cellClick, handleCellClick);
  (0, _useGridApiEventHandler.useGridApiEventHandler)(apiRef, _events.GridEvents.rowSelectionCheckboxChange, handleRowSelectionCheckboxChange);
  (0, _useGridApiEventHandler.useGridApiEventHandler)(apiRef, _events.GridEvents.headerSelectionCheckboxChange, handleHeaderSelectionCheckboxChange);
  (0, _useGridApiEventHandler.useGridApiEventHandler)(apiRef, _events.GridEvents.cellMouseDown, preventSelectionOnShift);
  (0, _useGridApiEventHandler.useGridApiEventHandler)(apiRef, _events.GridEvents.cellKeyDown, handleCellKeyDown);
  /**
   * EFFECTS
   */

  React.useEffect(() => {
    if (propSelectionModel !== undefined) {
      apiRef.current.setSelectionModel(propSelectionModel);
    }
  }, [apiRef, propSelectionModel]);
  const isStateControlled = propSelectionModel != null;
  React.useEffect(() => {
    if (isStateControlled) {
      return;
    } // isRowSelectable changed


    const currentSelection = (0, _gridSelectionSelector.gridSelectionStateSelector)(apiRef.current.state);

    if (isRowSelectable) {
      const newSelection = currentSelection.filter(id => isRowSelectable(apiRef.current.getRowParams(id)));

      if (newSelection.length < currentSelection.length) {
        apiRef.current.setSelectionModel(newSelection);
      }
    }
  }, [apiRef, isRowSelectable, isStateControlled]);
  React.useEffect(() => {
    const currentSelection = (0, _gridSelectionSelector.gridSelectionStateSelector)(apiRef.current.state);

    if (!canHaveMultipleSelection && currentSelection.length > 1) {
      const {
        rows: currentPageRows
      } = (0, _useGridVisibleRows.getVisibleRows)(apiRef, {
        pagination,
        paginationMode
      });
      const currentPageRowsLookup = currentPageRows.reduce((acc, {
        id
      }) => {
        acc[id] = true;
        return acc;
      }, {});
      const firstSelectableRow = currentSelection.find(id => {
        let isSelectable = true;

        if (isRowSelectable) {
          isSelectable = isRowSelectable(apiRef.current.getRowParams(id));
        }

        return isSelectable && currentPageRowsLookup[id]; // Check if the row is in the current page
      });
      apiRef.current.setSelectionModel(firstSelectableRow !== undefined ? [firstSelectableRow] : []);
    }
  }, [apiRef, canHaveMultipleSelection, checkboxSelection, disableMultipleSelection, isRowSelectable, pagination, paginationMode]);
};

exports.useGridSelection = useGridSelection;