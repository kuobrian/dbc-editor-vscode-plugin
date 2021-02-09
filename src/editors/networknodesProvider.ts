import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as CANDB from '../candb_provider';

export function startNetworkNodesHandler(context: vscode.ExtensionContext, modulename: string, candb: CANDB.CANdb): void {
  
  const panel = vscode.window.createWebviewPanel('reactExtension',
                                                  modulename,
                                                  vscode.ViewColumn.One,
                                                  {
                                                    enableScripts: true,
                                                    retainContextWhenHidden: true
                                                  }  );
    
    let htmlContent: string = CANDB.getHtmlForWebview(context.extensionPath);
    let webpackPathOnDisk = vscode.Uri.file(path.join(context.extensionPath, 'dist/networknodesEditor.js'));
    let webpackUri = panel.webview.asWebviewUri(webpackPathOnDisk);
    htmlContent = htmlContent.replace('${rootUri}', webpackUri.toString());


    panel.webview.html = htmlContent;
    
    let candbNetworkNode = candb.dbMapping.get("Network Node").find((element: CANDB.NetworkNodesForm) => element.name === modulename);
    let candbAllMsgs = candb.dbMapping.get("Messages");
    let candbAllSignals = candb.dbMapping.get("Signals");
    // console.log(candbAllMsgs);

    panel.webview.postMessage({ networknode: candbNetworkNode,
                                messages: candbAllMsgs,
                                signals: candbAllSignals});



    panel.webview.onDidReceiveMessage((message: any) => {
      switch (message.command) {
        case 'modifyNNForm':
          let index = candb.dbMapping.get("Network Node").findIndex((element: CANDB.SignalForm) => element.uid === message.data.uid);
          if (index !== -1) {
            candb.dbMapping.get("Network Node")[index] = message.data;
          }
          vscode.commands.executeCommand('vscode-plugin-demo.refresh_treeview');
          return;
          
        case 'cancelNNForm':
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

