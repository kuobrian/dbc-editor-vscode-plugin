
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';


class CANdb {
    candbId: number;
    network_nodes: string[];
    messages: string[];
    signals: string[];

    constructor(id:number) {
        this.candbId = id;
        this.network_nodes = [];
        this.messages = [];
        this.signals = [];
   }
}



class TreeViewItem extends vscode.TreeItem{
    constructor(
        public readonly label: string,
        private readonly version: string, 
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly command?: vscode.Command
    ) {
        super(label, collapsibleState);
        this.tooltip = `${this.label}-${this.version}`;
        this.description = this.version;
    }

    iconPath = {
        light: path.join(__filename, '..', '..', 'assets', 'dependency.svg'),
        dark: path.join(__filename, '..', '..', 'assets', 'dependency.svg')
    };
    contextValue = 'treeviewitem';
}

class DataProvider implements vscode.TreeDataProvider<TreeViewItem> {

    private _onDidChangeTreeData: vscode.EventEmitter<TreeViewItem | undefined | void> = new vscode.EventEmitter<TreeViewItem | undefined | void>();
	readonly onDidChangeTreeData: vscode.Event<TreeViewItem | undefined | void> = this._onDidChangeTreeData.event;


    constructor(
        private workspaceRoot: string 
    ) {}


    private refresh() {
        this._onDidChangeTreeData.fire();
    }

    private pathExists(p: string): boolean {
		try {
			fs.accessSync(p);
		} catch (err) {
			return false;
		}

		return true;
    }
    
    private getDepsInPackageJson(packageJsonPath: string): TreeViewItem[] {
        if (this.pathExists(packageJsonPath) && (this.workspaceRoot !== undefined) ){
            const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

            const toDep = (moduleName: string, version: string): TreeViewItem => {
				if (this.pathExists(path.join(this.workspaceRoot, 'node_modules', moduleName))) {
					return new TreeViewItem(moduleName, version, vscode.TreeItemCollapsibleState.Collapsed);
				} else {
					return new TreeViewItem(moduleName, version, vscode.TreeItemCollapsibleState.None, {
						command: 'extension.openPackageOnNpm',
						title: '',
						arguments: [moduleName]
					});
				}
			};            
            const deps = packageJson.dependencies
				? Object.keys(packageJson.dependencies).map(dep => toDep(dep, packageJson.dependencies[dep]))
				: [];
			const devDeps = packageJson.devDependencies
				? Object.keys(packageJson.devDependencies).map(dep => toDep(dep, packageJson.devDependencies[dep]))
				: [];
            return deps.concat(devDeps);
        } else {
            return [];
        }
    };
      
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
            console.log(element.label);
            return Promise.resolve(this.getDepsInPackageJson(path.join(this.workspaceRoot, 'node_modules', element.label, 'package.json')));
        } else {
            const packageJsonPath = path.join(this.workspaceRoot, "package.json");
            if (this.pathExists(packageJsonPath)) {
                return Promise.resolve(this.getDepsInPackageJson(packageJsonPath)); 
            } else {
				vscode.window.showInformationMessage('Workspace has no package.json');
				return Promise.resolve([]);
			}

        }
    }



    // public addItem(newItem:TreeViewItem){
    //     this.dataStorage.push(newItem);
    //     this.updateView();
    // }

    // public editItem(item: TreeViewItem, name:string){
    //     const existItem = this.dataStorage.find(i => i.label === item.label);
    //     if (existItem) {
    //         existItem.label = name;
    //         this.updateView();
    //     }
    // }

    // public deleteItem(item: TreeViewItem) {
    //     this.dataStorage = this.dataStorage.filter(i => i.label !== item.label);
    //     this.updateView();
    // }


}

export {DataProvider, TreeViewItem};