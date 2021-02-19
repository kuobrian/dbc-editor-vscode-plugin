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
    [key: string]: any;
}

export interface NetworkNodesForm {
    uid: string;
    name: string;
    address: string;
    comments?: string;
    [key: string]: any;
}

interface SignalConnection {
    targetId: string;
    connection: string[];
}

export interface SignalInMsg {
    id: string
    startbit: number;
    multiplexortype: string;
}

interface MsgConnection {
    targetId: string;
    connection: SignalInMsg[];
}

export class CANdb  {
    listOfItems = new Map();

    connectionSignal: SignalConnection[] = [];
    connectionMsg: MsgConnection[] = [];

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

    public itemsInSignal () {
        console.log(this.listOfItems.get("Signals"));
    }

    public itemsInMsg () {
        console.log(this.listOfItems.get("Messages"));
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