/* eslint-disable @typescript-eslint/naming-convention */

import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as CANDB from './candb_provider';
import { MessageChannel } from 'worker_threads';




class TreeViewItem extends vscode.TreeItem{
    constructor(
        public readonly label: string,
        public readonly uid: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly contextValue: string,
        public readonly command?: vscode.Command
        ) {
            super(label, collapsibleState);
            this.tooltip = `${this.label}`;
            this.contextValue = contextValue;
        }        
        iconPath = {
            light: path.join(__filename, '..', '..', 'assets', 'dependency.svg'),
            dark: path.join(__filename, '..', '..', 'assets', 'dependency.svg')
        };
        // contextValue = 'treeviewitem';
    }
    
class DataProvider implements vscode.TreeDataProvider<TreeViewItem> {
    
    public candb_ = new CANDB.CANdb(["Networks", "ECUs", "Environment variables", "Network Node", "Messages", "Signals"]);
        
    private _onDidChangeTreeData: vscode.EventEmitter<TreeViewItem | undefined | void> = new vscode.EventEmitter<TreeViewItem | undefined | void>();
	readonly onDidChangeTreeData: vscode.Event<TreeViewItem | undefined | void> = this._onDidChangeTreeData.event;


    constructor(
        private workspaceRoot: string,
        private dbcObject: any
    ) {
        if (!fs.existsSync(workspaceRoot)){
            fs.mkdirSync(workspaceRoot);
        }
        if (dbcObject !== undefined) {
            this.dbcObject = dbcObject;
            this.parseDBCObject();
        }
    }

    refresh() {
        this._onDidChangeTreeData.fire();
    }

      
    getTreeItem(element: TreeViewItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element;
    }

    getChildren(element?: TreeViewItem): vscode.ProviderResult<TreeViewItem[]> {
        
        if (!this.workspaceRoot) {
			vscode.window.showInformationMessage('No dependency in empty workspace');
			return Promise.resolve([]);
        }
        if (element) {
            let treeItemList: TreeViewItem[] = [];
            if (element.label === "Network Node") {
                this.candb_.listOfItems.get("Network Node").map((nnitem: CANDB.NetworkNodesForm) => 
                        treeItemList.push(new TreeViewItem( nnitem.name,
                                                            nnitem.uid,
                                                            vscode.TreeItemCollapsibleState.None,
                                                            'treeviewitem',
                                                            {
                                                                command: 'extension.openNetworkNodesEditor',
                                                                title: '',
                                                                arguments:[nnitem.name, this.candb_] 
                                                            }
                                            ))
                    
                    );
            }
            else if (element.label === "Messages") {
                if (this.candb_.listOfItems.get("Messages").length) {
                    this.candb_.listOfItems.get("Messages").map((messageitem: CANDB.MessageForm) =>
                        treeItemList.push(new TreeViewItem( messageitem.name,
                                                            messageitem.uid,
                                                            vscode.TreeItemCollapsibleState.Collapsed,
                                                            'treeviewitem',
                                                            {
                                                                command: 'extension.openMessageEditor',
                                                                title: '',
                                                                arguments:[messageitem.name, this.candb_] 
                                                            }
                                            ))
                    
                    );};
                
            }
            else if (element.label === "Signals") {
                if (this.candb_.listOfItems.get("Signals").length) {

                    this.candb_.listOfItems.get("Signals").map((signalitem: CANDB.SignalForm) =>
                        treeItemList.push(new TreeViewItem( signalitem.name,
                                                            signalitem.uid,
                                                            vscode.TreeItemCollapsibleState.None,
                                                            'treeviewitem',
                                                            {
                                                                command: 'extension.openSignalEditor',
                                                                title: '',
                                                                arguments:[signalitem.name, this.candb_] 
                                                            }
                                            ))
                    
                    );};
            } 
            else if (element.label.includes("Message")) {
                let msgIdx = this.candb_.connectionMsg.findIndex(item => item.targetId === element.uid);
                this.candb_.connectionMsg[msgIdx].connection.map((connectionSignal: CANDB.SignalInMsg) =>{
                    this.candb_.listOfItems.get("Signals").forEach((signal: CANDB.SignalForm) => {
                        if (signal.uid === connectionSignal.id) {
                            treeItemList.push(new TreeViewItem( signal.name,
                                                                signal.uid,
                                                                vscode.TreeItemCollapsibleState.None, 
                                                                'treeviewitem',
                                                                {
                                                                    command: 'extension.openSignalEditor',
                                                                    title: '',
                                                                    arguments:[signal.name, this.candb_, true]
                                                                }
                                            ));}});
                });
            }
            return Promise.resolve(treeItemList);
        } else {
            return Promise.resolve(this.templateCANdb()); 
        }
    }

