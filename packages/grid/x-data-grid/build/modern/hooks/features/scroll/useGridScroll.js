import * as React from 'react';
import { useGridLogger } from '../../utils/useGridLogger';
import { gridColumnPositionsSelector, gridVisibleColumnDefinitionsSelector } from '../columns/gridColumnsSelector';
import { useGridSelector } from '../../utils/useGridSelector';
import { gridPageSelector, gridPageSizeSelector } from '../pagination/gridPaginationSelector';
import { gridRowCountSelector } from '../rows/gridRowsSelector';
import { gridRowsMetaSelector } from '../rows/gridRowsMetaSelector';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { gridVisibleSortedRowEntriesSelector } from '../filter/gridFilterSelector'; // Logic copied from https://www.w3.org/TR/wai-aria-practices/examples/listbox/js/listbox.js
// Similar to https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView

function scrollIntoView(dimensions) {
  const {
    clientHeight,
    scrollTop,
    offsetHeight,
    offsetTop
  } = dimensions;
  const elementBottom = offsetTop + offsetHeight;

  if (elementBottom - clientHeight > scrollTop) {
    return elementBottom - clientHeight;
  }

  if (offsetTop < scrollTop) {
    return offsetTop;
  }

  return undefined;
}
/**
 * @requires useGridPagination (state) - can be after, async only
 * @requires useGridColumns (state) - can be after, async only
 * @requires useGridRows (state) - can be after, async only
 * @requires useGridRowsMeta (state) - can be after, async only
 * @requires useGridFilter (state)
 * @requires useGridColumnSpanning (method)
 */


export const useGridScroll = (apiRef, props) => {
  const logger = useGridLogger(apiRef, 'useGridScroll');
  const colRef = apiRef.current.columnHeadersElementRef;
  const windowRef = apiRef.current.windowRef;
  const visibleSortedRows = useGridSelector(apiRef, gridVisibleSortedRowEntriesSelector);
  const scrollToIndexes = React.useCallback(params => {
    const totalRowCount = gridRowCountSelector(apiRef);
    const visibleColumns = gridVisibleColumnDefinitionsSelector(apiRef);
    const scrollToHeader = params.rowIndex == null;

    if (!scrollToHeader && totalRowCount === 0 || visibleColumns.length === 0) {
      return false;
    }

    logger.debug(`Scrolling to cell at row ${params.rowIndex}, col: ${params.colIndex} `);
    let scrollCoordinates = {};

    if (params.colIndex != null) {
      const columnPositions = gridColumnPositionsSelector(apiRef);
      let cellWidth;

      if (typeof params.rowIndex !== 'undefined') {
        const rowId = visibleSortedRows[params.rowIndex]?.id;
        const cellColSpanInfo = apiRef.current.unstable_getCellColSpanInfo(rowId, params.colIndex);

        if (cellColSpanInfo && !cellColSpanInfo.spannedByColSpan) {
          cellWidth = cellColSpanInfo.cellProps.width;
        }
      }

      if (typeof cellWidth === 'undefined') {
        cellWidth = visibleColumns[params.colIndex].computedWidth;
      }

      scrollCoordinates.left = scrollIntoView({
        clientHeight: windowRef.current.clientWidth,
        scrollTop: windowRef.current.scrollLeft,
        offsetHeight: cellWidth,
        offsetTop: columnPositions[params.colIndex]
      });
    }

    if (params.rowIndex != null) {
      const rowsMeta = gridRowsMetaSelector(apiRef.current.state);
      const page = gridPageSelector(apiRef);
      const pageSize = gridPageSizeSelector(apiRef);
      const elementIndex = !props.pagination ? params.rowIndex : params.rowIndex - page * pageSize;
      const targetOffsetHeight = rowsMeta.positions[elementIndex + 1] ? rowsMeta.positions[elementIndex + 1] - rowsMeta.positions[elementIndex] : rowsMeta.currentPageTotalHeight - rowsMeta.positions[elementIndex];
      scrollCoordinates.top = scrollIntoView({
        clientHeight: windowRef.current.clientHeight,
        scrollTop: windowRef.current.scrollTop,
        offsetHeight: targetOffsetHeight,
        offsetTop: rowsMeta.positions[elementIndex]
      });
    }

    scrollCoordinates = apiRef.current.unstable_applyPipeProcessors('scrollToIndexes', scrollCoordinates, params);

    if (typeof scrollCoordinates.left !== undefined || typeof scrollCoordinates.top !== undefined) {
      apiRef.current.scroll(scrollCoordinates);
      return true;
    }

    return false;
  }, [logger, apiRef, windowRef, props.pagination, visibleSortedRows]);
  const scroll = React.useCallback(params => {
    if (windowRef.current && params.left != null && colRef.current) {
      colRef.current.scrollLeft = params.left;
      windowRef.current.scrollLeft = params.left;
      logger.debug(`Scrolling left: ${params.left}`);
    }

    if (windowRef.current && params.top != null) {
      windowRef.current.scrollTop = params.top;
      logger.debug(`Scrolling top: ${params.top}`);
    }

    logger.debug(`Scrolling, updating container, and viewport`);
  }, [windowRef, colRef, logger]);
  const getScrollPosition = React.useCallback(() => {
    if (!windowRef?.current) {
      return {
        top: 0,
        left: 0
      };
    }

    return {
      top: windowRef.current.scrollTop,
      left: windowRef.current.scrollLeft
    };
  }, [windowRef]);
  const scrollApi = {
    scroll,
    scrollToIndexes,
    getScrollPosition
  };
  useGridApiMethod(apiRef, scrollApi, 'GridScrollApi');
};