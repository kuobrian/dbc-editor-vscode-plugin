/* eslint-disable @typescript-eslint/naming-convention */

import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as CANDB from './candb_provider';


export function startTableHandler(context: vscode.ExtensionContext, candb: CANDB.CANdb): void {
   const tablePanel = vscode.window.createWebviewPanel('reactExtension',
                                                        'Value Table',
                                                        vscode.ViewColumn.One,
                                                        {
                                                            enableScripts: true,
                                                            retainContextWhenHidden: true
                                                        });
    let htmlContent: string = CANDB.getHtmlForWebview(context.extensionPath);
    let webpackPathOnDisk = vscode.Uri.file(path.join(context.extensionPath, 'dist/tableView.js'));
    let webpackUri = tablePanel.webview.asWebviewUri(webpackPathOnDisk);
    htmlContent = htmlContent.replace('${rootUri}', webpackUri.toString());
    tablePanel.webview.html = htmlContent;
    console.log(candb.valuetables);

    tablePanel.webview.postMessage({
        valuetable: candb.valuetables
    });

    tablePanel.webview.onDidReceiveMessage((message: any) => {
        switch (message.command) {
            case 'modifyTable':
                candb.valuetables = message.data
                vscode.commands.executeCommand('dbc-editor-vscode-plugin.refresh_treeview');
                return;

            case 'cancelTable':
                vscode.commands.executeCommand('workbench.action.closeActiveEditor');
                return;

        }
    },
        undefined,
        context.subscriptions
    );

    tablePanel.onDidDispose(onPanelDispose, null, context.subscriptions);
}
function onPanelDispose(): void {
    // Clean up panel here
}
