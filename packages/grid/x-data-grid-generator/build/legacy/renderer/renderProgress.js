import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
var Root = styled('div')(function (_ref) {
  var theme = _ref.theme;
  return {
    border: "1px solid ".concat(theme.palette.divider),
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
    height: 26,
    borderRadius: 2
  };
});
var Value = styled('div')({
  position: 'absolute',
  lineHeight: '24px',
  width: '100%',
  display: 'flex',
  justifyContent: 'center'
});
var Bar = styled('div')({
  height: '100%',
  '&.low': {
    backgroundColor: '#f44336'
  },
  '&.medium': {
    backgroundColor: '#efbb5aa3'
  },
  '&.high': {
    backgroundColor: '#088208a3'
  }
});
var ProgressBar = /*#__PURE__*/React.memo(function ProgressBar(props) {
  var value = props.value;
  var valueInPercent = value * 100;
  return /*#__PURE__*/_jsxs(Root, {
    children: [/*#__PURE__*/_jsx(Value, {
      children: "".concat(valueInPercent.toLocaleString(), " %")
    }), /*#__PURE__*/_jsx(Bar, {
      className: clsx(valueInPercent < 30 && "low", valueInPercent >= 30 && valueInPercent <= 70 && "medium", valueInPercent > 70 && "high"),
      style: {
        maxWidth: "".concat(valueInPercent, "%")
      }
    })]
  });
});
export function renderProgress(params) {
  if (params.rowNode.isAutoGenerated || params.value == null) {
    return '';
  }

  return /*#__PURE__*/_jsx(ProgressBar, {
    value: params.value
  });
}