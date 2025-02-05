import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import { unstable_composeClasses as composeClasses } from '@mui/material';
import { useGridRegisterPipeProcessor } from '../../core/pipeProcessing';
import { getDataGridUtilityClass } from '../../../constants';
import { GRID_CHECKBOX_SELECTION_COL_DEF } from '../../../colDef';

var useUtilityClasses = function useUtilityClasses(ownerState) {
  var classes = ownerState.classes;
  return React.useMemo(function () {
    var slots = {
      cellCheckbox: ['cellCheckbox'],
      columnHeaderCheckbox: ['columnHeaderCheckbox']
    };
    return composeClasses(slots, getDataGridUtilityClass, classes);
  }, [classes]);
};

export var useGridSelectionPreProcessors = function useGridSelectionPreProcessors(apiRef, props) {
  var ownerState = {
    classes: props.classes
  };
  var classes = useUtilityClasses(ownerState);
  var updateSelectionColumn = React.useCallback(function (columnsState) {
    var selectionColumn = _extends({}, GRID_CHECKBOX_SELECTION_COL_DEF, {
      cellClassName: classes.cellCheckbox,
      headerClassName: classes.columnHeaderCheckbox,
      headerName: apiRef.current.getLocaleText('checkboxSelectionHeaderName')
    });

    var shouldHaveSelectionColumn = props.checkboxSelection;
    var haveSelectionColumn = columnsState.lookup[selectionColumn.field] != null;

    if (shouldHaveSelectionColumn && !haveSelectionColumn) {
      columnsState.lookup[selectionColumn.field] = selectionColumn;
      columnsState.all = [selectionColumn.field].concat(_toConsumableArray(columnsState.all));
    } else if (!shouldHaveSelectionColumn && haveSelectionColumn) {
      delete columnsState.lookup[selectionColumn.field];
      columnsState.all = columnsState.all.filter(function (field) {
        return field !== selectionColumn.field;
      });
    }

    return columnsState;
  }, [apiRef, classes, props.checkboxSelection]);
  useGridRegisterPipeProcessor(apiRef, 'hydrateColumns', updateSelectionColumn);
};