import * as fs from 'fs';
import * as path from 'path';
import { PassThrough } from 'stream';

export function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export interface SignalForm {
    uid: string;
    name: string;
    bitlength: number;
    byteorder: string;
    valuetype: string;
    factor: number;
    minimun: number;
    maximum: number;
    offset: number;
    initValue: number;
    unit?: number;
    valuetable?: any;
    receivers: NetworkNodesForm[];
    attributes: DBCAttribute[];
    comments: string;
    [key: string]: any;
}

export interface MessageForm {
    uid: string;
    name: string;
    msgType: string;
    id: string;
    dlc: number;
    cycletime: number;
    comments: string;
    transmitters: NetworkNodesForm[];
    attributes: DBCAttribute[];
    [key: string]: any;
}

export interface NetworkNodesForm {
    uid: string;
    name: string;
    address: string;
    comments?: string;
    attributes: DBCAttribute[];
    [key: string]: any;
}

export interface SignalConnection {
    targetId: string;
    connection: string[];
}

export interface SignalInMsg {
    id: string
    startbit: number;
    attributes?: DBCAttribute[];
    multiplexortype: string;
}

export interface MsgConnection {
    targetId: string;
    connection: SignalInMsg[];
}

export interface DBCAttribute {
    uid: string;
    name: string;
    type: string;
    objectType: string;
    defaultValue: any;
    typeWithValue: any;
    values: any[];
    [key: string]: any;
}

export interface tableValue {
    value: string;
    name: string
    [key: string]: any;
}



export interface DBCValueTable {
    uid: string;
    name: string;
    tables: tableValue[];
    [key: string]: any;
}

export class AttributesDefs {
    symbol:any;
    name: string = '';
    objectType: string = '';
    typeWithValue: any;
    defaultValue: any;
    values: any[] = [];

    constructor(symbol: any) {
        this.symbol = symbol;
        this.name = symbol.attribute_name;
        this.defaultValue = symbol.attribute_default;
        switch (symbol.attribute_type) {
            case "STRING":
                this.typeWithValue = { "type": "String", "options": symbol.attribute_type_value};
                break; 
            case "ENUM":
                this.typeWithValue = { "type": "Enumeration", "options": symbol.attribute_type_value};
                break; 
            case "INT":
                this.typeWithValue = { "type": "Integer", "options": symbol.attribute_type_value};
                break; 
            case "HEX":
                this.typeWithValue = { "type": "Hex", "options": symbol.attribute_type_value};
                break; 
            case "FLOAT":
                this.typeWithValue = { "type": "Float", "options": symbol.attribute_type_value};
                break; 
        }

        switch (symbol.object_type) {
            case "BO_":
                this.objectType = "Message";
                break; 
            case "SG_":
                this.objectType = "Signal";
                break; 
            case "BU_":
                this.objectType = "Node";
                break; 
            case "":
                this.objectType = "Network";
                break; 
        }
        symbol.attribute_value.map((v: any) => {
            this.values.push(v);
        });
    }

    public _toObject():DBCAttribute {
        const item: DBCAttribute = {
                                    uid: uuidv4(),
                                    name: this.name,
                                    type: this.typeWithValue['type'],
                                    objectType : this.objectType,
                                    defaultValue: this.defaultValue,
                                    typeWithValue: this.typeWithValue['options'],
                                    values: this.values};
        return item;
    }
}




export class CANdb  {
    listOfItems = new Map();

    connectionSignal: SignalConnection[] = [];
    connectionMsg: MsgConnection[] = [];
    attributesdefs: DBCAttribute[] = [];
    valuetables: DBCValueTable[] = [];

    constructor(labels: string[]) {
        for(let label of labels) {
            this.listOfItems.set(label, []);
        }
    }

    public initConnection (root:string, uid:string) {
        if (root === "Signals"){
            this.connectionSignal.push({targetId: uid, connection:[]});
        }
        else if (root === "Messages") {
            this.connectionMsg.push({targetId: uid, connection:[]});
        }
    }
    
    public addIdInConnection (root:string, targetUid:string, inputUid:string, startbit=0, multiplexortype="Signal") {
        if (root === "Signals"){
            let idx = this.connectionSignal.findIndex((item:SignalConnection) => item.targetId === targetUid);
            this.connectionSignal[idx].connection.push(inputUid);
        }
        else if (root === "Messages") {
            let idx = this.connectionMsg.findIndex((item:MsgConnection) => item.targetId === targetUid);
            
            this.connectionMsg[idx].connection.push({ id: inputUid,
                                                    startbit: startbit,
                                                    attributes: [],
                                                    multiplexortype: multiplexortype});
        }
    }

