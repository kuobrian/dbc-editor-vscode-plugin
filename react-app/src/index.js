import React from "react";
import ReactDOM from "react-dom";
import "./styles.css";
import InteractorFactory from './Interaction/InteractorFactory';

const Interactor = InteractorFactory.create();

class Index extends React.Component {

  constructor(props) {
    super(props);
    this.state = { directoryInfo: "" };
  }

  updateFilesToDisplay() {
    Interactor.getDirectoryInfo(directoryInfo => {
      this.setState({ directoryInfo: directoryInfo });
    });
  }

  render() {
    return <>
      <div className="container">
        <div className="row">
          <div className="col-sm">
            <h1>VSCode React application
          <small>Do something productive...</small>
            </h1>
            <hr />
          </div>
        </div>
        <div className="row">
          <div className="col-sm">
            <h3>Some functionality</h3>
            <p>Use this button to execute some functionality</p>
            <button onClick={() => { Interactor.showInformationMessage("Emojis123123 are in vogue at the moment 🐛") }}>
              Click me
          </button>
          </div>
          <div className="col-sm">
            <button onClick={() => this.updateFilesToDisplay()}>Run <code>dir</code> command</button>
            <br />
            <code>
              {this.state.directoryInfo !== "" ? this.state.directoryInfo : "Run the command..."}
            </code>
          </div>
          <div className="col-sm">
            <form>
              <fieldset>
                <legend>Simple form</legend>
                <label for="username">Username</label>
                <input type="text" id="Username" placeholder="Username" />
                <br />
                <label for="password">Password</label>
                <input type="password" id="password" placeholder="Password" />
              </fieldset>
            </form>
          </div>
        </div>
        {/* <div className="row">
          <div className="col-sm">
            <div className="card">
              <h3>Cat gif</h3>
              <img src="https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif" width="300" className="section media" />
            </div>
          </div>
        </div> */}
      </div>
    </>
  }
}

ReactDOM.render(<Index />, document.getElementById("test"));