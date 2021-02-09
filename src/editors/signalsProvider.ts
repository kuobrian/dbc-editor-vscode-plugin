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
    
    let candbSignal = candb.dbMapping.get("Signals").find((element: CANDB.SignalForm) => element.name === modulename);
    let candbAllMsgs = candb.dbMapping.get("Messages");

    panel.webview.postMessage({ message: candbAllMsgs,
                                signals: candbSignal,
                                isPreview: isPreview});



    panel.webview.onDidReceiveMessage((message: any) => {
      switch (message.command) {
        case 'modifySignalForm':
          let index = candb.dbMapping.get("Signals").findIndex((element: CANDB.SignalForm) => element.uid === message.data.uid);
          if (index !== -1) {
            candb.dbMapping.get("Signals")[index] = message.data;
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