    public deldIdInConnection (root:string, uid:string) {
        if (root === "Signals"){
            this.connectionSignal = this.connectionSignal.filter(item => item.targetId !== uid);
        }
        else if (root === "Messages") {
            this.connectionMsg = this.connectionMsg.filter(item => item.targetId !== uid);
        }
    }

    public itemsInCANdb () {
        console.log(this.listOfItems.keys());
    }

    public putAttributeInObject() {
        this.attributesdefs.map((attr: DBCAttribute) => {
            switch(attr.objectType) {
                case "Network":
                    return undefined;
                case "Node":
                    for (let val of attr.values) {
                        let idxNN = this.listOfItems.get("Network Node").findIndex((nn: MessageForm) => nn.name === val.node_name);
                        this.listOfItems.get("Network Node")[idxNN].attributes.push(attr);
                    }
                    break; 
                case "Message":
                    for (let val of attr.values) {
                        let messageid = "0x"+ val.message_id.toString(16);
                        let idxMsg = this.listOfItems.get("Messages").findIndex((m:MessageForm) => m.id === messageid);
                        this.listOfItems.get("Messages")[idxMsg].attributes.push(attr);
                    }
                    break; 
                case "Signal":
                    for (let val of attr.values) {
                        let messageid = "0x"+ val.message_id.toString(16);

                        let idxSignal = this.listOfItems.get("Signals").findIndex((s: SignalForm) => s.name === val.signal_name);
                        this.listOfItems.get("Signals")[idxSignal].attributes.push(attr);

                        let signalId = this.listOfItems.get("Signals").find((s:SignalForm) => s.name === val.signal_name).uid;
                        let msgId = this.listOfItems.get("Messages").find((m:MessageForm) => m.id === messageid).uid;
                        this.connectionMsg.forEach((item: MsgConnection) => {
                            if (item.targetId === msgId) {
                                item.connection.forEach((c: SignalInMsg) => {
                                    if (c.id === signalId) {
                                        (c.attributes === undefined)? c.attributes = [val] : c.attributes.push(val);
                                    }
                                });
                            }
                        } );
                    }
                    break; 
            }
        });
    }

    public equalizeConnection () {
        this.connectionMsg.map(mc => {
            mc.connection.map(item => {
                let idx = this.connectionSignal.findIndex(s => s.targetId === item.id);
                if (idx >= 0) {
                    if (!this.connectionSignal[idx].connection.includes(mc.targetId)) {
                        this.addIdInConnection("Signals", item.id, mc.targetId);
                    }
                }
                else {
                    this.addIdInConnection("Signals", item.id, mc.targetId);
                }
            });
        });
        this.connectionSignal.map(sc =>{
            sc.connection.map(mid => {
                let idx = this.connectionMsg.findIndex(m => m.targetId=== mid);
                if (idx >= 0 ) {
                    if (this.connectionMsg[idx].connection.findIndex(item => item.id === sc.targetId) < 0) {
                        this.addIdInConnection("Messages", mid, sc.targetId, 0, "signal");
                    }
                }
                else {
                    this.addIdInConnection("Messages", mid, sc.targetId, 0, "signal");
                }
            });
        });
    }

    public getAttributeLength () {
        return this.attributesdefs.length;
    }
    public toJsonData() {
        let jsonData = JSON.stringify(
            {
                signals: this.listOfItems.get("Signals"),
                messages: this.listOfItems.get("Messages"),
                network_node: this.listOfItems.get("Network Node"),
                connectionSignal: this.connectionSignal,
                connectionMsg: this.connectionMsg,
                attributes: this.attributesdefs,
                valuetable: this.valuetables
            }, null, 2);
        return jsonData;
    }

    public saveJsonFile(folder:string, filename:string) {
        let jsonData = this.toJsonData();
        let dbccontent = this.Json2Dbc();
        fs.writeFileSync(path.join(folder,(filename + ".dbc")), dbccontent);
        fs.writeFileSync(path.join(folder,(filename + ".json")), jsonData);
    }

