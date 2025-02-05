import { WrapperVariant } from '../components/wrappers/WrapperVariantContext';
import { MuiPickersAdapter } from '../models';
export interface PickerStateValueManager<TInputValue, TDateValue> {
    areValuesEqual: (utils: MuiPickersAdapter<TDateValue>, valueLeft: TDateValue, valueRight: TDateValue) => boolean;
    emptyValue: TDateValue;
    parseInput: (utils: MuiPickersAdapter<TDateValue>, value: TInputValue) => TDateValue;
    valueReducer?: (utils: MuiPickersAdapter<TDateValue>, prevValue: TDateValue | null, value: TDateValue) => TDateValue;
}
export declare type PickerSelectionState = 'partial' | 'shallow' | 'finish';
interface PickerStateProps<TInput, TDateValue> {
    disableCloseOnSelect?: boolean;
    open?: boolean;
    onAccept?: (date: TDateValue) => void;
    onChange: (date: TDateValue, keyboardInputValue?: string) => void;
    onClose?: () => void;
    onOpen?: () => void;
    value: TInput;
}
export declare const usePickerState: <TInput, TDateValue>(props: PickerStateProps<TInput, TDateValue>, valueManager: PickerStateValueManager<TInput, TDateValue>) => {
    pickerProps: {
        date: TDateValue;
        isMobileKeyboardViewOpen: boolean;
        toggleMobileKeyboardView: () => void;
        onDateChange: (newDate: TDateValue, wrapperVariant: WrapperVariant, selectionState?: PickerSelectionState) => void;
    };
    inputProps: {
        onChange: (date: TDateValue, keyboardInputValue?: string | undefined) => void;
        open: boolean;
        rawValue: TInput;
        openPicker: () => void;
    };
    wrapperProps: {
        open: boolean;
        onClear: () => void;
        onAccept: () => void;
        onDismiss: () => void;
        onSetToday: () => void;
    };
};
export {};