    private templateCANdb(): TreeViewItem[]{
        return  [...this.candb_.listOfItems.keys()].map(title => 
            new TreeViewItem(title, CANDB.uuidv4(), vscode.TreeItemCollapsibleState.Collapsed, 'treeviewroot'));
    }

    public parseDBCObject() {
        let msgList = this.dbcObject.messageList;
        let networkNodeList = this.dbcObject.networkNodeList;
        let symbolList = this.dbcObject.symbolList;
        console.log(this.dbcObject);
        this.dbcObject.networkNodeList.map((nodeItem: any) => {
            const newItem: CANDB.NetworkNodesForm = {
                            uid: CANDB.uuidv4(),
                            name: nodeItem.node_name,
                            address: nodeItem.address,
                            attributes: [],
                            comments: ""};

            this.candb_.listOfItems.get("Network Node").push(newItem);
            
        });
        this.dbcObject.messageList.map((msgItem: any) => {
            if (true) {
                let nn = this.candb_.listOfItems.get("Network Node").find((nn:CANDB.NetworkNodesForm) => nn.name === msgItem.transmitter);
                const msgNewItem: CANDB.MessageForm = {
                                                    uid: CANDB.uuidv4(),
                                                    name: msgItem.message_name,
                                                    msgType: msgItem.message_id_type,
                                                    id: "0x"+msgItem.message_id.toString(16),
                                                    dlc: msgItem.message_size,
                                                    cycletime: 0,
                                                    transmitters: (nn===undefined)? [] : [nn],
                                                    attributes:[],
                                                    comments: ""};
                this.candb_.listOfItems.get("Messages").push(msgNewItem);
                this.candb_.initConnection("Messages", msgNewItem.uid);
                
                msgItem.signal.map((signalItem: any) => {
                    let newSignalItem: CANDB.SignalForm;
                    if (! this.candb_.listOfItems.get("Signals").includes((item: { name: CANDB.SignalForm; }) => item.name === signalItem.signal_name)) {
                        let receivers =  this.candb_.listOfItems.get("Network Node").filter((nn:CANDB.NetworkNodesForm) =>  signalItem.receiver.findIndex((r:string) => r === nn.name) >= 0);
                        newSignalItem = {
                                        uid: CANDB.uuidv4(),
                                        name: signalItem.signal_name,
                                        bitlength: signalItem.signal_size,
                                        byteorder: signalItem.byte_order,
                                        valuetype: signalItem.value_type,
                                        factor:  signalItem.factor,
                                        minimun: signalItem.minimum,
                                        maximum: signalItem.maximum,
                                        offset:  signalItem.offset,
                                        initValue: 0,
                                        receivers: receivers,
                                        attributes: [],
                                        valuetable: null,
                                        comments: ""};
                        this.candb_.listOfItems.get("Signals").push(newSignalItem);
                        this.candb_.initConnection("Signals", newSignalItem.uid);
                        this.candb_.addIdInConnection("Signals", newSignalItem.uid, msgNewItem.uid);
                    } else {
                        newSignalItem = this.candb_.listOfItems.get("Signals").find((item: { name: CANDB.SignalForm; }) => item.name === signalItem.signal_name);
                    }
                    this.candb_.addIdInConnection("Messages", msgNewItem.uid, newSignalItem.uid, signalItem.start_bit, "signal");
                });
            }
            
        });
        
        this.dbcObject.symbolList.map((symbol: any) => {
            if (symbol.messageComment) { 
                let idx = this.candb_.listOfItems.get("Messages").findIndex((msg:CANDB.MessageForm) => msg.id === "0x"+symbol.messageComment.message_id.toString(16));
                this.candb_.listOfItems.get("Messages")[idx].comments = symbol.messageComment.comment;
            }
            else if (symbol.signalComment) {
                let idx = this.candb_.listOfItems.get("Signals").findIndex((signal:CANDB.SignalForm) => signal.name === symbol.signalComment.signal_name);
                this.candb_.listOfItems.get("Signals")[idx].comments = symbol.signalComment.comment;
            }
            else if (symbol.attribute_name) {
                let attribute = new CANDB.AttributesDefs(symbol);
                this.candb_.attributesdefs.push(attribute._toObject());
            }
        });
        this.candb_.putAttributeInObject();
        this.refresh();
    }

