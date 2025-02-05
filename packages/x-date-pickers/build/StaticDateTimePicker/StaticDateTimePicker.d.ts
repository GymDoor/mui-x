import * as React from 'react';
import { BaseDateTimePickerProps } from '../DateTimePicker/shared';
import { PickerStaticWrapperProps } from '../internals/components/PickerStaticWrapper/PickerStaticWrapper';
export interface StaticDateTimePickerProps<TDate = unknown> extends BaseDateTimePickerProps<TDate> {
    /**
     * Force static wrapper inner components to be rendered in mobile or desktop mode.
     * @default 'mobile'
     */
    displayStaticWrapperAs?: PickerStaticWrapperProps['displayStaticWrapperAs'];
}
declare type StaticDateTimePickerComponent = (<TDate>(props: StaticDateTimePickerProps<TDate> & React.RefAttributes<HTMLDivElement>) => JSX.Element) & {
    propTypes?: any;
};
/**
 *
 * Demos:
 *
 * - [Date Time Picker](https://mui.com/x/react-date-pickers/date-time-picker/)
 *
 * API:
 *
 * - [StaticDateTimePicker API](https://mui.com/x/api/date-pickers/static-date-time-picker/)
 */
export declare const StaticDateTimePicker: StaticDateTimePickerComponent;
export {};
