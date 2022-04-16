import * as React from 'react';
import { useGridApiEventHandler, GridEvents, gridFilteredDescendantCountLookupSelector } from '@mui/x-data-grid';

/**
 * Only available in DataGridPro
 */
export const useGridTreeData = apiRef => {
  /**
   * EVENTS
   */
  const handleCellKeyDown = React.useCallback((params, event) => {
    const cellParams = apiRef.current.getCellParams(params.id, params.field);

    if (cellParams.colDef.type === 'treeDataGroup' && event.key === ' ' && !event.shiftKey) {
      event.stopPropagation();
      event.preventDefault();
      const filteredDescendantCount = gridFilteredDescendantCountLookupSelector(apiRef)[params.id] ?? 0;

      if (filteredDescendantCount === 0) {
        return;
      }

      apiRef.current.setRowChildrenExpansion(params.id, !params.rowNode.childrenExpanded);
    }
  }, [apiRef]);
  useGridApiEventHandler(apiRef, GridEvents.cellKeyDown, handleCellKeyDown);
};