    public Json2Dbc() : string  {
        let preTitle =  'VERSION ""\n\n\n'+
                        'NS_: \n' +
                        '\tNS_DESC_\n' +
                        '\tCM_\n' +
                        '\tBA_DEF_\n' +
                        '\tBA_\n' +
                        '\tVAL_\n' +
                        '\tCAT_DEF_\n' +
                        '\tCAT_\n' +
                        '\tFILTER\n' +
                        '\tBA_DEF_DEF_\n' +
                        '\tEV_DATA_\n' +
                        '\tENVVAR_DATA_\n' +
                        '\tSGTYPE_\n' +
                        '\tSGTYPE_VAL_\n' +
                        '\tBA_DEF_SGTYPE_\n' +
                        '\tBA_SGTYPE_\n' +
                        '\tSIG_TYPE_REF_\n' +
                        '\tVAL_TABLE_\n' +
                        '\tSIG_GROUP_\n' +
                        '\tSIG_VALTYPE_\n' +
                        '\tSIGTYPE_VALTYPE_\n' +
                        '\tBO_TX_BU_\n' +
                        '\tBA_DEF_REL_\n' +
                        '\tBA_REL_\n' +
                        '\tBA_DEF_DEF_REL_\n' +
                        '\tBU_SG_REL_\n' +
                        '\tBU_EV_REL_\n' +
                        '\tBU_BO_REL_\n' +
                        '\tSG_MUL_VAL_\n\n' +
                        'BS_:\n\n';
                        
        let nns = this.listOfItems.get("Network Node");
        let signals = this.listOfItems.get("Signals");
        let msgs =  this.listOfItems.get("Messages");
        let connectionMsg = this.connectionMsg;
        let attributes = this.attributesdefs;
        let valuetable =this.valuetables;
    
        let buString = 'BU_:';
        nns.forEach((nn: NetworkNodesForm) => {
            buString += ' ' + nn.name;
        });
        buString += '\n';
    
        // write value table
        let value_table_lines = "";
        valuetable.map((table :  DBCValueTable) => {
            let VT_string = 'VAL_TABLE_ ' + table.name;
            table.tables.map((element: tableValue) => {
                VT_string += " " + element.value+ " " + element.name;
            });
        VT_string += " ;"; 
        value_table_lines += VT_string +'\n';
        });
        let CM_string = "";
        let BO_string = "";
        msgs.map((msg : MessageForm) => {
            let Msg_string = 'BO_ ' + parseInt(msg.id, 16) + " " + msg.name + ": " + msg.dlc + " ";
            if (Object.keys(msg.transmitters).length > 0)
            {
                msg.transmitters.map(t => {
                    Msg_string += t.name + " ";
                });
            }
            else {
                Msg_string += "Vector__XXX ";
            }
            if (msg.comments !== ""){
                CM_string += 'CM_ BO_ ' + parseInt(msg.id, 16) + " \"" + msg.comments + "\" ;\n";
            }
    
            let connectionIdx = connectionMsg.findIndex((item : MsgConnection) => item.targetId === msg.uid);
            if (connectionIdx >=0) {
                let Signal_string = getSignalString(msg.uid, connectionMsg[connectionIdx], signals);
                BO_string += Msg_string + "\n" + Signal_string[0] + "\n";
                CM_string += Signal_string[1];

            }
        });
    
        let Attr_strings = "";
        let Attr_strings_defaults = "";
        let Attr_value_for_objects = "";
        attributes.map((attr : DBCAttribute) => {
            let Attr_string = 'BA_DEF_ ';
            let Attr_strings_default = "BA_DEF_DEF_  " + "\"" + attr.name + "\" " 
                                    +  `${attr.type.includes('Enum') || attr.type.includes('String')  ?  "\""+ attr.defaultValue + "\" ": attr.defaultValue}`;
                                    + "\n";
            let Attr_value_for_object_temp = "BA_ " + "\"" + attr.name + "\" "; 
            let Attr_value_for_object = "";
            switch(attr.objectType) { 
                case 'Message': { 
                    Attr_string += "BO_  ";
                    attr.values.map(v => {
                        Attr_value_for_object += Attr_value_for_object_temp + "BO_ "
                                                + v.message_id + " " + v.value + "\n";
                    });
                    break; 
                } 
                case "Signal": { 
                    Attr_string += "SG_  ";
                    attr.values.map(v => {
                        Attr_value_for_object += Attr_value_for_object_temp + "SG_ "
                                                + v.message_id + " " + v.signal_name + " " + v.value + "\n";
                    });
                    break; 
                } 
                case "Node": { 
                    Attr_string += "BU_  ";
                    attr.values.map(v => {
                        Attr_value_for_object += Attr_value_for_object_temp + "BU_ "
                                                + v.node_name + " " + parseInt(v.address, 16) + "\n";
                    });
                    break;; 
                }
                case "Network": { 
                    Attr_string += "  ";
                    attr.values.map(v => {
                        Attr_value_for_object += Attr_value_for_object_temp + " ";
                                                "\""+ v.value + "\"" + "\n";
                    });
                    break; 
                }
                case "Environmental Variable": { 
                    Attr_string += "EV_  ";
                    attr.values.map(v => {
                        // TODO Environmental Variable default value
                    });
                    break; 
                }
                default: { 
                    Attr_string += "  ";
                    break; 
                } 
            }
            Attr_string += "\"" + attr.name + "\" ";
            switch(attr.type) { 
                case 'String': { 
                    Attr_string += "STRING ;";
                    break; 
                } 
                case "Hex": { 
                    Attr_string += "HEX " + attr.typeWithValue[0] + " " + attr.typeWithValue[1] +" ;";
                    break; 
                } 
                case "Enumeration": { 
                    Attr_string += "ENUM ";
                    let enum_string = "";
                    attr.typeWithValue.map((e: any, idx: number) => {
                        enum_string += idx + " \"" + e + "\* "; 
                    });
                    Attr_string +=  enum_string + " ;";
    
                    break;; 
                }
                case "Integer": { 
                    Attr_string += "INT " + attr.typeWithValue[0] + " " + attr.typeWithValue[1] +" ;";
                    break; 
                }
                case "Float": { 
                    Attr_string += "FLOAT "+ attr.typeWithValue[0] + " " + attr.typeWithValue[1] +" ;";
                    break; 
                }
                default: { 
                    Attr_string += "  ";
                    break; 
                } 
            }
            Attr_strings += Attr_string +  "\n";
            Attr_strings_defaults += Attr_strings_default + "\n";
            if (Attr_value_for_object !== "") {
                Attr_value_for_objects += Attr_value_for_object;
    
            }
        });
    
    
        
        console.log(preTitle);
        console.log(buString);
        console.log(value_table_lines);
        console.log(BO_string);
        console.log(CM_string);
        console.log(Attr_strings);
        console.log(Attr_strings_defaults);
        console.log(Attr_value_for_objects);
        let dbccontent = preTitle + "\n"
                + buString + "\n"
                + value_table_lines + "\n"
                + BO_string + "\n"
                + CM_string + "\n"
                + Attr_strings + "\n"
                + Attr_strings_defaults + "\n"
                + Attr_value_for_objects + "\n";
        return dbccontent;
    
    }
    
    





}

