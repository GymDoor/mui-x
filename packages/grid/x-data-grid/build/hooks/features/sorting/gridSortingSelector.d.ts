import { GridSortDirection, GridSortModel } from '../../../models/gridSortModel';
import { GridStateCommunity } from '../../../models/gridStateCommunity';
/**
 * @category Sorting
 * @ignore - do not document.
 */
export declare const gridSortingStateSelector: (state: GridStateCommunity) => import("./gridSortingState").GridSortingState;
/**
 * Get the id of the rows after the sorting process.
 * @category Sorting
 */
export declare const gridSortedRowIdsSelector: import("../../../utils/createSelector").OutputSelector<GridStateCommunity, import("../../..").GridRowId[]>;
/**
 * Get the id and the model of the rows after the sorting process.
 * @category Sorting
 */
export declare const gridSortedRowEntriesSelector: import("../../../utils/createSelector").OutputSelector<GridStateCommunity, {
    id: import("../../..").GridRowId;
    model: any;
}[]>;
/**
 * Get the current sorting model.
 * @category Sorting
 */
export declare const gridSortModelSelector: import("../../../utils/createSelector").OutputSelector<GridStateCommunity, GridSortModel>;
export declare type GridSortColumnLookup = Record<string, {
    sortDirection: GridSortDirection;
    sortIndex?: number;
}>;
/**
 * @category Sorting
 * @ignore - do not document.
 */
export declare const gridSortColumnLookupSelector: import("../../../utils/createSelector").OutputSelector<GridStateCommunity, GridSortColumnLookup>;
