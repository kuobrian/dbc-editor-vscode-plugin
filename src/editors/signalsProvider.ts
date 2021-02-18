import * as vscode from 'vscode';
import * as path from 'path';

import * as CANDB from '../candb_provider';

export function startSignalHandler(context: vscode.ExtensionContext, modulename: string, candb: CANDB.CANdb, isPreview: boolean): void {
    const panel = vscode.window.createWebviewPanel('reactExtension',
                                                  modulename,
                                                  vscode.ViewColumn.One,
                                                  {
                                                    enableScripts: true,
                                                    retainContextWhenHidden: true
                                                  }  );
    
    let htmlContent: string = CANDB.getHtmlForWebview(context.extensionPath);
    let webpackPathOnDisk = vscode.Uri.file(path.join(context.extensionPath, 'dist/signalEditor.js'));
    let webpackUri = panel.webview.asWebviewUri(webpackPathOnDisk);
    htmlContent = htmlContent.replace('${rootUri}', webpackUri.toString());
    panel.webview.html = htmlContent;
    
    let signal = candb.listOfItems.get("Signals").find((element: CANDB.SignalForm) => element.name === modulename);
    let allMsgs = candb.listOfItems.get("Messages");
    let connectionSignal = candb.connectionSignal.find(item=> item.targetId === signal.uid);
    


    

    panel.webview.postMessage({ signal: signal,
                                message: allMsgs,
                                connection: connectionSignal,
                                isPreview: isPreview});



    panel.webview.onDidReceiveMessage((message: any) => {
      switch (message.command) {
        case 'modifySignalForm':
          let index = candb.listOfItems.get("Signals").findIndex((element: CANDB.SignalForm) => element.uid === message.data.uid);
          if (index !== -1) {
            candb.listOfItems.get("Signals")[index] = message.data;
            let connectIdx = candb.connectionSignal.findIndex(item => item.targetId === message.data.uid);
            candb.connectionSignal[connectIdx] = message.connect;
          }
          
          vscode.commands.executeCommand('vscode-plugin-demo.refresh_treeview');
          return;
          
        case 'cancelSignalForm':
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