function getSignalString(targetId:string, listSignals : MsgConnection, signals:SignalForm[]): string[] {
    let Signal_strings = "";
    let signal_comments = "";
    listSignals.connection.map(item => {
        let signalIdx = signals.findIndex((s :  SignalForm) => s.uid === item.id);
        if (signalIdx >=0 ) {
            let signal = signals[signalIdx];
            let Signal_string = " SG_ " + signal.name + " : " + item.startbit + "|" + signal.bitlength 
                                + "@" +  `${signal.byteorder.includes("MOTOROLA")? 0:1 }`
                                +  `${signal.valuetype.includes("UNSIGNED")? "+ ": "- "}`
                                + "(" + signal.factor + "," + signal.offset + ") "
                                + "[" + signal.minimun + "|" + signal.maximum + "] "
                                +  `${signal.unit !== undefined?  "\""+ signal.unit + "\" ": "\"\" "}`;
                                
            if (Object.keys(signal.receivers).length > 0)
            {
                signal.receivers.map(r => {
                    Signal_string += r.name + " ";
                });
            }
            else {
                Signal_string += "Vector__XXX ";
            }

            if (signal.comments !== ""){
                signal_comments += 'CM_ SG_ ' + parseInt(targetId, 16) +" "+ signal.name+ " \"" + signal.comments + "\" ;\n";
            }
            Signal_strings += Signal_string+ "\n";
        }


    });
    return [Signal_strings, signal_comments];
}



export function getHtmlForWebview(rootpath: string): string {
  
	try {
    const reactApplicationHtmlFilename = "template.html";
    const htmlPath = path.join(rootpath, "dist", reactApplicationHtmlFilename);
    
    const html = fs.readFileSync(htmlPath).toString();
    return html;
	}
	catch(e) {
		return `Error getting HTML for web view: ${e}`;
	}
}