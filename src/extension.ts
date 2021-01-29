
import * as vscode from 'vscode';
import * as path from 'path';
import {startCommandHandler} from './webview_provider';
import {DataProvider, TreeViewItem} from "./treeview_dataprovider";

export function activate(context: vscode.ExtensionContext) {
	console.log(context.extensionUri);
	console.log('Congratulations, your extension "vscode-pluing-demo123" is now active!');

	const startCommand = vscode.commands.registerCommand("vscode-plugin-demo.startReactAPP", () => startCommandHandler(context));
	

	context.subscriptions.push(startCommand);

	let disposable = vscode.commands.registerCommand('vscode-plugin-demo.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from demo-test!');
	});
	context.subscriptions.push(disposable);
	
	
	console.log(context.extensionPath);
	const dataProvider = new DataProvider(path.join(context.extensionPath, 'db_output'));

	vscode.window.registerTreeDataProvider('TreeView', dataProvider);
	
	vscode.commands.registerCommand('extension.openPackageOnNpm', moduleName =>
		{
			console.log(moduleName);
			startCommandHandler(context);
		}
	);

	context.subscriptions.push(
		vscode.commands.registerCommand("vscode-plugin-demo.add_treeviewitems", async (rootName: TreeViewItem) => {
			dataProvider.addItem(rootName.label);
			vscode.window.showInformationMessage("add Item ");
		})
	);
	
	// context.subscriptions.push(
	// 	vscode.commands.registerCommand("vscode-demo.edit_treeview", async (item: TreeViewItem) => {
	// 		const itemName = await vscode.window.showInputBox({
	// 			placeHolder: "your New TreeItem Name"
	// 		}) || "";
	// 		if (itemName !== "") {
	// 			dataProvider.editItem(item, itemName);
	// 		}
	// 		vscode.window.showInformationMessage("Edit item ", itemName);
			
	// 	})
	// );
	
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
