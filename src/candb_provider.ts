import * as fs from 'fs';
import * as path from 'path';



export interface SignalForm {
    uid: string;
    name: string;
    bitlength: Number;
    byteorder: string;
    valuetype: string;
    factor: Number;
    minimun: Number;
    maximum: Number;
    offset: Number;
    initValue: Number;
    unit?: Number;
    valuetable?: any;
    msgUids: string[];
    comments: string;
}

export interface MessageForm {
    uid: string;
    name: string;
    msgType: string;
    id: string;
    dlc: Number;
    cycletime: Number;
    comments: string;
    signalUids: string[];
}

export interface NetworkNodesForm {
    uid: string;
    name: string;
    address: string;
    comments?: string;
    networkUids:string[];
    msgUids: string[];
    signalUids: string[];
}

export class CANdb {
    dbMapping = new Map();

    constructor(index: string[]) {
        index.map(i => this.dbMapping.set(i, []));
    }

    public itemsInCANdb () {
        console.log([...this.dbMapping.keys()]);
    }

    public itemsInSignal () {
        console.log(this.dbMapping.get("Signals"));
    }

    public itemsInMsg () {
        console.log(this.dbMapping.get("Messages"));
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