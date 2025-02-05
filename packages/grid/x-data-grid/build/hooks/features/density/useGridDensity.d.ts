import * as React from 'react';
import { GridApiCommunity } from '../../../models/api/gridApiCommunity';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { GridStateInitializer } from '../../utils/useGridInitializeState';
export declare const COMPACT_DENSITY_FACTOR = 0.7;
export declare const COMFORTABLE_DENSITY_FACTOR = 1.3;
export declare const densityStateInitializer: GridStateInitializer<Pick<DataGridProcessedProps, 'density' | 'headerHeight' | 'rowHeight'>>;
export declare const useGridDensity: (apiRef: React.MutableRefObject<GridApiCommunity>, props: Pick<DataGridProcessedProps, 'headerHeight' | 'rowHeight' | 'density'>) => void;
