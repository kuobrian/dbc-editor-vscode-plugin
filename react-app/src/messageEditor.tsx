import * as React from 'react';
import * as ReactDOM from "react-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import Container from 'react-bootstrap/Container';

import {
  Row, Col, Tabs, Tab, Badge,
  Table,
  Navbar,
  Nav,
  NavDropdown,
  InputGroup,
  Form,
  FormControl,
  Button,
  Modal
 } from "react-bootstrap";

declare global {
    interface Window {
      acquireVsCodeApi(): any;
    }
}
interface IRecipeProps {
  msg?:any;
  allSignals?: any[];
}

interface IRecipeState {
  selectSignal: any[];
  show: boolean;
  checkSelectSignal: boolean
}

class SelectSignalTable extends React.Component <IRecipeProps, IRecipeState> {
  constructor(props) {
    super(props);
    this.state = {selectSignal: [],
                  show: false,
                  checkSelectSignal: false };
    this.handleClose = this.handleClose.bind(this);
    this.handleShow = this.handleShow.bind(this);
  }

  handleClose () { this.setState({ show: false } );}
  handleShow ()  { this.setState({ show: true }); }
  handleSelectSignal (selectItem) {
    if (! this.state.selectSignal.includes(selectItem)) {
      const rows = [...this.state.selectSignal, selectItem];
      this.setState({ selectSignal: rows}, () => {
        console.log("Log: Add selectSignal", this.state.selectSignal.length);
      }); 
    } 
  };


