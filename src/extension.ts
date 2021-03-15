
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { startSignalHandler } from './editors/signalsEditor';
import { startMsgHandler } from './editors/messageEditor';
import { startNetworkNodesHandler } from './editors/nodeEditor';
import { DataProvider, TreeViewItem } from "./treeviewDataprovider";
import { startAttributeHandler } from "./attributeProvider";
import { startTableHandler } from "./tableProvider";

export function activate(context: vscode.ExtensionContext) {
	
	let totalPanels:string[] = [];


	let disposable = vscode.commands.registerCommand('dbc-editor-vscode-plugin.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from demo-test!');
	});
	context.subscriptions.push(disposable);
	

	let dataProvider: any;
	let selectedFilePath: string;
	// const dataProvider = new DataProvider(path.join(context.extensionPath, 'db_output'));
	// vscode.window.registerTreeDataProvider('TreeView', dataProvider);
	// let dbcObject = JSON.parse(fs.readFileSync(path.join(context.extensionPath, 'example.json'), 'utf-8'));
	// const dataProvider = new DataProvider(path.join(context.extensionPath, 'db_output'), dbcObject);
	// vscode.window.registerTreeDataProvider('TreeView', dataProvider);

	vscode.commands.registerCommand('extension.openSignalEditor', (moduleName, candb, isPreview=false) => {
		startSignalHandler(context, moduleName, candb, isPreview);
	});

	vscode.commands.registerCommand('extension.openMessageEditor', (moduleName, candb) => {
		console.log(moduleName);
		startMsgHandler(context, moduleName, candb);
	});

	vscode.commands.registerCommand('extension.openNetworkNodesEditor', (moduleName, candb) => {
		startNetworkNodesHandler(context, moduleName, candb);
	});

	vscode.commands.registerCommand('dbc-editor-vscode-plugin.createNewFile', (moduleName, candb) => {
		vscode.window.showInformationMessage("Create New File");
		dataProvider = new DataProvider(path.join(context.extensionPath, 'db_output'), undefined);
		vscode.window.registerTreeDataProvider('TreeView', dataProvider);
		vscode.window.showSaveDialog({
			defaultUri: vscode.Uri.parse('/' + context.extensionPath + "/db_output/new"),
			title: 'Create JSON File',
			filters: {
				'JSON File': ['json']
			}
		}).then(fileUri => {
			if (fileUri ) {
				console.log(fileUri.path);
				let jsonData = dataProvider.candb_.toJsonData();
				selectedFilePath = fileUri.path;
				fs.writeFileSync(fileUri.path, jsonData);
			}
		});

	});

	context.subscriptions.push(
		vscode.commands.registerCommand("dbc-editor-vscode-plugin.loadJSONFile", () => {
			vscode.window.showOpenDialog({
				canSelectMany: false,
				canSelectFolders: false,
				canSelectFiles: true,
				filters: {
					'JSON File': ['json']
				},
				title: 'Select JSON File',
				defaultUri: vscode.Uri.parse('/'+ context.extensionPath)
			}).then(fileUri => {
				if (fileUri && fileUri[0]) {
					
					selectedFilePath = fileUri[0].fsPath;

					let dbcObject = JSON.parse(fs.readFileSync(selectedFilePath, 'utf-8'));
					dataProvider = new DataProvider(path.join(context.extensionPath, 'db_output'), dbcObject);
					vscode.window.registerTreeDataProvider('TreeView', dataProvider);
				}
			});
		})
	);
	
	context.subscriptions.push(
		vscode.commands.registerCommand("dbc-editor-vscode-plugin.saveJSONFile", () => {
	
			let filename = selectedFilePath.replace(/^.*[\\\/]/, '').split(".")[0];

			dataProvider.candb_.saveJsonFile(path.join(context.extensionPath, 'db_output'), filename);
			vscode.window.showInformationMessage('Save ' + filename + ".json in " + path.join(context.extensionPath, 'db_output'));
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand("dbc-editor-vscode-plugin.add_treeviewitems", async (rootName: TreeViewItem) => {
			dataProvider.addItem(rootName.label);
		})
	);	

	context.subscriptions.push(
		vscode.commands.registerCommand("dbc-editor-vscode-plugin.refresh_treeview" , () => {
			dataProvider.refresh();
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand("dbc-editor-vscode-plugin.openAttributeDefinitions", () => {
			startAttributeHandler(context, dataProvider.candb_);
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand("dbc-editor-vscode-plugin.openValueTables", () => {
			startTableHandler(context, dataProvider.candb_);
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand("dbc-editor-vscode-plugin.delete_treeview", async (itemName: TreeViewItem) => {
			const confirm = await vscode.window.showQuickPick(["delete", "cancel"], {
				placeHolder: "Do you want to delete item?"
			});
			if (confirm === "delete") {
				dataProvider.deleteItem(itemName);
			}
		})
	);

}

// this method is called when your extension is deactivated
export function deactivate() {}
