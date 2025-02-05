import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["align", "children", "colIndex", "cellMode", "field", "formattedValue", "hasFocus", "height", "isEditable", "rowId", "tabIndex", "value", "width", "className", "showRightBorder", "extendRowFullWidth", "row", "colSpan", "onClick", "onDoubleClick", "onMouseDown", "onMouseUp", "onKeyDown", "onDragEnter", "onDragOver"];

/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { unstable_composeClasses as composeClasses } from '@mui/material';
import { ownerDocument, capitalize } from '@mui/material/utils';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { GridEvents, GridCellModes } from '../../models';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { gridFocusCellSelector } from '../../hooks/features/focus/gridFocusStateSelector';
import { jsx as _jsx } from "react/jsx-runtime";
// Based on https://stackoverflow.com/a/59518678
let cachedSupportsPreventScroll;

function doesSupportPreventScroll() {
  if (cachedSupportsPreventScroll === undefined) {
    document.createElement('div').focus({
      get preventScroll() {
        cachedSupportsPreventScroll = true;
        return false;
      }

    });
  }

  return cachedSupportsPreventScroll;
}

const useUtilityClasses = ownerState => {
  const {
    align,
    showRightBorder,
    isEditable,
    classes
  } = ownerState;
  const slots = {
    root: ['cell', `cell--text${capitalize(align)}`, isEditable && 'cell--editable', showRightBorder && 'withBorder'],
    content: ['cellContent']
  };
  return composeClasses(slots, getDataGridUtilityClass, classes);
};

let warnedOnce = false;

function GridCell(props) {
  const {
    align,
    children,
    colIndex,
    cellMode,
    field,
    formattedValue,
    hasFocus,
    height,
    isEditable,
    rowId,
    tabIndex,
    value,
    width,
    className,
    showRightBorder,
    colSpan,
    onClick,
    onDoubleClick,
    onMouseDown,
    onMouseUp,
    onKeyDown,
    onDragEnter,
    onDragOver
  } = props,
        other = _objectWithoutPropertiesLoose(props, _excluded);

  const valueToRender = formattedValue == null ? value : formattedValue;
  const cellRef = React.useRef(null);
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const ownerState = {
    align,
    showRightBorder,
    isEditable,
    classes: rootProps.classes
  };
  const classes = useUtilityClasses(ownerState);
  const publishMouseUp = React.useCallback(eventName => event => {
    const params = apiRef.current.getCellParams(rowId, field || '');
    apiRef.current.publishEvent(eventName, params, event);

    if (onMouseUp) {
      onMouseUp(event);
    }
  }, [apiRef, field, onMouseUp, rowId]);
  const publish = React.useCallback((eventName, propHandler) => event => {
    // Ignore portal
    if (!event.currentTarget.contains(event.target)) {
      return;
    } // The row might have been deleted during the click


    if (!apiRef.current.getRow(rowId)) {
      return;
    }

    const params = apiRef.current.getCellParams(rowId, field || '');
    apiRef.current.publishEvent(eventName, params, event);

    if (propHandler) {
      propHandler(event);
    }
  }, [apiRef, field, rowId]);
  const style = {
    minWidth: width,
    maxWidth: width,
    minHeight: height,
    maxHeight: height
  };
  React.useLayoutEffect(() => {
    if (!hasFocus || cellMode === GridCellModes.Edit) {
      return;
    }

    const doc = ownerDocument(apiRef.current.rootElementRef.current);

    if (cellRef.current && !cellRef.current.contains(doc.activeElement)) {
      const focusableElement = cellRef.current.querySelector('[tabindex="0"]');
      const elementToFocus = focusableElement || cellRef.current;

      if (doesSupportPreventScroll()) {
        elementToFocus.focus({
          preventScroll: true
        });
      } else {
        const scrollPosition = apiRef.current.getScrollPosition();
        elementToFocus.focus();
        apiRef.current.scroll(scrollPosition);
      }
    }
  }, [hasFocus, cellMode, apiRef]);
  let handleFocus = other.onFocus;

  if (process.env.NODE_ENV === 'test' && rootProps.experimentalFeatures?.warnIfFocusStateIsNotSynced) {
    handleFocus = event => {
      const focusedCell = gridFocusCellSelector(apiRef);

      if (focusedCell?.id === rowId && focusedCell.field === field) {
        if (typeof other.onFocus === 'function') {
          other.onFocus(event);
        }

        return;
      }

      if (!warnedOnce) {
        console.warn([`MUI: The cell with id=${rowId} and field=${field} received focus.`, `According to the state, the focus should be at id=${focusedCell?.id}, field=${focusedCell?.field}.`, "Not syncing the state may cause unwanted behaviors since the `cellFocusIn` event won't be fired.", 'Call `fireEvent.mouseUp` before the `fireEvent.click` to sync the focus with the state.'].join('\n'));
        warnedOnce = true;
      }
    };
  }

  return /*#__PURE__*/_jsx("div", _extends({
    ref: cellRef,
    className: clsx(className, classes.root),
    role: "cell",
    "data-field": field,
    "data-colindex": colIndex,
    "aria-colindex": colIndex + 1,
    "aria-colspan": colSpan,
    style: style,
    tabIndex: cellMode === 'view' || !isEditable ? tabIndex : -1,
    onClick: publish(GridEvents.cellClick, onClick),
    onDoubleClick: publish(GridEvents.cellDoubleClick, onDoubleClick),
    onMouseDown: publish(GridEvents.cellMouseDown, onMouseDown),
    onMouseUp: publishMouseUp(GridEvents.cellMouseUp),
    onKeyDown: publish(GridEvents.cellKeyDown, onKeyDown),
    onDragEnter: publish(GridEvents.cellDragEnter, onDragEnter),
    onDragOver: publish(GridEvents.cellDragOver, onDragOver)
  }, other, {
    onFocus: handleFocus,
    children: children != null ? children : /*#__PURE__*/_jsx("div", {
      className: classes.content,
      children: valueToRender?.toString()
    })
  }));
}

process.env.NODE_ENV !== "production" ? GridCell.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  align: PropTypes.oneOf(['center', 'left', 'right']).isRequired,
  cellMode: PropTypes.oneOf(['edit', 'view']),
  children: PropTypes.node,
  className: PropTypes.string,
  colIndex: PropTypes.number.isRequired,
  colSpan: PropTypes.number,
  field: PropTypes.string.isRequired,
  formattedValue: PropTypes.any,
  hasFocus: PropTypes.bool,
  height: PropTypes.number.isRequired,
  isEditable: PropTypes.bool,
  onClick: PropTypes.func,
  onDoubleClick: PropTypes.func,
  onDragEnter: PropTypes.func,
  onDragOver: PropTypes.func,
  onKeyDown: PropTypes.func,
  onMouseDown: PropTypes.func,
  onMouseUp: PropTypes.func,
  rowId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  showRightBorder: PropTypes.bool,
  tabIndex: PropTypes.oneOf([-1, 0]).isRequired,
  value: PropTypes.any,
  width: PropTypes.number.isRequired
} : void 0;
export { GridCell };