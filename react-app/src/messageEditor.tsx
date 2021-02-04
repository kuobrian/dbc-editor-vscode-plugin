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


class DynamicTable extends React.Component {
  
  state = { rows: [{}] };

  handleChange = idx => e => {
    const { name, value } = e.target;
    const rows = [...this.state.rows];
    rows[idx] = { [name]: value };
    this.setState({  rows });
  };
  handleAddRow = () => {
    const item = {
      name: "",
      mobile: ""
    };
    this.setState({
      rows: [...this.state.rows, item]
    });
  };
  handleRemoveRow = () => {
    this.setState({
      rows: this.state.rows.slice(0, -1)
    });
  };

  handleRemoveSpecificRow = (idx) => () => {
    const rows = [...this.state.rows];
    rows.splice(idx, 1);
    this.setState({ rows });
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
                    <th>Name</th>
                    <th>ID</th>
                    <th>ID-Format</th>
                    <th>DLC [Byte]</th>
                    <th>Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.rows.map((item, idx) => (
                    <tr id="addr0" key={idx}>
                      <td>{idx}</td>
                      <td>
                        <input type="text"
                                name="name"
                                value={this.state.rows[idx].name}
                                onChange={this.handleChange(idx)}
                                className="form-control"
                        />
                      </td>
                      <td>
                        <input type="text"
                              name="mobile"
                              value={this.state.rows[idx].mobile}
                              onChange={this.handleChange(idx)}
                              className="form-control" />
                      </td>
                      <td>{idx}</td>
                      <td>
                        <button className="btn btn-outline-danger btn-sm"
                                onClick={this.handleRemoveSpecificRow(idx)} >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table >
              <button onClick={this.handleAddRow} className="btn btn-primary">
              Add Row
              </button>
              <button  onClick={this.handleRemoveRow} className="btn btn-danger float-right" >
              Delete Last Row
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}




window.addEventListener('message', (event) =>{
    let vscode = window.acquireVsCodeApi();
    const message = event.data;

    const signalUid = message.uid;
    console.log('candbEditor  Webview接收到的消息：',
                message.name, message.bitlength, message.byteorder, message.uid);

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
        copyMsg = JSON.parse(JSON.stringify(message));
        
        
        const handleFormChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>): void => {
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

        const state = {
          rows: [{}]
        };
        const handleChange = idx => e => {
          const { name, value } = e.target;
          const rows = [...state.rows];
          rows[idx] = {  [name]: value };
          // setState({ rows });
        };
        const handleAddRow = () => {
          const item = {
            name: "",
            mobile: ""
          };
          // this.setState({  rows: [...this.state.rows, item] });
        };
        const handleRemoveRow = () => {
          // this.setState({ rows: this.state.rows.slice(0, -1) });
        };
        const handleRemoveSpecificRow = (idx) => () => {
          const rows = [...state.rows];
          rows.splice(idx, 1);
          // this.setState({ rows })
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
                                          defaultValue={message.name}
                                          onChange={(event) => handleFormChange(event as any)}>
                            </Form.Control>
                          </Form.Group>
                        </Form.Row>
                        <Form.Row>
                          <Form.Group as={Col} md="3" controlId="_bitlength">
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
                          <Form.Group as={Col} md="3" controlId="_byteorder">
                            <Form.Label>ID:</Form.Label>
                            <Form.Control defaultValue={message.id} 
                                          onChange={(event) => handleFormChange(event as any)}>
                            </Form.Control>
                          </Form.Group>
                          <Form.Group as={Col} md="2" controlId="_unit">
                            <Form.Label>DLC:</Form.Label>
                            <Form.Control type='number'
                                          min='1' max='8' step='1'
                                          defaultValue={message.dlc}
                                          onChange={(event) => handleFormChange(event as any)}>
                            </Form.Control>
                          </Form.Group>
                        </Form.Row>
                        <Form.Row>
                          <Form.Group as={Col} md="3" controlId="_valuetype">
                            <Form.Label>Transmitter:</Form.Label>
                            <Form.Control as="select"
                                          onChange={(event) => handleFormChange(event as any)} disabled>
                                    <option>-- No Transmitter --</option>
                            </Form.Control>
                          </Form.Group>
                          <Form.Group as={Col} md="3" controlId="_valuetype">
                            <Form.Label>Tx Method:</Form.Label>
                            <Form.Control as="select"
                                          onChange={(event) => handleFormChange(event as any)} disabled>
                                    <option>NoMsgSendType</option>
                            </Form.Control>
                          </Form.Group>
                        </Form.Row>
                        <Form.Row>
                          <Form.Group as={Col} md="6" controlId="validationCustom03">
                            <Form.Label>Cycle Time:</Form.Label>
                            <Form.Control defaultValue={message.cycletime}
                                          onChange={(event) => handleFormChange(event as any)} disabled>
                            </Form.Control>
                          </Form.Group>
                        </Form.Row>
                      </Form>
                    </Tab>
                    <Tab eventKey="signals" title="Signals">
                        <DynamicTable/>
                        <Row>
                          <Col>
                              <Button variant="primary" onClick={handleShow}>
                              Add ...
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
                              <Button variant="primary" onClick={handleShow}>
                              Remove
                              </Button>
                          </Col>
                          <Col>
                              <Button variant="primary" onClick={handleShow}>
                              View
                              </Button>
                          </Col>
                        </Row>
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
                              <Button variant="primary" onClick={handleShow}>
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