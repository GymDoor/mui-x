import * as React from 'react';
import { useGridApiEventHandler, GridEvents, gridFilteredDescendantCountLookupSelector } from '@mui/x-data-grid';

/**
 * Only available in DataGridPro
 */
export var useGridTreeData = function useGridTreeData(apiRef) {
  /**
   * EVENTS
   */
  var handleCellKeyDown = React.useCallback(function (params, event) {
    var cellParams = apiRef.current.getCellParams(params.id, params.field);

    if (cellParams.colDef.type === 'treeDataGroup' && event.key === ' ' && !event.shiftKey) {
      var _gridFilteredDescenda;

      event.stopPropagation();
      event.preventDefault();
      var filteredDescendantCount = (_gridFilteredDescenda = gridFilteredDescendantCountLookupSelector(apiRef)[params.id]) != null ? _gridFilteredDescenda : 0;

      if (filteredDescendantCount === 0) {
        return;
      }

      apiRef.current.setRowChildrenExpansion(params.id, !params.rowNode.childrenExpanded);
    }
  }, [apiRef]);
  useGridApiEventHandler(apiRef, GridEvents.cellKeyDown, handleCellKeyDown);
};