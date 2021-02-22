import * as React from 'react';
import * as ReactDOM from "react-dom";
import {SignalForm, MessageForm} from "../../src/candb_provider";
import {INNProps, ISelItemsState} from "../src/parameters";
import 'bootstrap/dist/css/bootstrap.min.css';
import {  Row, Col, Tabs, Tab, Table, Form, Button,  Modal } from "react-bootstrap";

export class SelectSignalTable extends React.Component <INNProps , ISelItemsState> {
  
  constructor(props: INNProps) {
      super(props);
      
      this.state = {selectItem: this.initSelectSignals(),
                    show: false };
      this.handleClose = this.handleClose.bind(this);
      this.handleShow = this.handleShow.bind(this);
    }

    initSelectSignals() {
      let rows: SignalForm[] = [];
      if (this.props.allSignals !== undefined) {
        for (let item of this.props.allSignals) {
          if (this.props.netwoknode.signalUids.includes(item.uid)) {
            rows.push(item); 
          }
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
          this.state.selectItem.forEach(item =>  this.props.netwoknode.signalUids.push(item.uid));
          this.props.netwoknode.signalUids = this.props.netwoknode.signalUids.filter(function(elem: any, index: any, self: string | any[]) {
            return index === self.indexOf(elem);
          });
          // this.updateValue( this.props.netwoknode);
        }); 
      } 
    };
  
    handleRemoveSpecificSignal = (idx: number) => () => {
      const rows = [...this.state.selectItem];
      const delItem = rows[idx];
      rows.splice(idx, 1);
      this.setState({ selectItem: rows }, () =>{
        this.props.netwoknode.signalUids = this.props.netwoknode.signalUids.filter((uid: any)=> uid !== delItem.uid);
        // this.updateValue( this.props.netwoknode);
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
                            <td>{item.name}</td>
                            <td>{this.props.netwoknode.name}</td>
                            <td>{'-'}</td>
                            <td>{idx*8}</td>
                            <td>{item.bitlength}</td>
                            <td>{item.byteorder}</td>
                            <td>{item.valuetype}</td>
                            <td>
                              <Button variant="danger" onClick={this.handleRemoveSpecificSignal(idx)} >
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
                                  this.props.allSignals.map((item: SignalForm, idx: any) => {
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