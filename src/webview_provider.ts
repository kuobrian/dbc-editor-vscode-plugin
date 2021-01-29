import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

const webViewPanelTitle = 'React extension';
const webViewPanelId = 'reactExtension';


export function startCommandHandler(context: vscode.ExtensionContext): void {
	const showOptions = {
    enableScripts: true,
    
	};
	console.log('startCommandHandler is now active!');
	const panel = vscode.window.createWebviewPanel(
		webViewPanelId,
		webViewPanelTitle,
		vscode.ViewColumn.One,
		showOptions
	);
    let htmlContent: string = getHtmlForWebview(context.extensionPath);
    
    const vsUri = vscode.Uri.parse( path.join(context.extensionPath, 'dist/webview.js') );
    let webpackPathOnDisk = vscode.Uri.file(path.join(context.extensionPath, 'dist/bundles.js'));
    let webpackUri = panel.webview.asWebviewUri(webpackPathOnDisk);
    console.log(webpackUri);
    /* Rplace keywords from html content */
    htmlContent = htmlContent.replace('${scriptUri}', webpackUri.toString());
    panel.webview.html = htmlContent;
    
    // // 傳送訊息給Webview
    // panel.webview.postMessage({...});

    // 接收Webview傳來的訊息
    panel.webview.onDidReceiveMessage(
        onPanelDidReceiveMessage,
        undefined,
        context.subscriptions
    );
    panel.onDidDispose(onPanelDispose, null, context.subscriptions);
	// panel.onDidChangeViewState(e => {
	// 			const panel = e.webviewPanel;
	// 			const activeState = 'ActiveState: '+panel.active;
	// 			const visibleState = 'VisibleState: ' + panel.visible;
	// 			const currentViewColumn = 'CurrentVisibleColumn: ' + panel.viewColumn;
	// 			[activeState, visibleState, currentViewColumn].forEach(msg => {
	// 				console.log(msg);
	// 				vscode.window.showInformationMessage(msg);
					
	// 			});
	// 		},
	// 		null,
	// 		context.subscriptions
    // );
    webViewPanel = panel;
}
let webViewPanel : vscode.WebviewPanel;
function onPanelDispose(): void {
    // Clean up panel here
  }
function onPanelDidReceiveMessage(message: any) {
    console.log(message.command);
    switch (message.command) {
      case 'showInformationMessage':
        vscode.window.showInformationMessage(message.text);
        return;
  
      case 'getDirectoryInfo':
        runDirCommand((result : string) => webViewPanel.webview.postMessage({ command: 'getDirectoryInfo', directoryInfo: result }));
        return;
    }
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
    console.log("htmlPath: ", htmlPath);
    const html = fs.readFileSync(htmlPath).toString();
    return html;
	}
	catch(e) {
		return `Error getting HTML for web view: ${e}`;
	}
}

