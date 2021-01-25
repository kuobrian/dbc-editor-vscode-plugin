
import * as vscode from 'vscode';
import {DataProvider, TreeViewItem} from "./treeview_dataprovider";



export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "vdcode-demo" is now active123!');
	let disposable = vscode.commands.registerCommand('vdcode-demo.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from demo-test!');
	});
	context.subscriptions.push(disposable);

	const dataProvider = new DataProvider();
	vscode.window.registerTreeDataProvider('TreeView', dataProvider);



	context.subscriptions.push(
		vscode.commands.registerCommand("vscode-demo.add_treeview", async () => {
			const itemId = await vscode.window.showInputBox({
				placeHolder: "your New TreeItem Id"
			}) || "";
			
			if (itemId !== "") {
				dataProvider.addItem(new TreeViewItem(itemId));
			}

			vscode.window.showInformationMessage("add Item ", itemId);
		})
	);
	context.subscriptions.push(
		vscode.commands.registerCommand("vscode-demo.edit_treeview", async (item: TreeViewItem) => {
			const itemName = await vscode.window.showInputBox({
				placeHolder: "your New TreeItem Name"
			}) || "";
			if (itemName !== "") {
				dataProvider.editItem(item, itemName);
			}
			vscode.window.showInformationMessage("Edit item ", itemName);
			
		})
	);
	context.subscriptions.push(
		vscode.commands.registerCommand("vscode-demo.delete_treeview", async (item: TreeViewItem) => {
			const confirm = await vscode.window.showQuickPick(["delete", "cancel"], {
				placeHolder: "Do you want to delete item?"
			})
			if (confirm === "delete") {
				dataProvider.deleteItem(item);
			}
			vscode.window.showInformationMessage("delete item ");
		})
	);

}

// this method is called when your extension is deactivated
export function deactivate() {}
