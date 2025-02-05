import * as React from 'react';
import { BaseDateTimePickerProps } from '../DateTimePicker/shared';
import { MobileWrapperProps } from '../internals/components/wrappers/MobileWrapper';
export interface MobileDateTimePickerProps<TDate = unknown> extends BaseDateTimePickerProps<TDate>, MobileWrapperProps {
}
declare type MobileDateTimePickerComponent = (<TDate>(props: MobileDateTimePickerProps<TDate> & React.RefAttributes<HTMLDivElement>) => JSX.Element) & {
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
 * - [MobileDateTimePicker API](https://mui.com/x/api/date-pickers/mobile-date-time-picker/)
 */
export declare const MobileDateTimePicker: MobileDateTimePickerComponent;
export {};
