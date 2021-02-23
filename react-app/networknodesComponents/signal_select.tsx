import * as React from 'react';
import * as ReactDOM from "react-dom";

import * as CANDB from "../../src/candb_provider";

import {INNProps, ISelItemsState} from "../src/parameters";
import 'bootstrap/dist/css/bootstrap.min.css';
import {  Row, Col, Tabs, Tab, Table, Form, Button,  Modal } from "react-bootstrap";

export class SelectSignalTable extends React.Component <INNProps , ISelItemsState> {
  netwoknode = this.props.netwoknode;
  msg = this.props.netwoknode;
  listOfMsg = this.props.allMessages;
  listOfSignal = this.props.allSignals;
  connectionMsg = this.props.connectionMsg;
  connectionSignal = this.props.connectionSignal;
  
  constructor(props: INNProps) {
      super(props);
      
      this.state = {selectItem: this.initSelectSignals(),
                    show: false };
      this.handleClose = this.handleClose.bind(this);
      this.handleShow = this.handleShow.bind(this);
    }

    initSelectSignals() {
      let rows: CANDB.SignalForm[] = [];
      for (let signalItem of this.listOfSignal) {
        if (signalItem.receivers.findIndex((nn:CANDB.NetworkNodesForm) => nn.uid === this.netwoknode.uid) >= 0) {
          rows.push(signalItem);
        }
      }
        return rows;
    }

    updateValue = this.props.updateValue;
    handleClose () { this.setState({ show: false } );}
    handleShow ()  { this.setState({ show: true }); }

    handleSelectSignal (selectItem: any) {
      if (! this.state.selectItem.includes(selectItem)) {
        const rows = [...this.state.selectItem, selectItem];
        this.setState({ selectItem: rows}, () => {
          for (let i=0; i<this.props.allSignals.length; i++) {
            if (rows.findIndex((r: CANDB.SignalForm) => r.uid === this.props.allSignals[i].uid) >=0 &&
              (this.props.allSignals[i].receivers.findIndex((item: CANDB.NetworkNodesForm) => item.uid === this.netwoknode.uid) < 0)) {
                this.props.allSignals[i].receivers.push(this.netwoknode);
              }
          }
        }); 
      } 
    };
  
    handleRemoveSpecificSignal = (idx: number) => () => {
      const rows = [...this.state.selectItem];
      const delItem = rows[idx];
      rows.splice(idx, 1);
      this.setState({ selectItem: rows }, () =>{
        for (let i=0; i<this.props.allSignals.length; i++) {
          if (delItem.uid === this.props.allSignals[i].uid){
            this.props.allSignals[i].receivers = this.props.allSignals[i].receivers.filter((item: CANDB.NetworkNodesForm) => item.uid !== this.netwoknode.uid)
          }
        }
      }) ;
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
                      { this.state.selectItem.map((item, idx) => {
                        return (
                          <tr>
                            {
                              this.connectionMsg.map((c:CANDB.MsgConnection) => 
                              {
                                let idxConnection = c.connection.findIndex((s:CANDB.SignalInMsg) => s.id === item.uid);
                                if (idxConnection >= 0){
                                  let starbit = c.connection[idxConnection].startbit;
                                  let idxMsg = this.listOfMsg.findIndex((m:CANDB.MessageForm) => m.uid === c.targetId);
                                  let messageName = this.listOfMsg[idxMsg].name;
                                  return  (
                                    <>
                                      <td>{item.name}</td>
                                      <td>{messageName}</td>
                                      <td>{'-'}</td>
                                      <td>{starbit}</td>
                                      <td>{item.bitlength}</td>
                                      <td>{item.byteorder}</td>
                                      <td>{item.valuetype}</td>
                                      <td>
                                        <Button variant="danger" onClick={this.handleRemoveSpecificSignal(idx)} >
                                        Remove
                                        </Button>
                                      </td>
                                    </>
                                  );
                                }
                              })
                            }
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
                                  this.props.allSignals.map((item: CANDB.SignalForm, idx: any) => {
                                    if (! this.state.selectItem.includes(item)) {
                                      return (
                                        <tr>
                                          <td>{item.name} {this.state.selectItem.includes(item)}</td> 
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