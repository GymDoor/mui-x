import * as React from 'react';
import { styled } from '@mui/material/styles';
import { jsx as _jsx } from "react/jsx-runtime";
var Link = styled('a')({
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  color: 'inherit'
});
export var DemoLink = /*#__PURE__*/React.memo(function DemoLink(props) {
  var handleClick = function handleClick(event) {
    event.preventDefault();
    event.stopPropagation();
  };

  return /*#__PURE__*/_jsx(Link, {
    tabIndex: -1,
    onClick: handleClick,
    href: props.href,
    children: props.children
  });
});
export function renderLink(params) {
  if (params.rowNode.isAutoGenerated || !params.value) {
    return '';
  }

  return /*#__PURE__*/_jsx(DemoLink, {
    href: params.value,
    children: params.value
  });
}