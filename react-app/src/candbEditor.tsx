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


export interface HelloProps { compiler: string; framework: string; }

window.addEventListener('message', (event) =>{
    const message = event.data;
    console.log('candbEditor  Webview接收到的消息：', message);



    const App = () =>  {
        const [show, setShow] = React.useState(false);
      
        const handleClose = () => setShow(false);
        const handleShow = () => setShow(true);

        let formGroupStyle: React.CSSProperties = {
          padding: 30
        };
        const styles = {
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
        return (
                <>
                <Tabs defaultActiveKey="messages" id="uncontrolled-tab-example">
                    <Tab eventKey="definition" title="Definition">
                      <Container fluid  style={styles.row}>
                        <Row >
                            <Form inline>
                                <Col style={styles.col}> <Form.Label style={formGroupStyle}>Name:</Form.Label> </Col>
                                <Col > <Form.Control type="name" placeholder="Enter signal name" />  </Col>
                            </Form>
                        </Row>
                        <Row >
                          <Form inline>
                              <Col style={styles.col}> <Form.Label style={formGroupStyle}>Length:</Form.Label> </Col>
                              <Col> <Form.Control type="Length" placeholder="8" />  </Col>
                          </Form>
                        </Row>
                        <Row >
                          <Form inline>
                              <Col style={styles.col}> <Form.Label style={formGroupStyle}>Byte Order:</Form.Label> </Col>
                              <Col > 
                                <Form.Control as="select">
                                  <option>Intel</option>
                                  <option>Motorola</option>
                                </Form.Control>
                              </Col>
                              <Col style={styles.col}> <Form.Label style={formGroupStyle}>Unit:</Form.Label> </Col>
                              <Col > <Form.Control type="Length"  />  </Col>
                          </Form>
                        </Row>
                        <Row >
                          <Form inline>
                              <Col style={styles.col}> <Form.Label style={formGroupStyle}>Value Type:</Form.Label> </Col>
                              <Col > 
                                  <Form.Control as="select">
                                    <option>Signed</option>
                                    <option>Unsigned</option>
                                    <option>IEEE Float</option>
                                    <option>IEEE Double</option>
                                  </Form.Control>
                              </Col>
                              <Col style={styles.col}> <Form.Label style={formGroupStyle}>Init Value:</Form.Label> </Col>
                              <Col > <Form.Control type="Length"  />  </Col>
                          </Form>
                        </Row>
                        <Row >
                          <Form inline>
                              <Col style={styles.col}> <Form.Label style={formGroupStyle}>Factor:</Form.Label> </Col>
                              <Col > <Form.Control type="Length"  />  </Col>
                              <Col style={styles.col}> <Form.Label style={formGroupStyle}>Offset:</Form.Label> </Col>
                              <Col > <Form.Control type="Length"  />  </Col>
                          </Form>
                        </Row>
                        <Row >
                          <Form inline>
                              <Col style={styles.col}> <Form.Label style={formGroupStyle}>Minimun:</Form.Label> </Col>
                              <Col > <Form.Control type="Length"  />  </Col>
                              <Col style={styles.col}> <Form.Label style={formGroupStyle}>Maximum:</Form.Label> </Col>
                              <Col > <Form.Control type="Length"  />  </Col>
                              <Col style={{ paddingLeft: 20 }}>
                              
                              </Col>
                          </Form>
                        </Row>
                        <Row>
                          <Col md={{ span: 3 , offset: 1}} style={{paddingLeft: 10}}>
                            <Button variant="primary" size="lg" block>Calculate minimum and maximum</Button>
                          </Col>
                        </Row>
                        <Row >
                            <Form inline>
                                <Col style={styles.col}><Form.Label style={formGroupStyle}>Value Table:</Form.Label> </Col>
                                <Col > 
                                  <Form.Control as="select">
                                    <option>None</option>
                                  </Form.Control>
                                </Col>
                            </Form>
                        </Row>
                      </Container>
                    </Tab>
                    <Tab eventKey="messages" title="Messages">
                        <Table striped bordered hover variant="dark">
                            <thead>
                              <tr>
                                  <th>Name</th>
                                  <th>ID</th>
                                  <th>ID-Format</th>
                                  <th>DLC [Byte]</th>
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
                              <tr>
                                <td>3</td>
                                <td colSpan={2}>Larry the Bird</td>
                                <td>@twitter</td>
                              </tr>
                            </tbody>
                        </Table>
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
                      <Form.Group controlId="textarea1">
                        <Form.Control as="textarea" rows={30} placeholder="Type your message here..." />
                        <Button style={{ marginLeft: "50%"}} variant="primary" type="submit">
                        Submit
                        </Button>
                      </Form.Group>
                       
                    </Tab>
                </Tabs>
                </>
            );
        };

    ReactDOM.render(<App />, document.getElementById('root'));
});