import * as React from 'react';
import * as ReactDOM from "react-dom";
import {SignalForm, MessageForm, CANdb} from "../../src/candb_provider";
import {IAttrProps, ISelItemsState} from "../src/parameters";
import 'bootstrap/dist/css/bootstrap.min.css';

import { SignalInMsg } from '../src/parameters';
import {  Row, Col, Tabs, Tab, Table, Form, Button,  Modal } from "react-bootstrap";


export class ModifyAttribute extends React.Component <IAttrProps , ISelItemsState> {
  msg = this.props.msg;
  attributes = this.props.attributes;
  listOfSignal = this.props.listOfSignal;
  storeSignals = this.props.connection;


  constructor(props: IAttrProps) {
      super(props);
      this.state = {selectItem: this.initSelectSignals(),
                    show: false };
      this.handleClose = this.handleClose.bind(this);
      this.handleShow = this.handleShow.bind(this);
    }

    initSelectSignals() {
      let rows: SignalForm[] = [];
      for (let signalItem of this.listOfSignal) {
        this.storeSignals.connection.map((item: { id: string; startbit: number; multiplexortype: string;}) => {
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
            this.storeSignals.connection.push({id: signalItem.uid,
                                              startbit: 0,
                                              multiplexortype: "Signal"
            });
          });
          this.storeSignals.connection = this.storeSignals.connection.reduce((unique: any[], o: { id: string; }) => {
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
      let matchIdx = this.storeSignals.connection.findIndex((element: { id: string; }) => element.id === signal.uid);
      if (category === "startbit"){
        this.storeSignals.connection[matchIdx].startbit = Number(event.target.value);
      }
      else if(category === "multiplexortype"){
        this.storeSignals.connection[matchIdx].multiplexortype = event.target.value;
      }
    }

    handleRemoveSpecificSignal = (idx: number) => () => {
      const rows = [...this.state.selectItem];
      const delItem = rows[idx];
      rows.splice(idx, 1);
      this.setState({ selectItem: rows }, () =>{
        this.storeSignals.connection = this.storeSignals.connection.filter((item: any)=> item.id !== delItem.uid);
        
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
                      <th>Attribute</th>
                      <th>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                      {
                        this.attributes.map(attr => {
                          return (
                            <tr>
                              <td> {attr.name} </td>
                              {(() => {
                                let outvalue: any[] = [];
                                if (attr.values.length > 0) {
                                  attr.values.map(v => {
                                    let targetid =  "0x"+ v.message_id.toString(16);
                                    if (targetid === this.msg.id ) {
                                      outvalue.push(<td>{attr.values[0].value}</td>);
                                    }
                                  });
                                }
                                if (outvalue.length > 0) {
                                  return outvalue;
                                } else {
                                  return[ <td>{attr.defaultValue}</td> ];
                                }
                              })()}
                            </tr>
                          );
                        })
                      }  
                  </tbody>
                </Table >
                
                </div>
            </div>
          </div>
        </div>
      );
    }
  }