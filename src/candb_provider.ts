import * as fs from 'fs';
import * as path from 'path';

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
    [key: string]: any;
}

export interface NetworkNodesForm {
    uid: string;
    name: string;
    address: string;
    comments?: string;
    [key: string]: any;
}

export interface SignalConnection {
    targetId: string;
    connection: string[];
}

export interface SignalInMsg {
    id: string
    startbit: number;
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
    name: string = '';
    objectType: string = '';
    typeWithValue: any;
    defaultValue: any;
    values: any[] = [];

    constructor(symbol: any) {
        this.name = symbol.attribute_name;
        this.defaultValue = symbol.attribute_default;
        switch (symbol.attribute_type) {
            case "STRING":
                this.typeWithValue = {"type": "String", "options": symbol.attribute_type};
            case "ENUM":
                this.typeWithValue = {"type": "Enumeration", "options": symbol.attribute_type};
            case "INT":
                this.typeWithValue = {"type": "Integer", "options": symbol.attribute_type};
            case "HEX":
                this.typeWithValue = {"type": "Hex", "options": symbol.attribute_type};
            case "FLOAT":
                this.typeWithValue = {"type": "Float", "options": symbol.attribute_type};   
        }
        switch (symbol.attribute_type) {
            case "BO_":
                this.objectType = "Message";
            case "SG_":
                this.objectType = "Signal";
            case "BU_":
                this.objectType = "Node";
            case "":
                this.objectType = "Network";
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
    public getAttributeLength () {
        console.log(this.attributesdefs.length);
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