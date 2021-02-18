/* eslint-disable @typescript-eslint/naming-convention */

import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as CANDB from './candb_provider';


function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}

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
    
    private candb_ = new CANDB.CANdb(["Networks", "ECUs", "Environment variables", "Network Node", "Messages", "Signals"]);
        
    private _onDidChangeTreeData: vscode.EventEmitter<TreeViewItem | undefined | void> = new vscode.EventEmitter<TreeViewItem | undefined | void>();
	readonly onDidChangeTreeData: vscode.Event<TreeViewItem | undefined | void> = this._onDidChangeTreeData.event;


    constructor(
        private workspaceRoot: string 
    ) {
        if (!fs.existsSync(workspaceRoot)){
            fs.mkdirSync(workspaceRoot);
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
            new TreeViewItem(title, uuidv4(), vscode.TreeItemCollapsibleState.Collapsed, 'treeviewroot'));
    }


    public addItem(rootName:string){
        if (rootName === "Signals") {
            let uid = uuidv4();
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
                                        comments: ""};
            
            this.candb_.listOfItems.get(rootName).push(newItem);
            this.candb_.addIdInConnection(rootName, uid);
        }
        else if (rootName === "Messages") {
            let uid = uuidv4();
            const newItem: CANDB.MessageForm = { uid: uid,
                                                name: "new_"+rootName.slice(0, -1) + "_"+ (this.candb_.listOfItems.get(rootName).length+1),
                                                msgType: "CAN Standard",
                                                id: "0x"+(this.candb_.listOfItems.get(rootName).length+1),
                                                dlc: 8,
                                                cycletime: 0,
                                                comments: ""};
            this.candb_.listOfItems.get(rootName).push(newItem);
            this.candb_.addIdInConnection(rootName, uid);
        }
        else if (rootName === "Network Node") {
            const newItem: CANDB.NetworkNodesForm = { uid: uuidv4(),
                                                name: "new_"+rootName.replace(' ', '_').slice(0, -1) + "_"+ (this.candb_.listOfItems.get(rootName).length+1),
                                                address: "0x0",
                                                comments: "",
                                                networkUids: [],
                                                msgUids: [],
                                                signalUids: []};
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