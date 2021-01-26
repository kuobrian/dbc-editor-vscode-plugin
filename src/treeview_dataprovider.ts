
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';


interface CANdbForm {
    firstName: string;
    lastName: string;
 }

class CANdb {
    // network_nodes: string[];
    // messages: string[];
    // signals: string[];
    dbMapping = new Map();

    constructor(index: string[]) {
        index.map(i => this.dbMapping.set(i, []));
   }
}



class TreeViewItem extends vscode.TreeItem{
    constructor(
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly command?: vscode.Command
        ) {
            super(label, collapsibleState);
            this.tooltip = `${this.label}`;
        }
        
        iconPath = {
            light: path.join(__filename, '..', '..', 'assets', 'dependency.svg'),
            dark: path.join(__filename, '..', '..', 'assets', 'dependency.svg')
        };
        contextValue = 'treeviewitem';
    }
    
class DataProvider implements vscode.TreeDataProvider<TreeViewItem> {
    private Ids:number = 1;
        
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
					return new TreeViewItem(moduleName, vscode.TreeItemCollapsibleState.Collapsed);
				} else {
					return new TreeViewItem(moduleName, vscode.TreeItemCollapsibleState.None, {
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

            if (element.label === "Network Node") {
                console.log("Network Node templateCANdb");
            }
            else if (element.label === "Messages") {
                console.log("Messages templateCANdb");
            }
            else if (element.label === "Singals") {
                console.log("Singals templateCANdb");
            }


            // console.log(element.label);
            // return Promise.resolve(this.getDepsInPackageJson(path.join(this.workspaceRoot, 'node_modules', element.label, 'package.json')));
        } else {
            console.log("templateCANdb");
            return Promise.resolve(this.templateCANdb()); 

        }
    }


    private templateCANdb(): TreeViewItem[]{
        let templateTitles = ["Network Node", "Messages", "Singals"];
        const candb_ = new CANdb(["Network Node", "Messages", "Singals"]);
        
        return  [...candb_.dbMapping.keys()].map(title => 
            new TreeViewItem(title, vscode.TreeItemCollapsibleState.Collapsed));
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