import * as React from 'react';
import * as ReactDOM from "react-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import {SelectMsgTable} from "../signalComponents/msgSelected";
import { SignalForm } from '../../src/candb_provider';


import {  Row, Col, Tabs, Tab, Table, Form, Button,  Modal } from "react-bootstrap";

declare global {
    interface Window {
      acquireVsCodeApi(): any;
    }
}


window.addEventListener('message', (event) =>{
    let vscode = window.acquireVsCodeApi();
    let messages = event.data.message;
    let signal = event.data.signals;

    const signalUid = signal.uid;

    console.log('signalEditor  Webview接收到的消息：', signal.name, messages.length);

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

        const handleClose = () => setShow(false);
        const handleShow = () => setShow(true);
        let copyMsg:any=[];
        
        copyMsg = JSON.parse(JSON.stringify(signal));
        const updateSignalValue =  (data: SignalForm) => {
          signal = data;
        };
        const handleFormChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>): void => {
          const msgKey = e.target.id.split("_")[1];
          signal[msgKey] = e.target.value;
        };

        function onSaveBtnClick(): void {
          vscode.postMessage({
            command: 'modifySignalForm',
            data: signal
          });
        }
        
        function onCancelBtnClick(): void {
          vscode.postMessage({
            command: 'cancelSignalForm'
          });
        }


        return (
                <>
                <Tabs defaultActiveKey="definition" id="uncontrolled-tab-example">
                    <Tab eventKey="definition" title="Definition">
                      <Form >
                        <Form.Row>
                          <Form.Group as={Col} md="3" controlId="_name">
                            <Form.Label>Name:</Form.Label>
                            <Form.Control required
                                          type="text"
                                          defaultValue={signal.name}
                                          onChange={(event) => handleFormChange(event as any)}>
                            </Form.Control>
                          </Form.Group>
                        </Form.Row>
                        <Form.Row>
                          <Form.Group as={Col} md="3" controlId="_bitlength">
                            <Form.Label>Length (Bit):</Form.Label>
                            <Form.Control type="Length"
                                          defaultValue={signal.bitlength}
                                          onChange={(event) => handleFormChange(event as any)}>
                            </Form.Control>
                          </Form.Group>
                        </Form.Row>
                        <Form.Row>
                          <Form.Group as={Col} md="3" controlId="_byteorder">
                            <Form.Label>Byte Order:</Form.Label>
                            <Form.Control as="select" 
                                          defaultValue={signal.byteorder} 
                                          onChange={(event) => handleFormChange(event as any)}>
                                  <option>Intel</option>
                                  <option>Motorola</option>
                            </Form.Control>
                          </Form.Group>
                          <Form.Group as={Col} md="3" controlId="_unit">
                            <Form.Label>Unit:</Form.Label>
                            <Form.Control type="Length"
                                          defaultValue={signal.unit}
                                          onChange={(event) => handleFormChange(event as any)}>
                            </Form.Control>
                          </Form.Group>
                        </Form.Row>
                        <Form.Row>
                          <Form.Group as={Col} md="3" controlId="_valuetype">
                            <Form.Label>Value Type:</Form.Label>
                            <Form.Control as="select"
                                          defaultValue={signal.valuetype}
                                          onChange={(event) => handleFormChange(event as any)}>
                                    <option>Signed</option>
                                    <option>Unsigned</option>
                                    <option>IEEE Float</option>
                                    <option>IEEE Double</option>
                            </Form.Control>
                          </Form.Group>
                          <Form.Group as={Col} md="3" controlId="_initValue">
                            <Form.Label>Init Value:</Form.Label>
                            <Form.Control type="Length" 
                                          defaultValue={signal.initValue}
                                          onChange={(event) => handleFormChange(event as any)}>
                            </Form.Control>
                          </Form.Group>
                        </Form.Row>
                        <Form.Row>
                          <Form.Group as={Col} md="3" controlId="_factor">
                            <Form.Label>Factor:</Form.Label>
                            <Form.Control type="Length" 
                                          defaultValue={signal.factor}
                                          onChange={(event) => handleFormChange(event as any)}>
                            </Form.Control>
                          </Form.Group>
                          <Form.Group as={Col} md="3" controlId="_offset">
                            <Form.Label>Offset:</Form.Label>
                            <Form.Control type="Length" 
                                          defaultValue={signal.offset}
                                          onChange={(event) => handleFormChange(event as any)}>
                            </Form.Control>
                          </Form.Group>
                        </Form.Row>
                        <Form.Row>
                          <Form.Group as={Col} md="3" controlId="_minimun">
                            <Form.Label>Minimun:</Form.Label>
                            <Form.Control type="Length"
                                          defaultValue={signal.minimun}
                                          onChange={(event) => handleFormChange(event as any)}>
                            </Form.Control>
                          </Form.Group>
                          <Form.Group as={Col} md="3" controlId="_maximum">
                            <Form.Label>Maximum:</Form.Label>
                            <Form.Control type="Length"
                                          defaultValue={signal.maximum}
                                          onChange={(event) => handleFormChange(event as any)}>
                            </Form.Control>
                          </Form.Group>
                        </Form.Row>
                        <Form.Row>
                          <Form.Group as={Col} md="6" controlId="validationCustom03">
                            <Button variant="primary" size="sm" block>Calculate minimum and maximum</Button>
                          </Form.Group>
                        </Form.Row>
                        <Form.Row>
                          <Form.Group as={Col} md="6" controlId="validationCustom03">
                            <Form.Label>Value Table:</Form.Label>
                            <Form.Control as="select" 
                                          defaultValue={signal.valuetable}
                                          onChange={(event) => handleFormChange(event as any)}>
                              <option>None</option>
                            </Form.Control>
                          </Form.Group>
                        </Form.Row>
                      </Form>
                    </Tab>
                    <Tab eventKey="messages" title="Messages">
                        <SelectMsgTable allMessages={messages}  signal={signal} updateValue={updateSignalValue}/>
                    </Tab>
                    <Tab eventKey="receivers" title="Receivers">
                      <Table striped bordered hover variant="dark">
                          <thead>
                            <tr>
                              <th>Name</th>
                              <th>Address</th>
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
                      <Row>
                          <Col>
                              <Button variant="primary" onClick={handleShow}>
                              View
                              </Button>
                          </Col>
                        </Row>                    
                    </Tab>
                    <Tab eventKey="attributes" title="Attributes" >
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
                              <Button variant="secondary" onClick={handleShow} disabled>
                              Read from DB ...
                              </Button>
                              <Modal show={show}
                                      onHide={handleClose}
                                      backdrop="static"
                                      keyboard={false}>
                                <Modal.Header closeButton>
                                  <Modal.Title>Modal heading</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
                                  <Modal.Footer>
                                    <Button variant="secondary" onClick={handleClose}>
                                    Close
                                    </Button>
                                    <Button variant="primary" onClick={handleClose}>
                                    Save Changes
                                    </Button>
                                 </Modal.Footer>
                              </Modal>
                          </Col>
                          <Col>
                              <Button variant="secondary" onClick={handleShow} disabled>
                              Write to DB
                              </Button>
                          </Col>
                          <Col>
                              <Button variant="secondary" onClick={handleShow} disabled>
                              Reset
                              </Button>
                          </Col>
                        </Row>
                    </Tab>
                    <Tab eventKey="valueDescriptions" title="Value Descriptions" >
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
                    <Tab eventKey="comment" title="Comment" >
                      <Form.Group controlId="_comments">
                        <Form.Control as="textarea" 
                                      rows={30}
                                      defaultValue={ signal.comments}
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