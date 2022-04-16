"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useGridTreeData = void 0;

var React = _interopRequireWildcard(require("react"));

var _xDataGrid = require("@mui/x-data-grid");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/**
 * Only available in DataGridPro
 */
const useGridTreeData = apiRef => {
  /**
   * EVENTS
   */
  const handleCellKeyDown = React.useCallback((params, event) => {
    const cellParams = apiRef.current.getCellParams(params.id, params.field);

    if (cellParams.colDef.type === 'treeDataGroup' && event.key === ' ' && !event.shiftKey) {
      var _gridFilteredDescenda;

      event.stopPropagation();
      event.preventDefault();
      const filteredDescendantCount = (_gridFilteredDescenda = (0, _xDataGrid.gridFilteredDescendantCountLookupSelector)(apiRef)[params.id]) != null ? _gridFilteredDescenda : 0;

      if (filteredDescendantCount === 0) {
        return;
      }

      apiRef.current.setRowChildrenExpansion(params.id, !params.rowNode.childrenExpanded);
    }
  }, [apiRef]);
  (0, _xDataGrid.useGridApiEventHandler)(apiRef, _xDataGrid.GridEvents.cellKeyDown, handleCellKeyDown);
};

exports.useGridTreeData = useGridTreeData;