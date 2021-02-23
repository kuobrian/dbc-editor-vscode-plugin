
import * as CANDB from "../../src/candb_provider";

export interface SignalInMsg{
    id: string;
    startbit: number;
    multiplexortype: string;
}


export interface IMsgProps {
    msg: CANDB.MessageForm;
    listOfSignal: CANDB.SignalForm[];
    listOfNetworknode: CANDB.NetworkNodesForm[]
    isPreview: boolean;
    connection: any[];
    updateValue?: (arg0: CANDB.MessageForm, arg1: SignalInMsg[]) => void;
}

export interface ISignalProps {
    signal: CANDB.SignalForm;
    listOfMsg: CANDB.MessageForm[];
    isPreview: boolean;
    connection: string[];
    updateValue?: (arg0: CANDB.SignalForm, arg1: string[]) => void;

}

export interface INNProps {
    netwoknode: CANDB.NetworkNodesForm;
    allMessages: CANDB.MessageForm[];
    allSignals: CANDB.SignalForm[];
    connectionMsg: CANDB.MsgConnection[];
    connectionSignal: CANDB.SignalConnection[];
    updateValue?: (arg0: CANDB.NetworkNodesForm) => void;
}
  
export interface ISelItemsState {
    selectItem: any[];
    show: boolean;
}
  
export interface ITransmittersTableState {
    selectTransmitters: any[];
    show: boolean;
}