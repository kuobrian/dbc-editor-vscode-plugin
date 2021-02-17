
import {SignalForm, MessageForm, NetworkNodesForm} from "../../src/candb_provider";


export interface IMsgProps {
    msg: MessageForm;
    listOfSignal: SignalForm[];
    isPreview: boolean;
    connection: string[];
    updateValue?: (arg0: MessageForm, arg1: string[]) => void;
}

export interface ISignalProps {
    signal: SignalForm;
    listOfMsg: MessageForm[];
    isPreview: boolean;
    connection: string[];
    updateValue?: (arg0: SignalForm, arg1: string[]) => void;

}

export interface INNProps {
    netwoknode: NetworkNodesForm;
    allMessages: MessageForm[];
    allSignals: SignalForm[];
    updateValue?: (arg0: NetworkNodesForm) => void;
}
  
export interface ISelItemsState {
    selectItem: any[];
    show: boolean;
}
  
export interface ITransmittersTableState {
    selectTransmitters: any[];
    show: boolean;
}