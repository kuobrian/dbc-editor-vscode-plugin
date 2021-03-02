import * as React from 'react';
import * as ReactDOM from "react-dom";
import * as CANDB from "../../src/candb_provider";

import {IMsgProps, ISelItemsState} from "../src/parameters";
import 'bootstrap/dist/css/bootstrap.min.css';

import { SignalInMsg } from '../src/parameters';
import {  Table, Form, Button,  Modal } from "react-bootstrap";


export class SelectSignalTable extends React.Component <IMsgProps , ISelItemsState> {
  message = this.props.msg;
  listOfSignal = this.props.listOfSignal;
  connectionMsg = this.props.connection;

  constructor(props: IMsgProps) {
      super(props);
      this.state = {selectItem: this.initSelectSignals(),
                    show: false };
      this.handleClose = this.handleClose.bind(this);
      this.handleShow = this.handleShow.bind(this);
    }

    initSelectSignals() {
      let rows: CANDB.SignalForm[] = [];
      for (let signalItem of this.listOfSignal) {
        this.connectionMsg.connection.map((item: { id: string; startbit: number; multiplexortype: string;}) => {
          if (item.id === signalItem.uid)  {
            rows.push(signalItem); 
          }});
        }
        return rows;
    }

    handleClose () { this.setState({ show: false } );}
    handleShow ()  { this.setState({ show: true }); }
    
    handleSelectSignal (selectItem: any) {
      if (! this.state.selectItem.includes(selectItem)) {
        const rows = [...this.state.selectItem, selectItem];
        
        this.setState({ selectItem: rows}, () => {
          this.state.selectItem.forEach((signalItem: { uid: any; }) =>  {
            this.connectionMsg.connection.push({id: signalItem.uid,
                                              startbit: 0,
                                              multiplexortype: "Signal"
            });
          });
          this.connectionMsg.connection = this.connectionMsg.connection.reduce((unique: any[], o: { id: string; }) => {
                                            if(!unique.some((obj: { id: string; }) => obj.id === o.id)) {
                                              unique.push(o);
                                            }
                                            return unique;
                                          },[]);
        }); 
      } 
    };

    handleChange (signal: any, event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>){
      const category = event.target.id.split("_")[1];
      let matchIdx = this.connectionMsg.connection.findIndex((element: { id: string; }) => element.id === signal.uid);
      if (category === "startbit"){
        this.connectionMsg.connection[matchIdx].startbit = Number(event.target.value);
      }
      else if(category === "multiplexortype"){
        this.connectionMsg.connection[matchIdx].multiplexortype = event.target.value;
      }
    }

    handleRemoveSpecificSignal = (idx: number) => () => {
      const rows = [...this.state.selectItem];
      const delItem = rows[idx];
      rows.splice(idx, 1);
      this.setState({ selectItem: rows }, () =>{
        this.connectionMsg.connection = this.connectionMsg.connection.filter((item: any)=> item.id !== delItem.uid);
        
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
                      <th>Startbit(Bit)</th>
                      <th>Multiplexortype</th>
                      <th>Remove</th>
                    </tr>
                  </thead>
                  <tbody>
                      { 
                        this.state.selectItem.map((item, idx) => {
                        let matchIdx = this.connectionMsg.connection.findIndex((element: { id: string; }) => element.id === item.uid);
                        let startbit = (matchIdx=== -1) ? 0 : this.connectionMsg.connection[matchIdx].startbit;
                        let multiplexortype = (matchIdx=== -1) ? "Signal" : this.connectionMsg.connection[matchIdx].multiplexortype;
                        return (
                          <tr>
                            <td>{item.name} </td>
                            <td>{this.props.msg.name}</td>
                            <td>{'-'}</td>
                            <td>{idx*8}</td>
                            <td>{item.bitlength}</td>
                            <td>{item.byteorder}</td>
                            <td>{item.valuetype}</td>
                            <td>
                              <Form.Group controlId="_startbit">
                                <Form.Control as="select"
                                            type="number"
                                            defaultValue={startbit} 
                                            onChange={(e) => this.handleChange(item, e)}>
                                  {(() => {
                                          let opts = [];
                                          for (let i = 0; i <= this.message.dlc*8; i++) {
                                            opts.push(<option>{i}</option>);  
                                          }
                                          return opts;
                                  })()}
                                </Form.Control>
                              </Form.Group>  
                            </td>
                            <td>
                              <Form.Group controlId="_multiplexortype">
                                <Form.Control as="select"
                                              defaultValue={multiplexortype} 
                                              onChange={(e) => this.handleChange(item, e)}>
                                  <option>{"Signal"}</option>
                                  <option>{"Mutiplexor Signal"}</option>
                                  <option>{"Mutiplexed Signal"}</option>
                                </Form.Control>
                              </Form.Group>                            
                            </td>
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
                                  this.listOfSignal.map((signalItem: CANDB.SignalForm, idx: any) => {
                                    if (! this.state.selectItem.includes(signalItem)) {
                                      return (
                                        <tr>
                                          <td>{signalItem.name} {this.state.selectItem.includes(signalItem)}</td> 
                                          <td>{signalItem.bitlength}</td>
                                          <td>{signalItem.byteorder}</td>
                                          <td>{signalItem.valuetype}</td>
                                          <td>
                                            <Button variant="primary" onClick={() => this.handleSelectSignal(signalItem)}>
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