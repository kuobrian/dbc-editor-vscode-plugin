import * as vscode from 'vscode';


class TreeViewItem extends vscode.TreeItem{
    constructor(label: string, collapsibleState?: vscode.TreeItemCollapsibleState) {
        super(label, collapsibleState);
        this.contextValue = 'treeviewitem';
    }
}



class DataProvider implements vscode.TreeDataProvider<TreeViewItem>{
    private dataStorage = [
		new TreeViewItem('TreeItem-01'),
		new TreeViewItem('TreeItem-02'),
		new TreeViewItem('TreeItem-03'),
    ];
    
    private eventEmitter = new vscode.EventEmitter<TreeViewItem | undefined | void>();

    // onDidChangeTreeData?: vscode.Event<void | TreeViewItem | null | undefined> | undefined;
    public get onDidChangeTreeData(): vscode.Event<TreeViewItem | undefined | void> {
		return this.eventEmitter.event;
	}
      

    getTreeItem(element: TreeViewItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element;
    }
    getChildren(element?: TreeViewItem): vscode.ProviderResult<TreeViewItem[]> {
        return Promise.resolve(this.dataStorage);
    }

    private updateView() {
        this.eventEmitter.fire();
    }

    public addItem(newItem:TreeViewItem){
        this.dataStorage.push(newItem);
        this.updateView();
    }

    public editItem(item: TreeViewItem, name:string){
        const existItem = this.dataStorage.find(i => i.label === item.label);
        if (existItem) {
            existItem.label = name;
            this.updateView();
        }
    }

    public deleteItem(item: TreeViewItem) {
        this.dataStorage = this.dataStorage.filter(i => i.label !== item.label);
        this.updateView();
    }


}

export {DataProvider, TreeViewItem};