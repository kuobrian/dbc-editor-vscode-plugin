
declare global {
  interface Window {
    acquireVsCodeApi(): any;
  }
}

/* List  Interactors */
export const Interactor = {
  showInformationMessageTTT: text => console.log(`showInformationMessage ${text}`),
  getDirectoryInfo: callback => console.log(`getDirectoryInfo ${callback}`),
  getinitFormValue: callback => console.log(`getinitFormValue ${callback}`)
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
  console.log(event.data['text'], event.data['test']);

  switch(message.command){
    case 'getDirectoryInfo':
      vsCodeStateChangeBuffer.directoryInfo += message.directoryInfo;
      vsCodeStateChangeCallbacks.getDirectoryInfo(vsCodeStateChangeBuffer.directoryInfo);
    case 'getInitValue':
      console.log( message.initText);
      Interactor.getinitFormValue(message.initText);
    break;
  }
});

export class InteractorFactory {
	public _interactor: any ;

	constructor() {
		this._interactor = this.create(window.acquireVsCodeApi());
	};


	private create(vscode) {
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
}