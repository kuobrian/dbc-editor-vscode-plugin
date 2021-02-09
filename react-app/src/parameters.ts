
import {SignalForm, MessageForm, NetworkNodesForm} from "../../src/candb_provider";


export interface IMsgProps {
    msg: MessageForm;
    allSignals: SignalForm[];
    isPreview: boolean;
    updateValue?: (arg0: MessageForm) => void |undefined;
}

export interface ISignalProps {
    signal: SignalForm;
    allMessages: MessageForm[];
    isPreview: boolean;
    updateValue?: (arg0: SignalForm) => void;

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