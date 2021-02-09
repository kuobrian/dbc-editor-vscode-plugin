import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as CANDB from '../candb_provider';

export function startMsgHandler(context: vscode.ExtensionContext, modulename: string, candb: CANDB.CANdb): void {
    const panel = vscode.window.createWebviewPanel('reactExtension',
                                                  modulename,
                                                  vscode.ViewColumn.One,
                                                  {
                                                    enableScripts: true
                                                  }  );
    
    let htmlContent: string = CANDB.getHtmlForWebview(context.extensionPath);
    let webpackPathOnDisk = vscode.Uri.file(path.join(context.extensionPath, 'dist/messageEditor.js'));
    let webpackUri = panel.webview.asWebviewUri(webpackPathOnDisk);
    htmlContent = htmlContent.replace('${rootUri}', webpackUri.toString());

    panel.webview.html = htmlContent;
    
    let candbMsg = candb.dbMapping.get("Messages").find((element: CANDB.SignalForm) => element.name === modulename);
    let candbAllSignals = candb.dbMapping.get("Signals");

    panel.webview.postMessage({
                      message: candbMsg,
                      signals: candbAllSignals});

    panel.webview.onDidReceiveMessage((message: any) => {
      switch (message.command) {
        case 'modifyMsgForm':
          let index = candb.dbMapping.get("Messages").findIndex((element: CANDB.MessageForm) =>
                  element.uid === message.data.uid);
          if (index !== -1) {
            candb.dbMapping.get("Messages")[index] = message.data;
          }
          vscode.commands.executeCommand('vscode-plugin-demo.refresh_treeview');
          vscode.window.showInformationMessage("save message");
          return;
          
        case 'cancelMsgForm':
            vscode.commands.executeCommand('workbench.action.closeActiveEditor');
            return;
      }}, 
      undefined,
      context.subscriptions
    );
    
    panel.onDidDispose(onPanelDispose, null, context.subscriptions);

    // webViewPanel = panel;
}

// let webViewPanel : vscode.WebviewPanel;

function onPanelDispose(): void {
    // Clean up panel here
}
