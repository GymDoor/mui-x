import * as React from 'react';
export declare const isEscapeKey: (key: string) => boolean;
export declare const isEnterKey: (key: string) => boolean;
export declare const isTabKey: (key: string) => boolean;
export declare const isSpaceKey: (key: string) => boolean;
export declare const isArrowKeys: (key: string) => boolean;
export declare const isHomeOrEndKeys: (key: string) => boolean;
export declare const isPageKeys: (key: string) => boolean;
export declare const isDeleteKeys: (key: string) => boolean;
export declare const isPrintableKey: (key: string) => boolean;
export declare const GRID_MULTIPLE_SELECTION_KEYS: string[];
export declare const GRID_CELL_EXIT_EDIT_MODE_KEYS: string[];
export declare const GRID_CELL_EDIT_COMMIT_KEYS: string[];
export declare const isMultipleKey: (key: string) => boolean;
export declare const isCellEnterEditModeKeys: (key: string) => boolean;
export declare const isCellExitEditModeKeys: (key: string) => boolean;
export declare const isCellEditCommitKeys: (key: string) => boolean;
export declare const isNavigationKey: (key: string) => boolean;
export declare const isKeyboardEvent: (event: any) => event is React.KeyboardEvent<HTMLElement>;
export declare const isHideMenuKey: (key: React.KeyboardEvent['key']) => boolean;
