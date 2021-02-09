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
    msgUids: string[];
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
    signalUids: string[];
    [key: string]: any;
}

export interface NetworkNodesForm {
    uid: string;
    name: string;
    address: string;
    comments?: string;
    networkUids:string[];
    msgUids: string[];
    signalUids: string[];
    [key: string]: any;
}

export class CANdb {
    dbMapping = new Map();

    constructor(labels: string[]) {
        labels.map(label => this.dbMapping.set(label, []));
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