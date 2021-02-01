
declare global {
  interface Window {
    acquireVsCodeApi(): any;
  }
}

/* List  Interactors */
export const Interactor = {
  showInformationMessageTTT: text => console.log(`showInformationMessage ${text}`),
  getDirectoryInfo: callback => console.log(`getDirectoryInfo ${callback}`)
};


const vsCodeStateChangeCallbacks = {
  getDirectoryInfo: directoryInfo => {}
};

const vsCodeStateChangeBuffer = {
  directoryInfo: ""
};

window.addEventListener('message', event => {
  const message = event.data;
  console.log('Webview接收到的消息：', message);
  console.log(event.data['text']);

  switch(message.command){
    case 'getDirectoryInfo':
      vsCodeStateChangeBuffer.directoryInfo += message.directoryInfo;
      vsCodeStateChangeCallbacks.getDirectoryInfo(vsCodeStateChangeBuffer.directoryInfo);
    break;
  }
});

function createFromVsCodeApi(vscode) {
  Interactor.showInformationMessageTTT = text =>
    vscode.postMessage({
    command: 'showInformationMessage123',
    text: text
  });

  Interactor.getDirectoryInfo = callback => {
    vsCodeStateChangeCallbacks.getDirectoryInfo = callback;
    vsCodeStateChangeBuffer.directoryInfo = "";
    vscode.postMessage({ command: 'getDirectoryInfo' });
  };
  return Interactor;
}


export class InteractorFactory {
  public _interactor: any ;
  constructor() {
    this._interactor = this.create();
  };
  private create() {
    return createFromVsCodeApi(window.acquireVsCodeApi());
  }
}