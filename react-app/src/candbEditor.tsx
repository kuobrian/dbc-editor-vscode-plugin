import * as React from 'react';
import * as ReactDOM from "react-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import Jumbotron from 'react-bootstrap/Jumbotron';
import Toast from 'react-bootstrap/Toast';
import Container from 'react-bootstrap/Container';
import Tabs from "react-bootstrap/Tabs";

import Tab from "react-bootstrap/Tab";
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Badge from 'react-bootstrap/Badge';

declare global {
    interface Window {
      acquireVsCodeApi(): any;
    }
}


export interface HelloProps { compiler: string; framework: string; }

window.addEventListener('message', (event) =>{
    const message = event.data;
    console.log('candbEditor  Webview接收到的消息：', message);

    const Hello = (props: HelloProps) => <h1>Hello from {props.compiler} and {props.framework}!</h1>;



    const App = () =>  {
    
        return (
                <>
                <Tabs defaultActiveKey="definition" id="uncontrolled-tab-example">
                  <Tab eventKey="definition" title="Definition">
                      <div className="col-sm">
                          <Form>
                              <Form.Group controlId="signalName">
                                  <Form.Label>Name:</Form.Label> <Form.Control type="email" placeholder="Enter email" />
                                  <Form.Text className="text-muted">  init value </Form.Text>
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
                  </Tab>
                  <Tab eventKey="messages" title="Messages">
                      <Form.Group className="m-0">
                      <Form.Control
                          className="textFeedback"
                          placeholder="feedback"
                          type="text"
                      />
                      <Button className="btnFormSend" variant="outline-success" > Send Feedback </Button>
                      </Form.Group>
                  </Tab>
                  <Tab eventKey="receivers" title="Receivers" >
                      <Button >
                      Happy Coding  
                      </Button>
                  </Tab>
                  <Tab eventKey="attributes" title="Attributes" >
                      <Button >
                      Happy Coding  
                      </Button>
                  </Tab>
                  <Tab eventKey="valueDescriptions" title="Value Descriptions" >
                      <Button >
                      Happy Coding  
                      </Button>
                  </Tab>
                  <Tab eventKey="comment" title="Comment" >
                      <Button >
                      Happy Coding  
                      </Button>
                  </Tab>
                </Tabs>
                </>
            );
        };

    ReactDOM.render(<App />, document.getElementById('root'));
});