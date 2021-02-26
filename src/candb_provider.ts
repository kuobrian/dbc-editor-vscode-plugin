import * as fs from 'fs';
import * as path from 'path';
import { PassThrough } from 'stream';

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

export interface DBCObject {
    label: string;
    value: any[];
}

export interface DBCAttribute {
    name: string;
    type: string;
    objectType: string;
    defaultValue: any;
    typeWithValue: any;
    values: any[];
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
                this.typeWithValue = {"type": "String", "options": symbol.attribute_type};
                break; 
            case "ENUM":
                this.typeWithValue = {"type": "Enumeration", "options": symbol.attribute_type};
                break; 
            case "INT":
                this.typeWithValue = {"type": "Integer", "options": symbol.attribute_type};
                break; 
            case "HEX":
                this.typeWithValue = {"type": "Hex", "options": symbol.attribute_type};
                break; 
            case "FLOAT":
                this.typeWithValue = {"type": "Float", "options": symbol.attribute_type};
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
        const item: DBCAttribute = {name: this.name,
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
    objectList: DBCObject[] = [];

    connectionSignal: SignalConnection[] = [];
    connectionMsg: MsgConnection[] = [];
    attributesdefs: DBCAttribute[] = [];

    constructor(labels: string[]) {
        for(let label of labels) {
            this.listOfItems.set(label, []);
            this.objectList.push({label: label, value: []});
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

    public itemsInObjectList () {
        console.log(this.objectList);
    }

    public putAttributeInObject() {
        this.attributesdefs.map((attr: DBCAttribute) => {
            switch(attr.objectType) {
                case "Network":
                    return undefined;
                case "Node":
                    for (let val of attr.values) {
                        let address = val.address;
                        let idxNN = this.listOfItems.get("Network Node").findIndex((nn: MessageForm) => nn.address === address);
                        this.listOfItems.get("Network Node")[idxNN].attributes.push(val);
                    }
                    break; 
                case "Message":
                    for (let val of attr.values) {
                        let messageid = "0x"+ val.message_id.toString(16);
                        let idxMsg = this.listOfItems.get("Messages").findIndex((m:MessageForm) => m.id === messageid);
                        this.listOfItems.get("Messages")[idxMsg].attributes.push(val);
                    }
                    break; 
                case "Signal":
                    for (let val of attr.values) {
                        let messageid = "0x"+ val.message_id.toString(16);
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
        })
    }

    public getAttributeLength () {
        return this.attributesdefs.length;
    }

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