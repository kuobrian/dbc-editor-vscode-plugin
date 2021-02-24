import * as React from 'react';
import * as ReactDOM from "react-dom";
import {ISignalProps, ISelItemsState} from "../src/parameters";
import {SignalForm, MessageForm} from "../../src/candb_provider";
import 'bootstrap/dist/css/bootstrap.min.css';
import {  Row, Col, Tabs, Tab, Table, Form, Button,  Modal } from "react-bootstrap";
import { type } from 'os';

export class SelectMsgTable extends React.Component <ISignalProps, ISelItemsState> {
  signal = this.props.signal;
  listOfMsg = this.props.listOfMsg;
  connectionSignal = this.props.connection;
  isPreview = this.props.isPreview;

  constructor(props : ISignalProps) {
    super(props);
    this.state = {selectItem:  this.initSelectMsgs(),
                  show: false };
    this.handleClose = this.handleClose.bind(this);
    this.handleShow = this.handleShow.bind(this);
    
  }

  initSelectMsgs() {
    let rows: MessageForm[] = [];
    for (let msgItem of this.listOfMsg) {
      if (this.connectionSignal.connection.includes(msgItem.uid)) {
        rows.push(msgItem); 
      }
    }
    return rows;
  }

  handleClose () { this.setState({ show: false } );}
  handleShow ()  { this.setState({ show: true }); }

  handleSelectSignal (selectItem: any) {
    if (! this.state.selectItem.includes(selectItem)) {
      const rows = [...this.state.selectItem, selectItem];
      this.setState({ selectItem: rows}, () => {
        this.state.selectItem.forEach(msgItem =>  {
          this.connectionSignal.connection.push(msgItem.uid);
        });
        this.connectionSignal.connection = this.connectionSignal.connection.filter(function(elem: any, index: any, self: string | any[]) {
          return index === self.indexOf(elem);
        });
        if (this.props.updateValue) {
          this.props.updateValue(this.signal, this.connectionSignal);
        }

      }); 
    } 
  };

  handleRemoveSpecificRow = (idx: number) => () => {
    const rows = [...this.state.selectItem];
    const delItem = rows[idx];
    rows.splice(idx, 1);
    this.setState({ selectItem: rows }, () =>{
      this.connectionSignal.connection = this.connectionSignal.connection.filter((uid: any)=> uid !== delItem.uid);
      if (this.props.updateValue) {
        this.props.updateValue(this.signal, this.connectionSignal);
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
                    <th>Name</th>
                    <th>ID</th>
                    <th>ID-Format</th>
                    <th>DLC (Byte)</th>
                    <th>Remove</th>
                  </tr>
                </thead>
                <tbody>
                    { this.state.selectItem.map((item, idx) => {
                      return (
                        <tr>
                          <td>{item.name}</td>
                          <td>{item.id}</td>
                          <td>{item.msgType}</td>
                          <td>{item.dlc}</td>
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
                                <th>ID</th>
                                <th>ID-Format</th>
                                <th>DLC (Byte)</th>
                            </tr>
                        </thead>
                        <tbody>
                              { 
                                this.listOfMsg.map((msgItem, idx) => {
                                  if (! this.state.selectItem.includes(msgItem)) {
                                    return (
                                      <tr>
                                        <td>{msgItem.name}</td>
                                        <td>{msgItem.id}</td>
                                        <td>{msgItem.msgType}</td>
                                        <td>{msgItem.dlc}</td>
                                        <td>
                                          <Button variant="primary" onClick={() => this.handleSelectSignal(msgItem)}>
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