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
    
    let message = candb.listOfItems.get("Messages").find((element: CANDB.SignalForm) => element.name === modulename);
    let allNetworkNode = candb.listOfItems.get("Network Node");
    let allSignals = candb.listOfItems.get("Signals");
    let connectionMsg = candb.connectionMsg.find(item=> item.targetId === message.uid);
    console.log(connectionMsg);

    panel.webview.postMessage({ networknode: allNetworkNode,
                                message: message,
                                signal: allSignals,
                                connection: connectionMsg});

    panel.webview.onDidReceiveMessage((message: any) => {
      switch (message.command) {
        case 'modifyMsgForm':
          let index = candb.listOfItems.get("Messages").findIndex((element: CANDB.MessageForm) =>
                  element.uid === message.data.uid);
          if (index !== -1) {
            candb.listOfItems.get("Messages")[index] = message.data;
            let connectIdx = candb.connectionMsg.findIndex(item => item.targetId === message.data.uid);
            candb.connectionMsg[connectIdx] = message.connect;
          }
          vscode.commands.executeCommand('vscode-plugin-demo.refresh_treeview');
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
