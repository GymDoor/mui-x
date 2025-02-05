import _extends from "@babel/runtime/helpers/esm/extends";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _typeof from "@babel/runtime/helpers/esm/typeof";
import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
var _excluded = ["item", "applyValue", "type", "apiRef", "focusElementRef"];
import * as React from 'react';
import PropTypes from 'prop-types';
import { unstable_useId as useId } from '@mui/material/utils';
import MenuItem from '@mui/material/MenuItem';
import { GridLoadIcon } from '../../icons';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import { getValueFromValueOptions } from './filterPanelUtils';
import { jsx as _jsx } from "react/jsx-runtime";
var warnedOnce = {};

function warnDeprecatedTypeSupport(type) {
  console.warn(["MUI: Using GridFilterInputValue with a \"".concat(type, "\" column is deprecated."), 'Use GridFilterInputSingleSelect instead.'].join('\n'));
  warnedOnce[type] = true;
}

var renderSingleSelectOptions = function renderSingleSelectOptions(_ref, api, OptionComponent) {
  var valueOptions = _ref.valueOptions,
      valueFormatter = _ref.valueFormatter,
      field = _ref.field;
  var iterableColumnValues = typeof valueOptions === 'function' ? [''].concat(_toConsumableArray(valueOptions({
    field: field
  }))) : [''].concat(_toConsumableArray(valueOptions || []));
  return iterableColumnValues.map(function (option) {
    var isOptionTypeObject = _typeof(option) === 'object';
    var key = isOptionTypeObject ? option.value : option;
    var value = isOptionTypeObject ? option.value : option;
    var formattedValue = valueFormatter && option !== '' ? valueFormatter({
      value: option,
      field: field,
      api: api
    }) : option;
    var content = isOptionTypeObject ? option.label : formattedValue;
    return /*#__PURE__*/_jsx(OptionComponent, {
      value: value,
      children: content
    }, key);
  });
};

export var SUBMIT_FILTER_STROKE_TIME = 500;

function GridFilterInputValue(props) {
  var _item$value, _rootProps$components, _baseSelectProps$nati, _rootProps$components2, _rootProps$components3;

  var item = props.item,
      applyValue = props.applyValue,
      type = props.type,
      apiRef = props.apiRef,
      focusElementRef = props.focusElementRef,
      others = _objectWithoutProperties(props, _excluded);

  if (process.env.NODE_ENV !== 'production' && ['date', 'datetime-local', 'singleSelect'].includes(type) && !warnedOnce[type]) {
    warnDeprecatedTypeSupport(type);
  }

  var filterTimeout = React.useRef();

  var _React$useState = React.useState((_item$value = item.value) != null ? _item$value : ''),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      filterValueState = _React$useState2[0],
      setFilterValueState = _React$useState2[1];

  var _React$useState3 = React.useState(false),
      _React$useState4 = _slicedToArray(_React$useState3, 2),
      applying = _React$useState4[0],
      setIsApplying = _React$useState4[1];

  var id = useId();
  var rootProps = useGridRootProps();
  var baseSelectProps = ((_rootProps$components = rootProps.componentsProps) == null ? void 0 : _rootProps$components.baseSelect) || {};
  var isSelectNative = (_baseSelectProps$nati = baseSelectProps.native) != null ? _baseSelectProps$nati : true;
  var singleSelectProps = type === 'singleSelect' ? {
    select: true,
    SelectProps: _extends({
      native: isSelectNative
    }, (_rootProps$components2 = rootProps.componentsProps) == null ? void 0 : _rootProps$components2.baseSelect),
    children: renderSingleSelectOptions(apiRef.current.getColumn(item.columnField), apiRef.current, isSelectNative ? 'option' : MenuItem)
  } : {};
  var onFilterChange = React.useCallback(function (event) {
    var value = event.target.value; // NativeSelect casts the value to a string.

    if (type === 'singleSelect') {
      var column = apiRef.current.getColumn(item.columnField);
      var columnValueOptions = typeof column.valueOptions === 'function' ? column.valueOptions({
        field: column.field
      }) : column.valueOptions;
      value = getValueFromValueOptions(value, columnValueOptions);
    }

    clearTimeout(filterTimeout.current);
    setFilterValueState(String(value));
    setIsApplying(true); // TODO singleSelect doesn't debounce

    filterTimeout.current = setTimeout(function () {
      applyValue(_extends({}, item, {
        value: value
      }));
      setIsApplying(false);
    }, SUBMIT_FILTER_STROKE_TIME);
  }, [apiRef, applyValue, item, type]);
  React.useEffect(function () {
    return function () {
      clearTimeout(filterTimeout.current);
    };
  }, []);
  React.useEffect(function () {
    var _item$value2;

    var itemValue = (_item$value2 = item.value) != null ? _item$value2 : '';
    setFilterValueState(String(itemValue));
  }, [item.value]);
  var InputProps = applying ? {
    endAdornment: /*#__PURE__*/_jsx(GridLoadIcon, {})
  } : others.InputProps;
  return /*#__PURE__*/_jsx(rootProps.components.BaseTextField, _extends({
    id: id,
    label: apiRef.current.getLocaleText('filterPanelInputLabel'),
    placeholder: apiRef.current.getLocaleText('filterPanelInputPlaceholder'),
    value: filterValueState,
    onChange: onFilterChange,
    type: type || 'text',
    variant: "standard",
    InputProps: InputProps,
    InputLabelProps: {
      shrink: true
    },
    inputRef: focusElementRef
  }, singleSelectProps, others, (_rootProps$components3 = rootProps.componentsProps) == null ? void 0 : _rootProps$components3.baseTextField));
}

process.env.NODE_ENV !== "production" ? GridFilterInputValue.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  apiRef: PropTypes.any.isRequired,
  applyValue: PropTypes.func.isRequired,
  focusElementRef: PropTypes
  /* @typescript-to-proptypes-ignore */
  .oneOfType([PropTypes.func, PropTypes.object]),
  item: PropTypes.shape({
    columnField: PropTypes.string.isRequired,
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    operatorValue: PropTypes.string,
    value: PropTypes.any
  }).isRequired
} : void 0;
export { GridFilterInputValue };