    public addItem(rootName:string){
        let uid = CANDB.uuidv4();
        if (rootName === "Signals") {
            const newItem: CANDB.SignalForm = { uid: uid,
                                        name: "new_"+rootName.slice(0, -1) + "_"+ (this.candb_.listOfItems.get(rootName).length+1),
                                        bitlength: 8,
                                        byteorder: "Intel",
                                        valuetype: 'Signed',
                                        factor:  1,
                                        minimun: 0,
                                        maximum: 0,
                                        offset:  0,
                                        initValue: 0,
                                        valuetable: null,
                                        receivers: [],
                                        attributes: [],
                                        comments: ""};
            
            this.candb_.listOfItems.get(rootName).push(newItem);
            this.candb_.initConnection(rootName, uid);
        }
        else if (rootName === "Messages") {
            const newItem: CANDB.MessageForm = { uid: uid,
                                                name: "new_"+rootName.slice(0, -1) + "_"+ (this.candb_.listOfItems.get(rootName).length+1),
                                                msgType: "CAN Standard",
                                                id: "0x"+(this.candb_.listOfItems.get(rootName).length+1),
                                                dlc: 8,
                                                cycletime: 0,
                                                transmitters: [],
                                                attributes: [],
                                                comments: ""};
            this.candb_.listOfItems.get(rootName).push(newItem);
            this.candb_.initConnection(rootName, uid);
        }
        else if (rootName === "Network Node") {
            const newItem: CANDB.NetworkNodesForm = { uid: uid,
                                                name: "new_"+rootName.replace(' ', '_').slice(0, -1) + "_"+ (this.candb_.listOfItems.get(rootName).length+1),
                                                address: "0x0",
                                                attributes: [],
                                                comments: "",};
            this.candb_.listOfItems.get(rootName).push(newItem);
        }
        this.refresh();
    }

    public deleteItem(itemName: TreeViewItem) {
        const rootName = itemName.label.split("_")[1]+"s";
        // this.candb_.dbMapping.set(root, this.candb_.dbMapping.get(root).filter((i: string) => i !== itemName.label));
        if (rootName === "Signals") {
            this.candb_.listOfItems.set(rootName, 
                this.candb_.listOfItems.get(rootName).filter((i: CANDB.SignalForm) => i.name !== itemName.label));
        }
        else if (rootName === "Messages") {
            this.candb_.listOfItems.set(rootName, 
                this.candb_.listOfItems.get(rootName).filter((i: CANDB.MessageForm) => i.name !== itemName.label));
            
        }
        else if (rootName === "Network Node") {
            this.candb_.listOfItems.set(rootName, 
                this.candb_.listOfItems.get(rootName).filter((i: CANDB.NetworkNodesForm) => i.name !== itemName.label));
        }
        this.refresh();
    }

}

export {DataProvider, TreeViewItem};