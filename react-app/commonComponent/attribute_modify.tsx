import * as React from 'react';
import * as ReactDOM from "react-dom";
import * as CANDB from "../../src/candb_provider";
import { IAttrProps, IAttributeState} from "../src/parameters";
import 'bootstrap/dist/css/bootstrap.min.css';

import { SignalInMsg } from '../src/parameters';
import {  Row, Col, Tabs, Tab, Table, Form, Button,  Modal } from "react-bootstrap";


export class ModifyAttribute extends React.Component<IAttrProps, IAttributeState> {
  item = this.props.item;
  attributes = this.props.attributes;


  constructor(props: IAttrProps) {
    super(props);
    this.state = {
      attriValues: this.initAttribute(),
      show: false };
    }

    initAttribute() {
      let rows: CANDB.DBCAttribute[] = [];
      this.attributes.map(attr => {

        attr.values.map(v => {
          if (v.signal_name) {
            if (v.signal_name === this.item.name) {
              switch (attr.type) {
                case "String":
                  attr.defaultValue = v.value
                  break;
                case "Enumeration":
                  attr.defaultValue = attr.typeWithValue[v.value]
                  break;
                case "Integer":
                  attr.defaultValue = v.value
                  break;
                case "Hex":
                  attr.defaultValue = v.value
                  break;
                case "Float":
                  attr.defaultValue = v.value
                  break;
              }
            }
          }
          else if (v.node_name) {
            if (v.node_name === this.item.name) {
              switch (attr.type) {
                case "String":
                  attr.defaultValue = v.value
                  break;
                case "Enumeration":
                  attr.defaultValue = v.typeWithValue[v.value]
                  break;
                case "Integer":
                  attr.defaultValue = v.value
                  break;
                case "Hex":
                  attr.defaultValue = v.value
                  break;
                case "Float":
                  attr.defaultValue = v.value
                  break;
              }
            }
          }
          else {
            let messageId = "0x" + v.message_id.toString(16);
            if (messageId === this.item.uid) {
              switch (attr.type) {
                case "String":
                  attr.defaultValue = v.value
                  break;
                case "Enumeration":
                  attr.defaultValue = v.typeWithValue[v.value]
                  break;
                case "Integer":
                  attr.defaultValue = v.value
                  break;
                case "Hex":
                  attr.defaultValue = v.value
                  break;
                case "Float":
                  attr.defaultValue = v.value
                  break;
              }
            }
          }
        })
        rows.push(attr);
      })

      return rows;
    }

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
                      this.state.attriValues.map(attr => {
                        return (
                          <tr>
                            <td>{attr.name}</td>
                            <td>{attr.defaultValue}</td>
                          </tr>
                        )
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