import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { throws } from 'assert';


class WebViewPanel {
  private static _instance: WebViewPanel | null;

  public static createOrShow(context: vscode.ExtensionContext) {
    const column = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined;
    if (WebViewPanel._instance) {
        WebViewPanel._instance._panel.reveal(column);
    } else {
        WebViewPanel._instance = new WebViewPanel(context);
    }
  }
  
  public readonly viewType = 'SinglePageApplicationPanel';
  
  
  private _panel: vscode.WebviewPanel ;

  private get webview() {
    return this._panel.webview;
  }

  private constructor(private context: vscode.ExtensionContext) {
    this._panel = this.createPanel(context);
    this.onLifeCycleChanges();
    this.onWebViewMessage();
    let htmlContent: string = getHtmlForWebview(context.extensionPath);
    
    const vsUri = vscode.Uri.parse( path.join(context.extensionPath, 'dist/webview.js') );
    let webpackPathOnDisk = vscode.Uri.file(path.join(context.extensionPath, 'dist/bundle.js'));
    let webpackUri = this._panel.webview.asWebviewUri(webpackPathOnDisk);

    let helloPathOnDisk = vscode.Uri.file(path.join(context.extensionPath, 'dist/hello.js'));
    let hellokUri = this._panel.webview.asWebviewUri(helloPathOnDisk);

    /* Rplace keywords from html content */
    htmlContent = htmlContent.replace('${scriptUri}', webpackUri.toString());
    htmlContent = htmlContent.replace('${helloUri}', hellokUri.toString());
    this._panel.webview.html = htmlContent;
    this._disposables.push(this._panel);
  }
  
  private createPanel(context: vscode.ExtensionContext) {  
    const panel = vscode.window.createWebviewPanel(
      'reactExtension',
      'React extension',
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: []
      }
    );
    return panel;
  }
  
  private _viewStateEmitter = new vscode.EventEmitter();

  public get onDidChangeViewState() {
    return this._viewStateEmitter.event;
  }
  
  public get onDidReceiveMessage() {
    return this._viewStateEmitter.event;
  }
  private _messageEmitter = new vscode.EventEmitter();

  private _disposables: vscode.Disposable[] = [];

  private onLifeCycleChanges() {
    this._panel.onDidChangeViewState( e => {
      this._viewStateEmitter.fire(e);
    },
    null,
    this._disposables);
    this._disposables.push(this._viewStateEmitter);
    this._panel.onDidDispose(() => {
      this._disposables.forEach((d: vscode.Disposable) => d.dispose());
      this._disposables = [];
      WebViewPanel._instance = null;

    }, null, this._disposables);
  }

  private onWebViewMessage() {
    this._panel.webview.onDidReceiveMessage(
      message => {
        this._messageEmitter.fire(message);
      },
      null, this._disposables
    );
    this._disposables.push(this._messageEmitter);
  }
  public sendMessage(action: string) {
    this.webview.postMessage(action);
   }
}



export function startCommandHandler(context: vscode.ExtensionContext): void {
    const panel = vscode.window.createWebviewPanel('reactExtension',
                                                  'React extension',
                                                  vscode.ViewColumn.One,
                                                  {
                                                    enableScripts: true
                                                  }  );
    
    let htmlContent: string = getHtmlForWebview(context.extensionPath);

    let helloPathOnDisk = vscode.Uri.file(path.join(context.extensionPath, 'dist/hello.js'));
    let hellokUri = panel.webview.asWebviewUri(helloPathOnDisk);
    htmlContent = htmlContent.replace('${scriptUri}', hellokUri.toString());
    panel.webview.html = htmlContent;

    // // 傳送訊息給Webview
    panel.webview.postMessage({text: "hello hihihihihihihihihihihihihihihihihi"});

    // 接收Webview傳來的訊息
    panel.webview.onDidReceiveMessage(
        onPanelDidReceiveMessage,
        undefined,
        context.subscriptions
    );
    panel.onDidDispose(onPanelDispose, null, context.subscriptions);

    webViewPanel = panel;
}

let webViewPanel : vscode.WebviewPanel;

function onPanelDispose(): void {
    // Clean up panel here
  }
function onPanelDidReceiveMessage(message: any) {
  console.log(message.command);
  switch (message.command) {
    case 'showInformationMessage123':
        vscode.window.showInformationMessage(message.text);
        return;
  
      case 'getDirectoryInfo':
        runDirCommand((result : string) => 
          webViewPanel.webview.postMessage({ command: 'getDirectoryInfo', directoryInfo: result })
        );
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
    
    const html = fs.readFileSync(htmlPath).toString();
    return html;
	}
	catch(e) {
		return `Error getting HTML for web view: ${e}`;
	}
}

