import * as React from 'react';
import PropTypes from 'prop-types';
import { unstable_composeClasses as composeClasses } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { getDataGridUtilityClass, useGridSelector } from '@mui/x-data-grid';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { gridDetailPanelExpandedRowsContentCacheSelector } from '../hooks/features/detailPanel/gridDetailPanelSelector';
import { jsx as _jsx } from "react/jsx-runtime";

var useUtilityClasses = function useUtilityClasses(ownerState) {
  var classes = ownerState.classes,
      isExpanded = ownerState.isExpanded;
  var slots = {
    root: ['detailPanelToggleCell', isExpanded && 'detailPanelToggleCell--expanded']
  };
  return composeClasses(slots, getDataGridUtilityClass, classes);
};

var GridDetailPanelToggleCell = function GridDetailPanelToggleCell(props) {
  var id = props.id,
      isExpanded = props.value;
  var rootProps = useGridRootProps();
  var apiRef = useGridApiContext();
  var ownerState = {
    classes: rootProps.classes,
    isExpanded: isExpanded
  };
  var classes = useUtilityClasses(ownerState);
  var contentCache = useGridSelector(apiRef, gridDetailPanelExpandedRowsContentCacheSelector);
  var hasContent = /*#__PURE__*/React.isValidElement(contentCache[id]);
  var Icon = isExpanded ? rootProps.components.DetailPanelCollapseIcon : rootProps.components.DetailPanelExpandIcon;
  return /*#__PURE__*/_jsx(IconButton, {
    size: "small",
    tabIndex: -1,
    disabled: !hasContent,
    className: classes.root,
    "aria-label": isExpanded ? apiRef.current.getLocaleText('collapseDetailPanel') : apiRef.current.getLocaleText('expandDetailPanel'),
    children: /*#__PURE__*/_jsx(Icon, {
      fontSize: "inherit"
    })
  });
};

process.env.NODE_ENV !== "production" ? GridDetailPanelToggleCell.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------

  /**
   * GridApi that let you manipulate the grid.
   * @deprecated Use the `apiRef` returned by `useGridApiContext` or `useGridApiRef` (only available in `@mui/x-data-grid-pro`)
   */
  api: PropTypes.any.isRequired,

  /**
   * The mode of the cell.
   */
  cellMode: PropTypes.oneOf(['edit', 'view']).isRequired,

  /**
   * The column of the row that the current cell belongs to.
   */
  colDef: PropTypes.object.isRequired,

  /**
   * The column field of the cell that triggered the event.
   */
  field: PropTypes.string.isRequired,

  /**
   * The cell value formatted with the column valueFormatter.
   */
  formattedValue: PropTypes.any,

  /**
   * Get the cell value of a row and field.
   * @param {GridRowId} id The row id.
   * @param {string} field The field.
   * @returns {any} The cell value.
   * @deprecated Use `params.row` to directly access the fields you want instead.
   */
  getValue: PropTypes.func.isRequired,

  /**
   * If true, the cell is the active element.
   */
  hasFocus: PropTypes.bool.isRequired,

  /**
   * The grid row id.
   */
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,

  /**
   * If true, the cell is editable.
   */
  isEditable: PropTypes.bool,

  /**
   * The row model of the row that the current cell belongs to.
   */
  row: PropTypes.object.isRequired,

  /**
   * The node of the row that the current cell belongs to.
   */
  rowNode: PropTypes.object.isRequired,

  /**
   * the tabIndex value.
   */
  tabIndex: PropTypes.oneOf([-1, 0]).isRequired,

  /**
   * The cell value, but if the column has valueGetter, use getValue.
   */
  value: PropTypes.any
} : void 0;
export { GridDetailPanelToggleCell };