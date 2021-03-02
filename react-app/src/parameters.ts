
import * as CANDB from "../../src/candb_provider";

export interface SignalInMsg{
    id: string;
    startbit: number;
    multiplexortype: string;
}

export interface IAttrProps {
    msg: CANDB.MessageForm;
    attributes: CANDB.DBCAttribute[];
    listOfSignal: CANDB.SignalForm[];
    listOfNetworknode: CANDB.NetworkNodesForm[]
    connection: any[];
}

export interface IMsgProps {
    msg: CANDB.MessageForm;
    listOfSignal: CANDB.SignalForm[];
    listOfNetworknode: CANDB.NetworkNodesForm[]
    connection: CANDB.MsgConnection;
}

export interface ISignalProps {
    signal: CANDB.SignalForm;
    listOfMsg: CANDB.MessageForm[];
    connection: CANDB.SignalConnection;

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