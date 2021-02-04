import * as vscode from 'vscode';
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
 }

export interface MessageForm {
    uid: string;
    name: string;
    msgType: string;
    id: string;
    dlc: Number;
    cycletime: Number;
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

