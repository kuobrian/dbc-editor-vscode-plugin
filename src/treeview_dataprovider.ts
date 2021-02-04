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
    
    private templateTitles = ["Network Node", "Messages", "Signals"];
    private candb_ = new CANDB.CANdb(["Network Node", "Messages", "Signals"]);
        
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
            if (element.label === "Network Node") {
                if (this.candb_.dbMapping.get("Network Node").length) {
                    return Promise.resolve(this.candb_.dbMapping.get("Network Node").map((title: string) => 
                                            new TreeViewItem(title, vscode.TreeItemCollapsibleState.None, 'treeviewitem')));
                } 
            }
            else if (element.label === "Messages") {
                if (this.candb_.dbMapping.get("Messages").length) {
                    return Promise.resolve(this.candb_.dbMapping.get("Messages").map((messageitem: CANDB.MessageForm) => 
                                            new TreeViewItem(messageitem.name, vscode.TreeItemCollapsibleState.None, 'treeviewitem', {
                                                command: 'extension.openMessageEditor',
                                                title: '',
                                                arguments:[messageitem.name, this.candb_]}
                                                )));
                } 
            }
            else if (element.label === "Signals") {
                if (this.candb_.dbMapping.get("Signals").length) {
                    return Promise.resolve(this.candb_.dbMapping.get("Signals").map((signalitem: CANDB.SignalForm) => 
                                            new TreeViewItem(signalitem.name, vscode.TreeItemCollapsibleState.None, 'treeviewitem',{
                                                command: 'extension.openSignalEditor',
                                                title: '',
                                                arguments:[signalitem.name, this.candb_]}
                                                )));
                } 
            } 
        } else {
            return Promise.resolve(this.templateCANdb()); 
        }
    }

    private templateCANdb(): TreeViewItem[]{
        return  [...this.candb_.dbMapping.keys()].map(title => 
            new TreeViewItem(title, vscode.TreeItemCollapsibleState.Collapsed, 'treeviewroot'));
    }


    public addItem(rootName:string){
        if (rootName === "Signals") {
            const newItem: CANDB.SignalForm = { uid: uuidv4(),
                                        name: "new_"+rootName.slice(0, -1) + "_"+ (this.candb_.dbMapping.get(rootName).length+1),
                                        bitlength: 8,
                                        byteorder: "Intel",
                                        valuetype: 'Signed',
                                        factor:  1,
                                        minimun: 0,
                                        maximum: 0,
                                        offset:  0,
                                        initValue: 0,
                                        valuetable: null
                                        };
            
            this.candb_.dbMapping.get(rootName).push(newItem);
        }
        else if (rootName === "Messages") {
            const newItem: CANDB.MessageForm = { uid: uuidv4(),
                                                name: "new_"+rootName.slice(0, -1) + "_"+ (this.candb_.dbMapping.get(rootName).length+1),
                                                msgType: "CAN Standard",
                                                id: "0x"+(this.candb_.dbMapping.get(rootName).length+1),
                                                dlc: 8,
                                                cycletime: 0};
            this.candb_.dbMapping.get(rootName).push(newItem);
        }
        this.refresh();
    }

    public deleteItem(itemName: TreeViewItem) {
        const rootName = itemName.label.split("_")[1]+"s";
        // this.candb_.dbMapping.set(root, this.candb_.dbMapping.get(root).filter((i: string) => i !== itemName.label));
        if (rootName === "Signals") {
            this.candb_.dbMapping.set(rootName, this.candb_.dbMapping.get(rootName).filter((i: CANDB.SignalForm) => i.name !== itemName.label));
        }
        else if (rootName === "Messages") {
            this.candb_.dbMapping.set(rootName, this.candb_.dbMapping.get(rootName).filter((i: CANDB.MessageForm) => i.name !== itemName.label));
            
        }
        this.refresh();
    }

    // public editItem(item: TreeViewItem, name:string){
    //     const existItem = this.dataStorage.find(i => i.label === item.label);
    //     if (existItem) {
    //         existItem.label = name;
    //         this.updateView();
    //     }
    // }



}

export {DataProvider, TreeViewItem};