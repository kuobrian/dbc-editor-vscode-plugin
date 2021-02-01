import BrowserInteractor from './BrowserInteractor';
import VsCodeInteractorFactory from './VsCodeInteractorFactory';

const Interactor = InteractorFactory.create();


function tryAcquireVsCodeApi() {
  try {
    return acquireVsCodeApi();
  }
  catch { // In this case we are not in VsCode context
    return null;
  }
}

function create() {
  const vsCodeApi = tryAcquireVsCodeApi();
  console.log(vsCodeApi);

  if (vsCodeApi === null) {
    return BrowserInteractor;
  }
  else {
    return VsCodeInteractorFactory.createFromVsCodeApi(vsCodeApi);
  }
}

const InteractorFactory = {
  create : create
}

export default InteractorFactory;