  handleRemoveSpecificRow = (idx) => () => {
    const rows = [...this.state.selectSignal];
    rows.splice(idx, 1);
    this.setState({ selectSignal: rows });
  };
  render() {
    return (
      <div>
        <div className="container">
          <div className="row clearfix">
            <div className="col-md-12 column">
              <Table  striped bordered hover variant="dark" 
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
                    <th>Remove</th>
                  </tr>
                </thead>
                <tbody>
                    { this.state.selectSignal.map((item, idx) => {
                      return (
                        <tr>
                          <td>{item.name}</td>
                          <td>{this.props.msg.name}</td>
                          <td>{'-'}</td>
                          <td>{idx*8}</td>
                          <td>{item.bitlength}</td>
                          <td>{item.byteorder}</td>
                          <td>{item.valuetype}</td>
                          <td>
                            <Button variant="danger" onClick={this.handleRemoveSpecificRow(idx)} >
                            Remove
                            </Button>
                          </td>
                        </tr> 
                      );})
                    }

                </tbody>
              </Table >
              <button onClick={this.handleShow} className="btn btn-primary">
              Add ...
              </button>
              <Modal  size="lg"
                            aria-labelledby="contained-modal-title-vcenter"
                            centered
                            show={this.state.show}
                            onHide={this.handleClose}
                            backdrop="static">
                <Modal.Header closeButton>
                  <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table  striped bordered hover variant="dark" 
                        className="table table-bordered table-hover"
                        id="tab_logic">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Length (Bit)</th>
                                <th>Byte Order</th>
                                <th>Value Type</th>
                                <th>Selected</th>
                            </tr>
                        </thead>
                        <tbody>
                              { 
                                this.props.allSignals.map((item, idx) => {
                                  if (! this.state.selectSignal.includes(item)) {
                                    return (
                                      <tr>
                                        <td>{item.name} {this.state.selectSignal.includes(item)}</td> 
                                        <td>{item.bitlength}</td>
                                        <td>{item.byteorder}</td>
                                        <td>{item.valuetype}</td>
                                        <td>
                                          <Button variant="primary" onClick={() => this.handleSelectSignal(item)}>
                                          add
                                          </Button>
                                        </td>
                                      </tr> 
                                    );
                                }
                              })
                              }
                        </tbody>
                    </Table >
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={this.handleClose}>
                  quit
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

window.addEventListener('message', (event) =>{
    let vscode = window.acquireVsCodeApi();
    const message = event.data.message;
    const allSignals = event.data.signals;

    const messageUid = message.uid;



    console.log('Webview接收到的消息：', message.name, allSignals.length);

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
        
        
        const handleFormChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>): void => {
          // console.log( e.target.value);
          const msgKey = e.target.id.split("_")[1];
          message[msgKey] = e.target.value;
        };

        function onSaveBtnClick(): void {
          vscode.postMessage({
            command: 'modifyMsgForm',
            data: message
          });
        }
        
        function onCancelBtnClick(): void {
          vscode.postMessage({
            command: 'cancelMsgForm'
          });
        }


        return (
                <>


                <Tabs defaultActiveKey="signals" id="uncontrolled-tab-example">
                    <Tab eventKey="definition" title="Definition">
                      <Form >
                        <Form.Row>
                          <Form.Group as={Col} md="3" controlId="_name">
                            <Form.Label>Name:</Form.Label>
                            <Form.Control required
                                          type="text"
                                          defaultValue={message.name}
                                          onChange={(event) => handleFormChange(event as any)}>
                            </Form.Control>
                          </Form.Group>
                        </Form.Row>
                        <Form.Row>
                          <Form.Group as={Col} md="3" controlId="_msgType">
                            <Form.Label>Type:</Form.Label>
                            <Form.Control as="select"
                                          defaultValue={message.msgType}
                                          onChange={(event) => handleFormChange(event as any)}>
                                <option>CAN Standard</option>
                                <option>CAN Extended</option>
                            </Form.Control>
                          </Form.Group>
                        </Form.Row>
                        <Form.Row>
                          <Form.Group as={Col} md="3" controlId="_id">
                            <Form.Label>ID:</Form.Label>
                            <Form.Control defaultValue={message.id} 
                                          onChange={(event) => handleFormChange(event as any)}>
                            </Form.Control>
                          </Form.Group>
                          <Form.Group as={Col} md="2" controlId="_dlc">
                            <Form.Label>DLC:</Form.Label>
                            <Form.Control type='number'
                                          min='1' max='8' step='1'
                                          defaultValue={message.dlc}
                                          onChange={(event) => handleFormChange(event as any)}>
                            </Form.Control>
                          </Form.Group>
                        </Form.Row>
                        <Form.Row>
                          <Form.Group as={Col} md="3" controlId="_transmitter">
                            <Form.Label>Transmitter:</Form.Label>
                            <Form.Control as="select"
                                          onChange={(event) => handleFormChange(event as any)} disabled>
                                    <option>-- No Transmitter --</option>
                            </Form.Control>
                          </Form.Group>
                          <Form.Group as={Col} md="3" controlId="_txmethod">
                            <Form.Label>Tx Method:</Form.Label>
                            <Form.Control as="select"
                                          onChange={(event) => handleFormChange(event as any)} disabled>
                                    <option>NoMsgSendType</option>
                            </Form.Control>
                          </Form.Group>
                        </Form.Row>
                        <Form.Row>
                          <Form.Group as={Col} md="6" controlId="_cycletime">
                            <Form.Label>Cycle Time:</Form.Label>
                            <Form.Control defaultValue={message.cycletime}
                                          onChange={(event) => handleFormChange(event as any)} disabled>
                            </Form.Control>
                          </Form.Group>
                        </Form.Row>
                      </Form>
                    </Tab>
                    <Tab eventKey="signals" title="Signals">
                        <SelectSignalTable msg={message}  allSignals={allSignals}/>
                    </Tab>
                    <Tab eventKey="transmitters" title="Transmitters">
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
                              <Button variant="primary" onClick={t_handleShow}>
                              View
                              </Button>
                          </Col>
                        </Row>                    
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
                      <Form.Group controlId="textarea1">
                        <Form.Control as="textarea" rows={30} placeholder="Type your message here..." />
                        <Button style={{ marginLeft: "50%"}} variant="primary" type="submit">
                        Submit
                        </Button>
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