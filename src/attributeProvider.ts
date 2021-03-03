/* eslint-disable @typescript-eslint/naming-convention */

import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as CANDB from './candb_provider';


export function startAttributeHandler(context: vscode.ExtensionContext, candb: CANDB.CANdb): void {
   const attributePanel = vscode.window.createWebviewPanel('reactExtension',
                                                            'Attribute Definition',
                                                            vscode.ViewColumn.One,
                                                            {
                                                                enableScripts: true,
                                                                retainContextWhenHidden: true
                                                            });
    let htmlContent: string = CANDB.getHtmlForWebview(context.extensionPath);
    let webpackPathOnDisk = vscode.Uri.file(path.join(context.extensionPath, 'dist/attributeView.js'));
    let webpackUri = attributePanel.webview.asWebviewUri(webpackPathOnDisk);
    htmlContent = htmlContent.replace('${rootUri}', webpackUri.toString());
    attributePanel.webview.html = htmlContent;
    console.log(candb.attributesdefs);

    attributePanel.webview.postMessage({
        attribute: candb.attributesdefs
    });

    attributePanel.onDidDispose(onPanelDispose, null, context.subscriptions);
}
function onPanelDispose(): void {
    // Clean up panel here
}
