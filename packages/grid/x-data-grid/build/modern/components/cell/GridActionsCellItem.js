import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["label", "icon", "showInMenu", "onClick"];
import * as React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";

const GridActionsCellItem = props => {
  const {
    label,
    icon,
    showInMenu,
    onClick
  } = props,
        other = _objectWithoutPropertiesLoose(props, _excluded);

  const handleClick = event => {
    if (onClick) {
      onClick(event);
    }
  };

  if (!showInMenu) {
    return /*#__PURE__*/_jsx(IconButton, _extends({
      size: "small",
      "aria-label": label
    }, other, {
      onClick: handleClick,
      children: /*#__PURE__*/React.cloneElement(icon, {
        fontSize: 'small'
      })
    }));
  }

  return /*#__PURE__*/_jsxs(MenuItem, _extends({}, other, {
    onClick: onClick,
    children: [icon && /*#__PURE__*/_jsx(ListItemIcon, {
      children: icon
    }), label]
  }));
};

process.env.NODE_ENV !== "production" ? GridActionsCellItem.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  icon: PropTypes.element,
  label: PropTypes.string.isRequired,
  showInMenu: PropTypes.bool
} : void 0;
export { GridActionsCellItem };