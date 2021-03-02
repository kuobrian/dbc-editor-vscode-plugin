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
    
    let networkNode = candb.listOfItems.get("Network Node").find((element: CANDB.NetworkNodesForm) => element.name === modulename);
    let allMsgs = candb.listOfItems.get("Messages");
    let allSignals = candb.listOfItems.get("Signals");
    let connectionMsg = candb.connectionMsg;
    let connectionSignal = candb.connectionSignal;
    // console.log(allMsgs);

    panel.webview.postMessage({ networknode: networkNode,
                                message: allMsgs,
                                signal: allSignals,
                                connectionMsg: connectionMsg,
                                connectionSignal: connectionSignal});



    panel.webview.onDidReceiveMessage((message: any) => {
      switch (message.command) {
        case 'modifyNNForm':
          let index = candb.listOfItems.get("Network Node").findIndex((element: CANDB.NetworkNodesForm) => element.uid === message.networknode.uid);
          if (index !== -1) {
            candb.listOfItems.get("Network Node")[index] = message.networknode;
            candb.listOfItems.set("Messages",  message.listOfMsg);
            candb.listOfItems.set("Signals", message.listOfSignal);
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

