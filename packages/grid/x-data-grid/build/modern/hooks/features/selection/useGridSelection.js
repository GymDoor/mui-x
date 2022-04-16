import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import { GridEvents } from '../../../models/events';
import { useGridApiEventHandler } from '../../utils/useGridApiEventHandler';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { useGridLogger } from '../../utils/useGridLogger';
import { gridRowsLookupSelector } from '../rows/gridRowsSelector';
import { gridSelectionStateSelector, selectedGridRowsSelector, selectedIdsLookupSelector } from './gridSelectionSelector';
import { gridPaginatedVisibleSortedGridRowIdsSelector } from '../pagination';
import { gridFocusCellSelector } from '../focus/gridFocusStateSelector';
import { gridVisibleSortedRowIdsSelector } from '../filter/gridFilterSelector';
import { GRID_CHECKBOX_SELECTION_COL_DEF, GRID_ACTIONS_COLUMN_TYPE } from '../../../colDef';
import { GridCellModes } from '../../../models/gridEditRowModel';
import { isKeyboardEvent, isNavigationKey } from '../../../utils/keyboardUtils';
import { getVisibleRows, useGridVisibleRows } from '../../utils/useGridVisibleRows';

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

export const selectionStateInitializer = (state, props) => _extends({}, state, {
  selection: getSelectionModelPropValue(props.selectionModel) ?? []
});
/**
 * @requires useGridRows (state, method) - can be after
 * @requires useGridParamsApi (method) - can be after
 * @requires useGridFocus (state) - can be after
 * @requires useGridKeyboardNavigation (`cellKeyDown` event must first be consumed by it)
 */

export const useGridSelection = (apiRef, props) => {
  const logger = useGridLogger(apiRef, 'useGridSelection');
  const propSelectionModel = React.useMemo(() => {
    return getSelectionModelPropValue(props.selectionModel, gridSelectionStateSelector(apiRef.current.state));
  }, [apiRef, props.selectionModel]);
  const lastRowToggled = React.useRef(null);
  apiRef.current.unstable_updateControlState({
    stateId: 'selection',
    propModel: propSelectionModel,
    propOnChange: props.onSelectionModelChange,
    stateSelector: gridSelectionStateSelector,
    changeEvent: GridEvents.selectionChange
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
  const visibleRows = useGridVisibleRows(apiRef, props);
  const expandMouseRowRangeSelection = React.useCallback(id => {
    let endId = id;
    const startId = lastRowToggled.current ?? id;
    const isSelected = apiRef.current.isRowSelected(id);

    if (isSelected) {
      const visibleRowIds = gridVisibleSortedRowIdsSelector(apiRef);
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
    const currentModel = gridSelectionStateSelector(apiRef.current.state);

    if (currentModel !== model) {
      logger.debug(`Setting selection model`);
      apiRef.current.setState(state => _extends({}, state, {
        selection: model
      }));
      apiRef.current.forceUpdate();
    }
  }, [apiRef, logger]);
  const isRowSelected = React.useCallback(id => gridSelectionStateSelector(apiRef.current.state).includes(id), [apiRef]);
  const getSelectedRows = React.useCallback(() => selectedGridRowsSelector(apiRef), [apiRef]);
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
      const selection = gridSelectionStateSelector(apiRef.current.state);
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
      const selectionLookup = _extends({}, selectedIdsLookupSelector(apiRef));

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

    const allPagesRowIds = gridVisibleSortedRowIdsSelector(apiRef);
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
  useGridApiMethod(apiRef, selectionApi, 'GridSelectionApi');
  /**
   * EVENTS
   */

  const removeOutdatedSelection = React.useCallback(() => {
    const currentSelection = gridSelectionStateSelector(apiRef.current.state);
    const rowsLookup = gridRowsLookupSelector(apiRef); // We clone the existing object to avoid mutating the same object returned by the selector to others part of the project

    const selectionLookup = _extends({}, selectedIdsLookupSelector(apiRef));

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

    const isMultipleSelectionDisabled = !checkboxSelection && !hasCtrlKey && !isKeyboardEvent(event);
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

    if (params.field === GRID_CHECKBOX_SELECTION_COL_DEF.field) {
      // click on checkbox should not trigger row selection
      return;
    }

    if (params.field === '__detail_panel_toggle__') {
      // click to open the detail panel should not select the row
      return;
    }

    if (params.field) {
      const column = apiRef.current.getColumn(params.field);

      if (column.type === GRID_ACTIONS_COLUMN_TYPE) {
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
      window.getSelection()?.removeAllRanges();
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
    const rowsToBeSelected = shouldLimitSelectionToCurrentPage ? gridPaginatedVisibleSortedGridRowIdsSelector(apiRef) : gridVisibleSortedRowIdsSelector(apiRef);
    apiRef.current.selectRows(rowsToBeSelected, params.value);
  }, [apiRef, props.checkboxSelectionVisibleOnly, props.pagination]);
  const handleCellKeyDown = React.useCallback((params, event) => {
    // Get the most recent cell mode because it may have been changed by another listener
    if (apiRef.current.getCellMode(params.id, params.field) === GridCellModes.Edit) {
      return;
    } // Ignore portal
    // Do not apply shortcuts if the focus is not on the cell root component


    if (!event.currentTarget.contains(event.target)) {
      return;
    }

    if (isNavigationKey(event.key) && event.shiftKey) {
      // The cell that has focus after the keyboard navigation
      const focusCell = gridFocusCellSelector(apiRef);

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
  useGridApiEventHandler(apiRef, GridEvents.sortedRowsSet, removeOutdatedSelection);
  useGridApiEventHandler(apiRef, GridEvents.cellClick, handleCellClick);
  useGridApiEventHandler(apiRef, GridEvents.rowSelectionCheckboxChange, handleRowSelectionCheckboxChange);
  useGridApiEventHandler(apiRef, GridEvents.headerSelectionCheckboxChange, handleHeaderSelectionCheckboxChange);
  useGridApiEventHandler(apiRef, GridEvents.cellMouseDown, preventSelectionOnShift);
  useGridApiEventHandler(apiRef, GridEvents.cellKeyDown, handleCellKeyDown);
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


    const currentSelection = gridSelectionStateSelector(apiRef.current.state);

    if (isRowSelectable) {
      const newSelection = currentSelection.filter(id => isRowSelectable(apiRef.current.getRowParams(id)));

      if (newSelection.length < currentSelection.length) {
        apiRef.current.setSelectionModel(newSelection);
      }
    }
  }, [apiRef, isRowSelectable, isStateControlled]);
  React.useEffect(() => {
    const currentSelection = gridSelectionStateSelector(apiRef.current.state);

    if (!canHaveMultipleSelection && currentSelection.length > 1) {
      const {
        rows: currentPageRows
      } = getVisibleRows(apiRef, {
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