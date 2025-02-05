import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import { useGridVisibleRows } from '../../utils/useGridVisibleRows';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { useGridSelector } from '../../utils/useGridSelector';
import { gridDensityRowHeightSelector, gridDensityFactorSelector } from '../density/densitySelector';
import { gridFilterStateSelector } from '../filter/gridFilterSelector';
import { gridPaginationSelector } from '../pagination/gridPaginationSelector';
import { gridSortingStateSelector } from '../sorting/gridSortingSelector';
import { useGridRegisterPipeApplier } from '../../core/pipeProcessing';
export const rowsMetaStateInitializer = state => _extends({}, state, {
  rowsMeta: {
    currentPageTotalHeight: 0,
    positions: []
  }
});
/**
 * @requires useGridPageSize (method)
 * @requires useGridPage (method)
 */

export const useGridRowsMeta = (apiRef, props) => {
  const {
    getRowHeight,
    getRowSpacing
  } = props;
  const rowsHeightLookup = React.useRef({});
  const rowHeight = useGridSelector(apiRef, gridDensityRowHeightSelector);
  const filterState = useGridSelector(apiRef, gridFilterStateSelector);
  const paginationState = useGridSelector(apiRef, gridPaginationSelector);
  const sortingState = useGridSelector(apiRef, gridSortingStateSelector);
  const currentPage = useGridVisibleRows(apiRef, props);
  const hydrateRowsMeta = React.useCallback(() => {
    apiRef.current.setState(state => {
      const positions = [];
      const densityFactor = gridDensityFactorSelector(state, apiRef.current.instanceId);
      const currentRowHeight = gridDensityRowHeightSelector(state, apiRef.current.instanceId);
      const currentPageTotalHeight = currentPage.rows.reduce((acc, row) => {
        positions.push(acc);
        let baseRowHeight;
        const isResized = rowsHeightLookup.current[row.id] && rowsHeightLookup.current[row.id].isResized || false;

        if (isResized) {
          // do not recalculate resized row height and use the value from the lookup
          baseRowHeight = rowsHeightLookup.current[row.id].value;
        } else {
          baseRowHeight = currentRowHeight;

          if (getRowHeight) {
            // Default back to base rowHeight if getRowHeight returns null or undefined.
            baseRowHeight = getRowHeight(_extends({}, row, {
              densityFactor
            })) ?? currentRowHeight;
          }
        } // We use an object to make simple to check if a height is already added or not


        const initialHeights = {
          base: baseRowHeight
        };

        if (getRowSpacing) {
          const indexRelativeToCurrentPage = apiRef.current.getRowIndexRelativeToVisibleRows(row.id);
          const spacing = getRowSpacing(_extends({}, row, {
            isFirstVisible: indexRelativeToCurrentPage === 0,
            isLastVisible: indexRelativeToCurrentPage === currentPage.rows.length - 1,
            indexRelativeToCurrentPage
          }));
          initialHeights.spacingTop = spacing.top ?? 0;
          initialHeights.spacingBottom = spacing.bottom ?? 0;
        }

        const sizes = apiRef.current.unstable_applyPipeProcessors('rowHeight', initialHeights, row);
        const finalRowHeight = Object.values(sizes).reduce((acc2, value) => acc2 + value, 0);
        rowsHeightLookup.current[row.id] = {
          value: baseRowHeight,
          sizes,
          isResized
        };
        return acc + finalRowHeight;
      }, 0);
      return _extends({}, state, {
        rowsMeta: {
          currentPageTotalHeight,
          positions
        }
      });
    });
    apiRef.current.forceUpdate();
  }, [apiRef, currentPage.rows, getRowSpacing, getRowHeight]);

  const getTargetRowHeight = rowId => rowsHeightLookup.current[rowId]?.value || rowHeight;

  const getRowInternalSizes = rowId => rowsHeightLookup.current[rowId]?.sizes;

  const setRowHeight = React.useCallback((id, height) => {
    rowsHeightLookup.current[id] = {
      value: height,
      isResized: true,
      sizes: _extends({}, rowsHeightLookup.current[id].sizes, {
        base: height
      })
    };
    hydrateRowsMeta();
  }, [hydrateRowsMeta]); // The effect is used to build the rows meta data - currentPageTotalHeight and positions.
  // Because of variable row height this is needed for the virtualization

  React.useEffect(() => {
    hydrateRowsMeta();
  }, [rowHeight, filterState, paginationState, sortingState, hydrateRowsMeta]);
  useGridRegisterPipeApplier(apiRef, 'rowHeight', hydrateRowsMeta);
  const rowsMetaApi = {
    unstable_getRowHeight: getTargetRowHeight,
    unstable_getRowInternalSizes: getRowInternalSizes,
    unstable_setRowHeight: setRowHeight
  };
  useGridApiMethod(apiRef, rowsMetaApi, 'GridRowsMetaApi');
};