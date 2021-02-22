import * as React from 'react';
import * as ReactDOM from "react-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { SignalForm, MessageForm, NetworkNodesForm, MsgConnection, SignalInMsg} from '../../src/candb_provider';
import {SelectSignalTable} from "../networknodesComponents/signalSelected";
import {SelectMsgTable} from "../networknodesComponents/msgSelected";



import {  Row, Col, Tabs, Tab, Table, Form, Button,  Modal } from "react-bootstrap";

declare global {
    interface Window {
      acquireVsCodeApi(): any;
    }
}


window.addEventListener('message', (event) =>{
    let vscode = window.acquireVsCodeApi();
    let networknode = event.data.networknode;
    let listOfMsg = event.data.message;
    let listOfSignal = event.data.signal;
    let connectionMsg = event.data.connectionMsg;

    const nnUid = networknode.uid;

    console.log('networknodesEditor  Webview接收到的消息：', networknode.name, listOfMsg.length);

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
        let copyNN = JSON.parse(JSON.stringify(networknode));
        
        const updateNNValue =  (data: NetworkNodesForm) => {
          networknode = data;
        };
        
        const handleFormChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>): void => {
          const msgKey = e.target.id.split("_")[1];
          networknode[msgKey] = e.target.value;
        };

        function onSaveBtnClick(): void {
          vscode.postMessage({
            command: 'modifyNNForm',
            data: networknode
          });
        }
        
        function onCancelBtnClick(): void {
          vscode.postMessage({
            command: 'cancelNNForm'
          });
        }

        function mappedTxSig (signalItem: SignalForm)  {
          if(connectionMsg.includes(signalItem)) {
            return [
              <tr>
                <td>{listOfSignal.length} </td>
              </tr>
            ]
          } 
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
                                          defaultValue={networknode.name}
                                          onChange={(event) => handleFormChange(event as any)}>
                            </Form.Control>
                          </Form.Group>
                        </Form.Row>
                        <Form.Row>
                          <Form.Group as={Col} md="3" controlId="_address">
                            <Form.Label>Address:</Form.Label>
                            <Form.Control type="Length"
                                          defaultValue={networknode.address}
                                          onChange={(event) => handleFormChange(event as any)}>
                            </Form.Control>
                          </Form.Group>
                        </Form.Row>
                      </Form>
                    </Tab>
                    <Tab eventKey="mappedtx" title="Mapped Tx Sig.">
                      <Table striped bordered hover variant="dark" 
                              className="table table-bordered table-hover"
                              id="tab_logic">
                          <thead>
                            <tr>
                              <th>Signal</th>
                              <th>Message</th>
                              <th>Multiplexing/Group</th>
                              <th>Startbit</th>
                              <th>Length (Bit)</th>
                              <th>Byte Order</th>
                              <th>Value Type</th>
                            </tr>
                          </thead>
                          <tbody>
                            { 
                              listOfMsg.map((msgItem: MessageForm) =>{
                                if (msgItem.transmitters.findIndex(t => t.uid === networknode.uid) >= 0) 
                                {
                                  let connectedSignals = connectionMsg.find((item:MsgConnection) => item.targetId === msgItem.uid).connection;
                                    return (
                                      connectedSignals.map((signalItem: SignalForm) =>{
                                        let startbit = signalItem.startbit;
                                        let contentSignal = listOfSignal.find((s:SignalForm) => s.uid === signalItem.id);
                                        return (
                                          <>
                                            { (signalItem.id === contentSignal.uid) &&  (
                                                <tr>
                                                  <td>{contentSignal.name}</td>
                                                  <td>{msgItem.name}</td>
                                                  <td>{'-'}</td>
                                                  <td>{signalItem.startbit} </td>
                                                  <td>{contentSignal.bitlength}</td>
                                                  <td>{contentSignal.byteorder}</td>
                                                  <td>{contentSignal.valuetype}</td>
                                                </tr>
                                              )
                                            }
                                          </>
                                        );
                                      })
                                    );
                                }
                              })
                            }
                          </tbody>

                      </Table>
                    </Tab>
                    <Tab eventKey="mappedrx" title="Mapped Rx Sig.">
                        {/* <SelectSignalTable netwoknode={networknode}  allMessages={allMessages} allSignals={allSignals} updateValue={updateNNValue}/> */}
                    </Tab>
                    <Tab eventKey="txmessages" title="Tx Messages" >
                      <Table striped bordered hover variant="dark" 
                              className="table table-bordered table-hover"
                              id="tab_logic">
                            <thead>
                              <tr>
                                <th>Name</th>
                                <th>ID</th>
                                <th>ID-Format</th>
                                <th>DLC (Byte)</th>
                                <th>Remove</th>
                              </tr>
                            </thead>
                            <tbody>
                              { 
                                listOfMsg.map((msgItem: MessageForm) =>{
                                  if (msgItem.transmitters.findIndex(t => t.uid === networknode.uid) >= 0) {
                                    return (
                                      <>
                                        { <tr>
                                              <td>{msgItem.name}</td>
                                              <td>{msgItem.id} </td>
                                              <td>{msgItem.msgType}</td>
                                              <td>{msgItem.dlc}</td>
                                              <td>{'-'}</td>
                                          </tr>
                                        }
                                      </>
                                    );}
                                })
                              }
                            </tbody>
                        </Table>
                    </Tab>
                    <Tab eventKey="netwoks" title="Netwoks" >
                    </Tab>
                    <Tab eventKey="contorlunits" title="Contorl units" >
                      <Table  striped bordered hover variant="dark" 
                              className="table table-bordered table-hover"
                              id="tab_logic">
                            <thead>
                              <tr>
                                <th>Name</th>
                                <th></th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                  <td>{networknode.name}</td>
                                  <td></td>
                              </tr>
                            </tbody>
                        </Table>
                    </Tab>
                    <Tab eventKey="attributes" title="Attributes" >
                    </Tab>
                    <Tab eventKey="comment" title="Comment" >
                      <Form.Group controlId="_comments">
                        <Form.Control as="textarea" 
                                      rows={30}
                                      defaultValue={ networknode.comments}
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