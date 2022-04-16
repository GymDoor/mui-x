import * as React from 'react';
import { GridApiCommunity } from '../../../models/api/gridApiCommunity';
/**
 * @requires useGridColumns (state)
 * @requires useGridFilter (state)
 * @requires useGridSorting (state)
 * @requires useGridSelection (state)
 * @requires useGridParamsApi (method)
 */
export declare const useGridCsvExport: (apiRef: React.MutableRefObject<GridApiCommunity>) => void;
