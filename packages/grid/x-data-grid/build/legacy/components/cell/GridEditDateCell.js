import _extends from "@babel/runtime/helpers/esm/extends";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
var _excluded = ["id", "value", "formattedValue", "api", "field", "row", "rowNode", "colDef", "cellMode", "isEditable", "tabIndex", "hasFocus", "getValue", "inputProps", "isValidating", "isProcessingProps"];
import * as React from 'react';
import { unstable_composeClasses as composeClasses } from '@mui/material';
import { unstable_useEnhancedEffect as useEnhancedEffect } from '@mui/material/utils';
import InputBase from '@mui/material/InputBase';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { jsx as _jsx } from "react/jsx-runtime";

var useUtilityClasses = function useUtilityClasses(ownerState) {
  var classes = ownerState.classes;
  var slots = {
    root: ['editInputCell']
  };
  return composeClasses(slots, getDataGridUtilityClass, classes);
};

export function GridEditDateCell(props) {
  var id = props.id,
      valueProp = props.value,
      formattedValue = props.formattedValue,
      api = props.api,
      field = props.field,
      row = props.row,
      rowNode = props.rowNode,
      colDef = props.colDef,
      cellMode = props.cellMode,
      isEditable = props.isEditable,
      tabIndex = props.tabIndex,
      hasFocus = props.hasFocus,
      getValue = props.getValue,
      inputProps = props.inputProps,
      isValidating = props.isValidating,
      isProcessingProps = props.isProcessingProps,
      other = _objectWithoutProperties(props, _excluded);

  var isDateTime = colDef.type === 'dateTime';
  var inputRef = React.useRef();
  var valueTransformed = React.useMemo(function () {
    var parsedDate;

    if (valueProp == null) {
      parsedDate = null;
    } else if (valueProp instanceof Date) {
      parsedDate = valueProp;
    } else {
      parsedDate = new Date((valueProp != null ? valueProp : '').toString());
    }

    var formattedDate;

    if (parsedDate == null || Number.isNaN(parsedDate.getTime())) {
      formattedDate = '';
    } else {
      var localDate = new Date(parsedDate.getTime() - parsedDate.getTimezoneOffset() * 60 * 1000);
      formattedDate = localDate.toISOString().substr(0, isDateTime ? 16 : 10);
    }

    return {
      parsed: parsedDate,
      formatted: formattedDate
    };
  }, [valueProp, isDateTime]);

  var _React$useState = React.useState(valueTransformed),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      valueState = _React$useState2[0],
      setValueState = _React$useState2[1];

  var rootProps = useGridRootProps();
  var ownerState = {
    classes: rootProps.classes
  };
  var classes = useUtilityClasses(ownerState);
  var handleChange = React.useCallback(function (event) {
    var newFormattedDate = event.target.value;
    var newParsedDate;

    if (newFormattedDate === '') {
      newParsedDate = null;
    } else {
      var _newFormattedDate$spl = newFormattedDate.split('T'),
          _newFormattedDate$spl2 = _slicedToArray(_newFormattedDate$spl, 2),
          date = _newFormattedDate$spl2[0],
          time = _newFormattedDate$spl2[1];

      var _date$split = date.split('-'),
          _date$split2 = _slicedToArray(_date$split, 3),
          year = _date$split2[0],
          month = _date$split2[1],
          day = _date$split2[2];

      newParsedDate = new Date();
      newParsedDate.setFullYear(year, Number(month) - 1, day);
      newParsedDate.setHours(0, 0, 0, 0);

      if (time) {
        var _time$split = time.split(':'),
            _time$split2 = _slicedToArray(_time$split, 2),
            hours = _time$split2[0],
            minutes = _time$split2[1];

        newParsedDate.setHours(Number(hours), Number(minutes), 0, 0);
      }
    }

    setValueState({
      parsed: newParsedDate,
      formatted: newFormattedDate
    });
    api.setEditCellValue({
      id: id,
      field: field,
      value: newParsedDate
    }, event);
  }, [api, field, id]);
  React.useEffect(function () {
    setValueState(function (state) {
      var _valueTransformed$par, _state$parsed;

      if (valueTransformed.parsed !== state.parsed && ((_valueTransformed$par = valueTransformed.parsed) == null ? void 0 : _valueTransformed$par.getTime()) !== ((_state$parsed = state.parsed) == null ? void 0 : _state$parsed.getTime())) {
        return valueTransformed;
      }

      return state;
    });
  }, [valueTransformed]);
  useEnhancedEffect(function () {
    if (hasFocus) {
      inputRef.current.focus();
    }
  }, [hasFocus]);
  return /*#__PURE__*/_jsx(InputBase, _extends({
    inputRef: inputRef,
    fullWidth: true,
    className: classes.root,
    type: isDateTime ? 'datetime-local' : 'date',
    inputProps: _extends({
      max: isDateTime ? '9999-12-31T23:59' : '9999-12-31'
    }, inputProps),
    value: valueState.formatted,
    onChange: handleChange
  }, other));
}
export var renderEditDateCell = function renderEditDateCell(params) {
  return /*#__PURE__*/_jsx(GridEditDateCell, _extends({}, params));
};