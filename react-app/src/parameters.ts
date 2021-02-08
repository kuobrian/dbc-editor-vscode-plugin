
import {SignalForm, MessageForm} from "../../src/candb_provider";


export interface IMsgProps {
    msg: MessageForm;
    allSignals: SignalForm[];
    updateValue: (arg0: MessageForm) => void;
}

export interface ISignalProps {
    signal: SignalForm;
    allMessages: MessageForm[];
    updateValue: (arg0: SignalForm) => void;
}
  
export interface ISelItemsState {
    selectItem: any[];
    show: boolean;
}
  
export interface ITransmittersTableState {
    selectTransmitters: any[];
    show: boolean;
}