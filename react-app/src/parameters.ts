
import {SignalForm, MessageForm, NetworkNodesForm} from "../../src/candb_provider";

export interface SignalInMsg{
    id: string;
    startbit: number;
    multiplexortype: string;
}


export interface IMsgProps {
    msg: MessageForm;
    listOfSignal: SignalForm[];
    listOfNetworknode: NetworkNodesForm[]
    isPreview: boolean;
    connection: any[];
    updateValue?: (arg0: MessageForm, arg1: SignalInMsg[]) => void;
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