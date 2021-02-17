import * as React from 'react';
import * as ReactDOM from "react-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import {  Row, Col, Tabs, Tab, Table, Form, Button,  Modal } from "react-bootstrap";
import { MessageForm } from '../../src/candb_provider';
import {SelectTransmittersTable} from "../msgComponents/transmittersSelected";
import {SelectSignalTable} from "../msgComponents/signalSelected";
import {MessageDefinition} from "../msgComponents/messageDefinition";

declare global {
    interface Window {
      acquireVsCodeApi(): any;
    }
}

window.addEventListener('message', (event) =>{
    let vscode = window.acquireVsCodeApi();
    let message = event.data.message;
    let listOfSignal = event.data.signal;
    let rawConnection = event.data.connection;

    
    const messageUid = message.uid;

    console.log("messageEditor Receieve:：", message.name, listOfSignal.length, rawConnection);



    const App = () =>  {
        const styles = {
          formGroupStyle: {
            padding: 20
          },
          container: {
              paddingLeft: 0,
              paddingRight: 0
          },
          row: {
              marginLeft: 0,
              marginRight: 0
          },
          col: {
              paddingLeft: 0,
              paddingRight: 0
          }
        };
        const [show, setShow] = React.useState(false);

        const t_handleClose = () => setShow(false);
        const t_handleShow = () => setShow(true);
        let copyMsg:any=[];
        copyMsg = JSON.parse(JSON.stringify(message));

        const updateMessageValue =  (msg: MessageForm, connectionData: string[]) => {
          message = msg;
          rawConnection = connectionData;
        };
        
        
        const handleFormChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>): void => {
          // console.log( e.target.value);
          const msgKey = e.target.id.split("_")[1];
          message[msgKey] = e.target.value;
        };

        function onSaveBtnClick(): void {
          vscode.postMessage({
            command: 'modifyMsgForm',
            data: message,
            connect: rawConnection
          });
        }
        
        function onCancelBtnClick(): void {
          vscode.postMessage({
            command: 'cancelMsgForm'
          });
        }


        return (
                <>
                <Tabs defaultActiveKey="definition" id="uncontrolled-tab-example">
                    <Tab eventKey="definition" title="Definition">
                      <MessageDefinition  msg = {message} 
                                          listOfSignal = {listOfSignal}
                                          isPreview = {false}
                                          connection = {rawConnection}
                                          updateValue={updateMessageValue}/>
                    </Tab>
                    <Tab eventKey="signals" title="Signals">
                        <SelectSignalTable  msg={message}  
                                            listOfSignal={listOfSignal}
                                            isPreview={false}
                                            connection = {rawConnection}
                                            updateValue={updateMessageValue}/>
                    </Tab>
                    <Tab eventKey="transmitters" title="Transmitters">
                        {/* <SelectTransmittersTable msg={message}  allSignals={allSignals}  updateValue={updateMessageValue}/> */}
                    </Tab>
                    <Tab eventKey="receivers" title="Receivers" >
                      <Table striped bordered hover variant="dark">
                        <thead>
                          <tr>
                            <th>Attribute</th>
                            <th>Value</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>1</td>
                              {Array.from({ length: 2 }).map((_, index) => (
                                      <td key={index}>Table cell {index}</td>
                                ))
                              }
                          </tr>
                          <tr>
                            <td>2</td>
                              {Array.from({ length: 2 }).map((_, index) => (
                                      <td key={index}>Table cell {index}</td>
                                ))
                              }
                          </tr>
                        </tbody>
                      </Table>
                      <Row>
                          <Col>
                              <Button variant="secondary" onClick={t_handleShow} disabled>
                              Read from DB ...
                              </Button>
                              <Modal show={show}
                                      onHide={t_handleClose}
                                      backdrop="static"
                                      keyboard={false}>
                                <Modal.Header closeButton>
                                  <Modal.Title>Modal heading</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
                                  <Modal.Footer>
                                    <Button variant="secondary" onClick={t_handleClose}>
                                    Close
                                    </Button>
                                    <Button variant="primary" onClick={t_handleClose}>
                                    Save Changes
                                    </Button>
                                 </Modal.Footer>
                              </Modal>
                          </Col>
                          <Col>
                              <Button variant="secondary" onClick={t_handleShow} disabled>
                              Write to DB
                              </Button>
                          </Col>
                          <Col>
                              <Button variant="secondary" onClick={t_handleShow} disabled>
                              Reset
                              </Button>
                          </Col>
                        </Row>
                    </Tab>
                    <Tab eventKey="layout" title="Layout" >
                      <Table striped bordered hover variant="dark">
                        <thead>
                          <tr>
                            <th>Value</th>
                            <th>Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>1</td>
                              {Array.from({ length: 3 }).map((_, index) => (
                                      <td key={index}>Table cell {index}</td>
                                ))
                              }
                          </tr>
                          <tr>
                            <td>2</td>
                              {Array.from({ length: 3 }).map((_, index) => (
                                      <td key={index}>Table cell {index}</td>
                                ))
                              }
                          </tr>
                        </tbody>
                      </Table>
                    </Tab>
                    <Tab eventKey="attributes" title="Attributes" >
                      <Form.Group controlId="textarea1">
                        <Form.Control as="textarea" rows={30} placeholder="Type your message here..." />
                        <Button style={{ marginLeft: "50%"}} variant="primary" type="submit">
                        Submit
                        </Button>
                      </Form.Group>
                       
                    </Tab>
                    <Tab eventKey="comment" title="Comment" >
                      <Form.Group controlId="_comments">
                        <Form.Control as="textarea" 
                                      rows={30}
                                      defaultValue={ message.comments}
                                      placeholder="Type your comments here ..."
                                      onChange={(event) => handleFormChange(event as any)}/>
                        
                      </Form.Group>
                    </Tab>
                </Tabs>
              

                <div style={{margin:"20px"}} className="mb-2">
                    <Button variant="success" size="lg" type="save" onClick={onSaveBtnClick}>
                    Save
                    </Button>{' '}
                    <Button   variant="secondary" size="lg"  type="cancel" onClick={onCancelBtnClick}>
                    Cancel
                    </Button>
                </div>
                
                
                </>
            );
        };

    ReactDOM.render(<App />, document.getElementById('root'));
});