import * as React from 'react';
import * as ReactDOM from "react-dom";
import {ISignalProps, ISelItemsState} from "../src/parameters";
import {SignalForm, MessageForm} from "../../src/candb_provider";
import 'bootstrap/dist/css/bootstrap.min.css';
import {  Row, Col, Tabs, Tab, Table, Form, Button,  Modal } from "react-bootstrap";

export class SelectMsgTable extends React.Component <ISignalProps, ISelItemsState> {
    constructor(props : ISignalProps) {
      super(props);
      this.state = {selectItem:  this.initSelectMsgs(),
                    show: false };
      this.handleClose = this.handleClose.bind(this);
      this.handleShow = this.handleShow.bind(this);
    }
    initSelectMsgs() {
      let rows: MessageForm[] = [];
      for (let item of this.props.allMessages) {
        if (this.props.signal.msgUids.includes(item.uid)) {
          rows.push(item); 
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
          this.state.selectItem.forEach(item =>  this.props.signal.msgUids.push(item.uid));
          this.props.signal.msgUids = this.props.signal.msgUids.filter(function(elem, index, self) {
            return index === self.indexOf(elem);
          });
          this.updateValue( this.props.signal);

        }); 
      } 
    };
  
    handleRemoveSpecificRow = (idx: number) => () => {
      const rows = [...this.state.selectItem];
      const delItem = rows[idx];
      rows.splice(idx, 1);
      this.setState({ selectItem: rows }, () =>{
        this.props.signal.msgUids = this.props.signal.msgUids.filter(uid=> uid !== delItem.uid);
        this.updateValue( this.props.signal);
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
                                  this.props.allMessages.map((item, idx) => {
                                    if (! this.state.selectItem.includes(item)) {
                                      return (
                                        <tr>
                                          <td>{item.name}</td>
                                          <td>{item.id}</td>
                                          <td>{item.msgType}</td>
                                          <td>{item.dlc}</td>
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