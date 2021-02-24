import * as React from 'react';
import * as ReactDOM from "react-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Table, Button,  Modal } from "react-bootstrap";
import {INNProps, ISelItemsState} from "../src/parameters";
import * as CANDB from "../../src/candb_provider";

export class SelectMsgTable extends React.Component <INNProps, ISelItemsState> {
  netwoknode = this.props.netwoknode;
  msg = this.props.netwoknode;
  listOfMsg = this.props.allMessages;
  listOfSignal = this.props.allSignals;
  connectionMsg = this.props.connectionMsg;
  connectionSignal = this.props.connectionSignal;

  constructor(props : INNProps) {
    super(props);
    this.state = {selectItem:  this.initSelectMsgs(),
                  show: false };
    this.handleClose = this.handleClose.bind(this);
    this.handleShow = this.handleShow.bind(this);
  }

  initSelectMsgs() {
    let rows: CANDB.MessageForm[] = [];
    for (let msgItem of this.listOfMsg) {
      if (msgItem.transmitters.findIndex((nn:CANDB.NetworkNodesForm) => nn.uid === this.netwoknode.uid) >= 0) {
        rows.push(msgItem);
      }
    }
    return rows;
  }
  
  // updateValue = this.props.updateValue;
  handleClose () { this.setState({ show: false } );}
  handleShow ()  { this.setState({ show: true }); }

  handleSelectSignal (selectItem: any) {
    if (! this.state.selectItem.includes(selectItem)) {
      const rows = [...this.state.selectItem, selectItem];
      this.setState({ selectItem: rows}, () => {
        for (let i=0 ; i<this.props.allMessages.length ; i++) {
          if (rows.findIndex((r: CANDB.MessageForm) => r.uid === this.props.allMessages[i].uid) >=0 &&
            (this.props.allMessages[i].transmitters.findIndex((item: CANDB.NetworkNodesForm) => item.uid === this.netwoknode.uid) < 0)) {
              this.props.allMessages[i].transmitters.push(this.netwoknode);
          }
        }
      }); 
    } 
  };

  handleRemoveSpecificRow = (idx: number) => () => {
    const rows = [...this.state.selectItem];
    const delItem = rows[idx];
    rows.splice(idx, 1);
    this.setState({ selectItem: rows }, () =>{
      for (let i=0; i<this.props.allMessages.length; i++) {
        if (delItem.uid === this.props.allMessages[i].uid){
          this.props.allMessages[i].transmitters = this.props.allMessages[i].transmitters.filter((item: CANDB.NetworkNodesForm) => item.uid !== this.netwoknode.uid);
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