
import * as vscode from 'vscode';
import * as path from 'path';
import {startSignalHandler} from './editors/signalsProvider';
import {startMsgHandler} from './editors/messageProvider';
import {startNetworkNodesHandler} from './editors/networknodesProvider';
import {DataProvider, TreeViewItem} from "./treeviewDataprovider";

export function activate(context: vscode.ExtensionContext) {
	
	let totalPanels:string[] = [];


	let disposable = vscode.commands.registerCommand('vscode-plugin-demo.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from demo-test!');
	});
	context.subscriptions.push(disposable);
	
	const dataProvider = new DataProvider(path.join(context.extensionPath, 'db_output'));
	vscode.window.registerTreeDataProvider('TreeView', dataProvider);


	vscode.commands.registerCommand('extension.openSignalEditor', (moduleName, candb) => {
			startSignalHandler(context, moduleName, candb);
	});

	vscode.commands.registerCommand('extension.openMessageEditor', (moduleName, candb) => {
			startMsgHandler(context, moduleName, candb);
	});

	vscode.commands.registerCommand('extension.openNetworkNodesEditor', (moduleName, candb) => {
			
			startNetworkNodesHandler(context, moduleName, candb);
	});

	context.subscriptions.push(
		vscode.commands.registerCommand("vscode-plugin-demo.add_treeviewitems", async (rootName: TreeViewItem) => {
			dataProvider.addItem(rootName.label);
			vscode.window.showInformationMessage("add Item ");
		})
	);	

	context.subscriptions.push(vscode.commands.registerCommand("vscode-plugin-demo.refresh_treeview" , () => {
			dataProvider.refresh();
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand("vscode-plugin-demo.delete_treeview", async (itemName: TreeViewItem) => {
			const confirm = await vscode.window.showQuickPick(["delete", "cancel"], {
				placeHolder: "Do you want to delete item?"
			});
			if (confirm === "delete") {
				dataProvider.deleteItem(itemName);
			}
			vscode.window.showInformationMessage("delete item ");
		})
	);

}

// this method is called when your extension is deactivated
export function deactivate() {}
