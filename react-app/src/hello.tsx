import React, { useState } from 'react';
import * as ReactDOM from "react-dom";
import Jumbotron from 'react-bootstrap/Jumbotron';
import Toast from 'react-bootstrap/Toast';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {InteractorFactory, Interactor } from './utils';

const res = new InteractorFactory();

export class HomePage extends React.Component {
  private directoryInfo:string;

  constructor(props) {
    super(props);
    this.directoryInfo = "";
  }

  updateFilesToDisplay() {
    res._interactor.getDirectoryInfo(directoryInfo => {
      this.setState({ path: "directoryInfo 123" });
    });
  }

  public render(): JSX.Element {
      return (
        <>
          <div>
            <Button onClick={() => { res._interactor.showInformationMessageTTT("Emojis are in vogue at the moment 🐛"); }}>
               Happy Coding  
            </Button>

          </div>
          <div className="col-sm">
          <Form>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
          </Form.Group>
        
          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" />
          </Form.Group>
          <Form.Group controlId="formBasicCheckbox">
            <Form.Check type="checkbox" label="Check me out" />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
        </div>
        <div className="col-sm">
            <button onClick={() => this.updateFilesToDisplay()}>Run <code>dir</code> command</button>
            <br />
            <code>
              {this.directoryInfo !== "" ? this.directoryInfo : "Run the command..."}
            </code>
        </div>   
      </>  
      );
  }
}