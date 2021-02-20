import * as React from 'react';
import * as ReactDOM from "react-dom";
import {IMsgProps, ITransmittersTableState} from "../src/parameters";
import 'bootstrap/dist/css/bootstrap.min.css';
import {  Row, Col, Tabs, Tab, Table, Form, Button,  Modal } from "react-bootstrap";
import {SignalForm, MessageForm, NetworkNodesForm} from "../../src/candb_provider";


export class SelectTransmittersTable extends React.Component <IMsgProps, ITransmittersTableState> {
  msg = this.props.msg;
  listOfSignal = this.props.listOfSignal;
  listOfNetworknode = this.props.listOfNetworknode;
  storeSignals = this.props.connection;
  msgConnect = this.props.connection;

  isPreview = this.props.isPreview;
  constructor(props: IMsgProps) {
    super(props);
    this.state = {selectTransmitters: this.initSelectTransmitters(),
                  show: false };
    this.handleClose = this.handleClose.bind(this);
    this.handleShow = this.handleShow.bind(this);
  }

  initSelectTransmitters() {
    let rows: NetworkNodesForm[] = [];
    for (let nnItem of this.listOfNetworknode) {
      if (this.msg.transmitters.find((nnInMsg:NetworkNodesForm) => nnInMsg.uid === nnItem.uid)) {
        rows.push(nnItem); 
      }
    }
    return rows;
  }
  updateValue = this.props.updateValue;
  handleClose () { this.setState({ show: false } );}
  handleShow ()  { this.setState({ show: true }); }

  handleSelectNN (selectItem: NetworkNodesForm) {
    if (! this.state.selectTransmitters.includes(selectItem)) {
      const rows = [...this.state.selectTransmitters, selectItem];


      this.setState({ selectTransmitters: rows}, () => {
        this.state.selectTransmitters.forEach((nnItem: NetworkNodesForm) =>  {
          if(this.msg.transmitters.findIndex(nnInMsg=> nnInMsg.uid === nnItem.uid) < 0){
            this.msg.transmitters.push(nnItem);
          }
        });
        if (this.props.updateValue) {
          this.props.updateValue(this.msg, this.storeSignals);
        }
      }); 
    } 
  };


  handleRemoveSpecificRow = (idx: number) => () => {
    const rows = [...this.state.selectTransmitters];
    const delItem = rows[idx];
    rows.splice(idx, 1);
    this.setState({ selectTransmitters: rows }, () => {
      this.msg.transmitters = this.msg.transmitters.filter((nn:NetworkNodesForm) => nn.uid !== delItem.uid);
      if (this.props.updateValue) {
        this.props.updateValue(this.msg, this.storeSignals);
      }

    });
  };




  render() {
    return (
      <div>
        <div className="container">
          <div className="row clearfix">
            <div className="col-md-12 column">
              <Table  striped bordered hover variant="dark">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Address</th>
                    <th>Remove</th>
                  </tr>
                </thead>
                <tbody>
                    { this.state.selectTransmitters.map((item, idx) => {
                      return (
                        <tr>
                          <td>{item.name}</td>
                          <td>{item.address}</td>
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
                    <Table  striped bordered hover variant="dark">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Address</th>
                            </tr>
                        </thead>
                        <tbody>
                              { 
                                this.listOfNetworknode.map((nnItem, idx) => {
                                  if (! this.state.selectTransmitters.includes(nnItem)) {
                                    return (
                                      <tr>
                                        <td>{nnItem.name}</td> 
                                        <td>{nnItem.address}</td>
                                        <td>
                                          <Button variant="primary" onClick={() => this.handleSelectNN(nnItem)}>
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
  
  