/* eslint-disable @typescript-eslint/naming-convention */

import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';


interface SignalForm {
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
 }

interface MessageForm {
    name: string;
    msgType: string;
    id: string;
    dlc: Number;
 }

class CANdb {
    dbMapping = new Map();

    constructor(index: string[]) {
        index.map(i => this.dbMapping.set(i, []));
   }
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
    private candb_ = new CANdb(["Network Node", "Messages", "Signals"]);
        
    private _onDidChangeTreeData: vscode.EventEmitter<TreeViewItem | undefined | void> = new vscode.EventEmitter<TreeViewItem | undefined | void>();
	readonly onDidChangeTreeData: vscode.Event<TreeViewItem | undefined | void> = this._onDidChangeTreeData.event;


    constructor(
        private workspaceRoot: string 
    ) {
        if (!fs.existsSync(workspaceRoot)){
            fs.mkdirSync(workspaceRoot);
        }
    }

    private refresh() {
        this._onDidChangeTreeData.fire();
    }

      
    getTreeItem(element: TreeViewItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element;
    }

    getChildren(element?: TreeViewItem): vscode.ProviderResult<TreeViewItem[]> {
        if (!this.workspaceRoot) {
            console.log(this.workspaceRoot);
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
                    return Promise.resolve(this.candb_.dbMapping.get("Messages").map((title: MessageForm) => 
                                            new TreeViewItem(title.name, vscode.TreeItemCollapsibleState.None, 'treeviewitem')));
                } 
            }
            else if (element.label === "Signals") {
                if (this.candb_.dbMapping.get("Signals").length) {
                    return Promise.resolve(this.candb_.dbMapping.get("Signals").map((title: SignalForm) => 
                                            new TreeViewItem(title.name, vscode.TreeItemCollapsibleState.None, 'treeviewitem',{
                                                command: 'extension.openPackageOnNpm',
                                                title: '',
                                                arguments:[title.name]}
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
        console.log(rootName);
        if (rootName === "Signals") {
            const newItem: SignalForm = { name: "new_"+rootName.slice(0, -1) + "_"+ (this.candb_.dbMapping.get(rootName).length+1),
                                        bitlength: 8,
                                        byteorder: "Intel",
                                        valuetype: 'Signed',
                                        factor:  1,
                                        minimun: 0,
                                        maximum: 0,
                                        offset:  0,
                                        initValue: 0
                                        };
            
            this.candb_.dbMapping.get(rootName).push(newItem);
        }
        else if (rootName === "Messages") {
            const newItem: MessageForm = { name: "new_"+rootName.slice(0, -1) + "_"+ (this.candb_.dbMapping.get(rootName).length+1),
                                            msgType: "CAN Standard",
                                            id: "0x"+(this.candb_.dbMapping.get(rootName).length+1),
                                            dlc: 8};
            this.candb_.dbMapping.get(rootName).push(newItem);
        }
        this.refresh();
    }

    public deleteItem(itemName: TreeViewItem) {
        const rootName = itemName.label.split("_")[1]+"s";
        // this.candb_.dbMapping.set(root, this.candb_.dbMapping.get(root).filter((i: string) => i !== itemName.label));
        if (rootName === "Signals") {
            this.candb_.dbMapping.set(rootName, this.candb_.dbMapping.get(rootName).filter((i: SignalForm) => i.name !== itemName.label));
        }
        else if (rootName === "Messages") {
            this.candb_.dbMapping.set(rootName, this.candb_.dbMapping.get(rootName).filter((i: MessageForm) => i.name !== itemName.label));
            
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