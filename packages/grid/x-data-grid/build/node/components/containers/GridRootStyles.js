"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GridRootStyles = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _styles = require("@mui/material/styles");

var _gridClasses = require("../../constants/gridClasses");

const GridRootStyles = (0, _styles.styled)('div', {
  name: 'MuiDataGrid',
  slot: 'Root',
  overridesResolver: (props, styles) => [{
    [`&.${_gridClasses.gridClasses.autoHeight}`]: styles.autoHeight
  }, {
    [`& .${_gridClasses.gridClasses.editBooleanCell}`]: styles.editBooleanCell
  }, {
    [`& .${_gridClasses.gridClasses['cell--editing']}`]: styles['cell--editing']
  }, {
    [`& .${_gridClasses.gridClasses['cell--textCenter']}`]: styles['cell--textCenter']
  }, {
    [`& .${_gridClasses.gridClasses['cell--textLeft']}`]: styles['cell--textLeft']
  }, {
    [`& .${_gridClasses.gridClasses['cell--textRight']}`]: styles['cell--textRight']
  }, // TODO v6: Remove
  {
    [`& .${_gridClasses.gridClasses['cell--withRenderer']}`]: styles['cell--withRenderer']
  }, {
    [`& .${_gridClasses.gridClasses.cell}`]: styles.cell
  }, {
    [`& .${_gridClasses.gridClasses.cellContent}`]: styles.cellContent
  }, {
    [`& .${_gridClasses.gridClasses.cellCheckbox}`]: styles.cellCheckbox
  }, {
    [`& .${_gridClasses.gridClasses.checkboxInput}`]: styles.checkboxInput
  }, {
    [`& .${_gridClasses.gridClasses['columnHeader--alignCenter']}`]: styles['columnHeader--alignCenter']
  }, {
    [`& .${_gridClasses.gridClasses['columnHeader--alignLeft']}`]: styles['columnHeader--alignLeft']
  }, {
    [`& .${_gridClasses.gridClasses['columnHeader--alignRight']}`]: styles['columnHeader--alignRight']
  }, {
    [`& .${_gridClasses.gridClasses['columnHeader--dragging']}`]: styles['columnHeader--dragging']
  }, {
    [`& .${_gridClasses.gridClasses['columnHeader--moving']}`]: styles['columnHeader--moving']
  }, {
    [`& .${_gridClasses.gridClasses['columnHeader--numeric']}`]: styles['columnHeader--numeric']
  }, {
    [`& .${_gridClasses.gridClasses['columnHeader--sortable']}`]: styles['columnHeader--sortable']
  }, {
    [`& .${_gridClasses.gridClasses['columnHeader--sorted']}`]: styles['columnHeader--sorted']
  }, {
    [`& .${_gridClasses.gridClasses.columnHeader}`]: styles.columnHeader
  }, {
    [`& .${_gridClasses.gridClasses.columnHeaderCheckbox}`]: styles.columnHeaderCheckbox
  }, {
    [`& .${_gridClasses.gridClasses.columnHeaderDraggableContainer}`]: styles.columnHeaderDraggableContainer
  }, {
    [`& .${_gridClasses.gridClasses.columnHeaderTitleContainer}`]: styles.columnHeaderTitleContainer
  }, {
    [`& .${_gridClasses.gridClasses['columnSeparator--resizable']}`]: styles['columnSeparator--resizable']
  }, {
    [`& .${_gridClasses.gridClasses['columnSeparator--resizing']}`]: styles['columnSeparator--resizing']
  }, {
    [`& .${_gridClasses.gridClasses.columnSeparator}`]: styles.columnSeparator
  }, {
    [`& .${_gridClasses.gridClasses.filterIcon}`]: styles.filterIcon
  }, {
    [`& .${_gridClasses.gridClasses.iconSeparator}`]: styles.iconSeparator
  }, {
    [`& .${_gridClasses.gridClasses.menuIcon}`]: styles.menuIcon
  }, {
    [`& .${_gridClasses.gridClasses.menuIconButton}`]: styles.menuIconButton
  }, {
    [`& .${_gridClasses.gridClasses.menuOpen}`]: styles.menuOpen
  }, {
    [`& .${_gridClasses.gridClasses.menuList}`]: styles.menuList
  }, {
    [`& .${_gridClasses.gridClasses['row--editable']}`]: styles['row--editable']
  }, {
    [`& .${_gridClasses.gridClasses['row--editing']}`]: styles['row--editing']
  }, {
    [`& .${_gridClasses.gridClasses.row}`]: styles.row
  }, {
    [`& .${_gridClasses.gridClasses.sortIcon}`]: styles.sortIcon
  }, {
    [`& .${_gridClasses.gridClasses.withBorder}`]: styles.withBorder
  }, {
    [`& .${_gridClasses.gridClasses.treeDataGroupingCell}`]: styles.treeDataGroupingCell
  }, {
    [`& .${_gridClasses.gridClasses.treeDataGroupingCellToggle}`]: styles.treeDataGroupingCellToggle
  }, {
    [`& .${_gridClasses.gridClasses.detailPanelToggleCell}`]: styles.detailPanelToggleCell
  }, {
    [`& .${_gridClasses.gridClasses['detailPanelToggleCell--expanded']}`]: styles['detailPanelToggleCell--expanded']
  }, styles.root]
})(({
  theme
}) => {
  const borderColor = theme.palette.mode === 'light' ? (0, _styles.lighten)((0, _styles.alpha)(theme.palette.divider, 1), 0.88) : (0, _styles.darken)((0, _styles.alpha)(theme.palette.divider, 1), 0.68);
  const gridStyle = (0, _extends2.default)({
    flex: 1,
    boxSizing: 'border-box',
    position: 'relative',
    border: `1px solid ${borderColor}`,
    borderRadius: theme.shape.borderRadius,
    color: theme.palette.text.primary
  }, theme.typography.body2, {
    outline: 'none',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    [`&.${_gridClasses.gridClasses.autoHeight}`]: {
      height: 'auto',
      [`& .${_gridClasses.gridClasses['row--lastVisible']} .${_gridClasses.gridClasses.cell}`]: {
        borderBottomColor: 'transparent'
      }
    },
    [`& .${_gridClasses.gridClasses['virtualScrollerContent--overflowed']} .${_gridClasses.gridClasses['row--lastVisible']} .${_gridClasses.gridClasses.cell}`]: {
      borderBottomColor: 'transparent'
    },
    [`& .${_gridClasses.gridClasses.columnHeader}, & .${_gridClasses.gridClasses.cell}`]: {
      WebkitTapHighlightColor: 'transparent',
      lineHeight: null,
      padding: '0 10px',
      boxSizing: 'border-box'
    },
    [`& .${_gridClasses.gridClasses.columnHeader}:focus-within, & .${_gridClasses.gridClasses.cell}:focus-within`]: {
      outline: `solid ${(0, _styles.alpha)(theme.palette.primary.main, 0.5)} 1px`,
      outlineWidth: 1,
      outlineOffset: -1
    },
    [`& .${_gridClasses.gridClasses.columnHeader}:focus, & .${_gridClasses.gridClasses.cell}:focus`]: {
      outline: `solid ${theme.palette.primary.main} 1px`
    },
    [`& .${_gridClasses.gridClasses.columnHeaderCheckbox}, & .${_gridClasses.gridClasses.cellCheckbox}`]: {
      padding: 0,
      justifyContent: 'center',
      alignItems: 'center'
    },
    [`& .${_gridClasses.gridClasses.columnHeader}`]: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center'
    },
    [`& .${_gridClasses.gridClasses['columnHeader--sorted']} .${_gridClasses.gridClasses.iconButtonContainer}, & .${_gridClasses.gridClasses['columnHeader--filtered']} .${_gridClasses.gridClasses.iconButtonContainer}`]: {
      visibility: 'visible',
      width: 'auto'
    },
    [`& .${_gridClasses.gridClasses.columnHeader}:not(.${_gridClasses.gridClasses['columnHeader--sorted']}) .${_gridClasses.gridClasses.sortIcon}`]: {
      opacity: 0,
      transition: theme.transitions.create(['opacity'], {
        duration: theme.transitions.duration.shorter
      })
    },
    [`& .${_gridClasses.gridClasses.columnHeader}:not(.${_gridClasses.gridClasses['columnHeader--sorted']}):hover .${_gridClasses.gridClasses.sortIcon}`]: {
      opacity: 0.5
    },
    [`& .${_gridClasses.gridClasses.columnHeaderTitleContainer}`]: {
      display: 'flex',
      alignItems: 'center',
      minWidth: 0,
      flex: 1,
      whiteSpace: 'nowrap',
      overflow: 'hidden'
    },
    [`& .${_gridClasses.gridClasses.columnHeaderTitleContainerContent}`]: {
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center'
    },
    [`& .${_gridClasses.gridClasses.sortIcon}, & .${_gridClasses.gridClasses.filterIcon}`]: {
      fontSize: 'inherit'
    },
    [`& .${_gridClasses.gridClasses['columnHeader--sortable']}`]: {
      cursor: 'pointer'
    },
    [`& .${_gridClasses.gridClasses['columnHeader--alignCenter']} .${_gridClasses.gridClasses.columnHeaderTitleContainer}`]: {
      justifyContent: 'center'
    },
    [`& .${_gridClasses.gridClasses['columnHeader--alignRight']} .${_gridClasses.gridClasses.columnHeaderDraggableContainer}, & .${_gridClasses.gridClasses['columnHeader--alignRight']} .${_gridClasses.gridClasses.columnHeaderTitleContainer}`]: {
      flexDirection: 'row-reverse'
    },
    [`& .${_gridClasses.gridClasses['columnHeader--alignCenter']} .${_gridClasses.gridClasses.menuIcon}, & .${_gridClasses.gridClasses['columnHeader--alignRight']} .${_gridClasses.gridClasses.menuIcon}`]: {
      marginRight: 'auto',
      marginLeft: -6
    },
    [`& .${_gridClasses.gridClasses['columnHeader--alignRight']} .${_gridClasses.gridClasses.menuIcon}, & .${_gridClasses.gridClasses['columnHeader--alignRight']} .${_gridClasses.gridClasses.menuIcon}`]: {
      marginRight: 'auto',
      marginLeft: -10
    },
    [`& .${_gridClasses.gridClasses['columnHeader--moving']}`]: {
      backgroundColor: theme.palette.action.hover
    },
    [`& .${_gridClasses.gridClasses.columnSeparator}`]: {
      position: 'absolute',
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      color: borderColor
    },
    [`& .${_gridClasses.gridClasses['columnSeparator--sideLeft']}`]: {
      left: -12
    },
    [`& .${_gridClasses.gridClasses['columnSeparator--sideRight']}`]: {
      right: -12
    },
    [`& .${_gridClasses.gridClasses['columnSeparator--resizable']}`]: {
      cursor: 'col-resize',
      touchAction: 'none',
      '&:hover': {
        color: theme.palette.text.primary,
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          color: borderColor
        }
      },
      [`&.${_gridClasses.gridClasses['columnSeparator--resizing']}`]: {
        color: theme.palette.text.primary
      }
    },
    [`& .${_gridClasses.gridClasses.iconSeparator}`]: {
      color: 'inherit'
    },
    [`& .${_gridClasses.gridClasses.menuIcon}`]: {
      width: 0,
      visibility: 'hidden',
      fontSize: 20,
      marginRight: -10,
      display: 'flex',
      alignItems: 'center'
    },
    [`& .${_gridClasses.gridClasses.columnHeader}:hover`]: {
      [`& .${_gridClasses.gridClasses.iconButtonContainer}`]: {
        visibility: 'visible',
        width: 'auto'
      },
      [`& .${_gridClasses.gridClasses.menuIcon}`]: {
        width: 'auto',
        visibility: 'visible'
      }
    },
    [`.${_gridClasses.gridClasses.menuOpen}`]: {
      visibility: 'visible',
      width: 'auto'
    },
    [`& .${_gridClasses.gridClasses.row}`]: {
      display: 'flex',
      width: 'fit-content',
      breakInside: 'avoid',
      // Avoid the row to be broken in two different print pages.
      '&:hover, &.Mui-hovered': {
        backgroundColor: theme.palette.action.hover,
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          backgroundColor: 'transparent'
        }
      },
      '&.Mui-selected': {
        backgroundColor: (0, _styles.alpha)(theme.palette.primary.main, theme.palette.action.selectedOpacity),
        '&:hover, &.Mui-hovered': {
          backgroundColor: (0, _styles.alpha)(theme.palette.primary.main, theme.palette.action.selectedOpacity + theme.palette.action.hoverOpacity),
          // Reset on touch devices, it doesn't add specificity
          '@media (hover: none)': {
            backgroundColor: (0, _styles.alpha)(theme.palette.primary.main, theme.palette.action.selectedOpacity)
          }
        }
      }
    },
    [`& .${_gridClasses.gridClasses.cell}`]: {
      display: 'flex',
      alignItems: 'center',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      borderBottom: `1px solid ${borderColor}`
    },
    [`& .${_gridClasses.gridClasses.cellContent}`]: {
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    [`& .${_gridClasses.gridClasses.cell}.${_gridClasses.gridClasses['cell--editing']}`]: {
      padding: 1,
      display: 'flex',
      boxShadow: theme.shadows[2],
      backgroundColor: theme.palette.background.paper,
      '&:focus-within': {
        outline: `solid ${theme.palette.primary.main} 1px`,
        outlineOffset: '-1px'
      }
    },
    [`& .${_gridClasses.gridClasses['row--editing']}`]: {
      boxShadow: theme.shadows[2]
    },
    [`& .${_gridClasses.gridClasses['row--editing']} .${_gridClasses.gridClasses.cell}`]: {
      boxShadow: theme.shadows[0],
      backgroundColor: theme.palette.background.paper
    },
    [`& .${_gridClasses.gridClasses.editBooleanCell}`]: {
      display: 'flex',
      height: '100%',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center'
    },
    [`& .${_gridClasses.gridClasses.booleanCell}[data-value="true"]`]: {
      color: theme.palette.text.secondary
    },
    [`& .${_gridClasses.gridClasses.booleanCell}[data-value="false"]`]: {
      color: theme.palette.text.disabled
    },
    [`& .${_gridClasses.gridClasses.actionsCell}`]: {
      display: 'inline-flex',
      alignItems: 'center',
      gridGap: theme.spacing(1)
    },
    [`& .${_gridClasses.gridClasses.withBorder}`]: {
      borderRight: `1px solid ${borderColor}`
    },
    [`& .${_gridClasses.gridClasses['cell--textLeft']}`]: {
      justifyContent: 'flex-start'
    },
    [`& .${_gridClasses.gridClasses['cell--textRight']}`]: {
      justifyContent: 'flex-end'
    },
    [`& .${_gridClasses.gridClasses['cell--textCenter']}`]: {
      justifyContent: 'center'
    },
    [`& .${_gridClasses.gridClasses.columnHeaderDraggableContainer}`]: {
      display: 'flex',
      width: '100%'
    },
    [`& .${_gridClasses.gridClasses['columnHeader--dragging']}`]: {
      background: theme.palette.background.paper,
      padding: '0 12px',
      borderRadius: theme.shape.borderRadius,
      opacity: theme.palette.action.disabledOpacity
    },
    [`& .${_gridClasses.gridClasses.treeDataGroupingCell}`]: {
      display: 'flex',
      alignItems: 'center',
      width: '100%'
    },
    [`& .${_gridClasses.gridClasses.treeDataGroupingCellToggle}`]: {
      flex: '0 0 28px',
      alignSelf: 'stretch',
      marginRight: theme.spacing(2)
    },
    [`& .${_gridClasses.gridClasses.groupingCriteriaCell}`]: {
      display: 'flex',
      alignItems: 'center',
      width: '100%'
    },
    [`& .${_gridClasses.gridClasses.groupingCriteriaCellToggle}`]: {
      flex: '0 0 28px',
      alignSelf: 'stretch',
      marginRight: theme.spacing(2)
    }
  });
  return gridStyle;
});
exports.GridRootStyles = GridRootStyles;