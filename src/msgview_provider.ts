import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as CANDB from './candb_provider';

export function startMsgHandler(context: vscode.ExtensionContext, modulename: string, candb: CANDB.CANdb): void {
    console.log(candb.itemsInCANdb());
    console.log(candb.itemsInMsg());
    console.log("===============================================");
    const panel = vscode.window.createWebviewPanel('reactExtension',
                                                  modulename,
                                                  vscode.ViewColumn.One,
                                                  {
                                                    enableScripts: true
                                                  }  );
    
    let htmlContent: string = getHtmlForWebview(context.extensionPath);
    let webpackPathOnDisk = vscode.Uri.file(path.join(context.extensionPath, 'dist/messageEditor.js'));
    let webpackUri = panel.webview.asWebviewUri(webpackPathOnDisk);
    htmlContent = htmlContent.replace('${rootUri}', webpackUri.toString());

    panel.webview.html = htmlContent;
    
    let candbSignal = candb.dbMapping.get("Messages").find((element: CANDB.SignalForm) => element.name === modulename);
    console.log(candbSignal);

    panel.webview.postMessage(candbSignal);

    panel.webview.onDidReceiveMessage((message: any) => {
      switch (message.command) {
        case 'modifySignalForm':
          let index = candb.dbMapping.get("Signals").findIndex((element: CANDB.SignalForm) => element.uid === message.data.uid);
          if (index !== -1) {
            candb.dbMapping.get("Signals")[index] = message.data;
          }
          vscode.commands.executeCommand('vscode-plugin-demo.refresh_treeview');
          vscode.window.showInformationMessage("save signal");
          return;
          
        case 'cancelSignalForm':
            vscode.commands.executeCommand('workbench.action.closeActiveEditor');
            return;


        case 'getDirectoryInfo':
          runDirCommand((result : string) => 
            panel.webview.postMessage({ command: 'getDirectoryInfo', directoryInfo: "123" })
            );
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

function runDirCommand(callback : Function) {
    var spawn = require('child_process').spawn;
    var cp = spawn(process.env.comspec, ['/c', 'dir']);

    cp.stdout.on("data", function(data : any) {
      const dataString = data.toString();
      callback(dataString);
    });
    
    cp.stderr.on("data", function(data : any) {
      // No op
    });
  }

export function getHtmlForWebview(rootpath: string): string {
  
	try {
    // const reactApplicationHtmlFilename = "index_out.html";
    const reactApplicationHtmlFilename = "template.html";
    const htmlPath = path.join(rootpath, "dist", reactApplicationHtmlFilename);
    
    const html = fs.readFileSync(htmlPath).toString();
    return html;
	}
	catch(e) {
		return `Error getting HTML for web view: ${e}`;
	}
}

