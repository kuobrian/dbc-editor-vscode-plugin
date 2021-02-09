import * as React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {  Row, Col, Tabs, Tab, Table, Form, Button,  Modal } from "react-bootstrap";
import {ISignalProps, ISelItemsState} from "../src/parameters";
import {SignalForm, MessageForm} from "../../src/candb_provider";

export class SignalDefinition extends React.Component <ISignalProps, ISelItemsState> {
    messages: MessageForm[];
    isPreview: boolean;
    signal: SignalForm;

    constructor(props : ISignalProps) {
      super(props);
      this.messages = this.props.allMessages;
      this.isPreview = this.props.isPreview;
      this.signal = this.props.signal;
    }

    handleFormChange (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) {
      const msgKey = e.target.id.split("_")[1];
      this.signal[msgKey]= e.target.value;
    };

    render() {
      return (
        <Form >
          {
            this.messages.map((msg: MessageForm) => {
              if (msg.signalUids.includes(this.props.signal.uid) && this.isPreview) {
                return ( <Form.Row>
                          <Form.Group as={Col} md="3" controlId="_name">
                            <Form.Label>Message Name:</Form.Label>
                            <Form.Control required
                                          type="text"
                                          defaultValue={msg.name}
                                          disabled>
                            </Form.Control>
                          </Form.Group>
                        </Form.Row>
                );
              }
            })
          }
          <Form.Row>
            <Form.Group as={Col} md="3" controlId="_name">
              {(this.isPreview) ? <Form.Label>Signal Name:</Form.Label> : <Form.Label>name :</Form.Label>}
              <Form.Control required
                            type="text"
                            defaultValue={this.signal.name}
                            disabled={this.isPreview}
                            onChange={(event) =>  this.handleFormChange(event as any)}>
              </Form.Control>
            </Form.Group>
          </Form.Row>
          {(() => {
            if (! this.isPreview){
                return(
                    <>
                      <Form.Row>
                        <Form.Group as={Col} md="3" controlId="_bitlength">
                          <Form.Label>Length (Bit):</Form.Label>
                          <Form.Control type="Length"
                                        defaultValue={this.signal["bitlength"]}
                                        onChange={(event) => this.handleFormChange(event as any)}>
                          </Form.Control>
                        </Form.Group>
                      </Form.Row>
                      <Form.Row>
                        <Form.Group as={Col} md="3" controlId="_byteorder">
                          <Form.Label>Byte Order:</Form.Label>
                          <Form.Control as="select" 
                                        defaultValue={this.signal.byteorder} 
                                        onChange={(event) => this.handleFormChange(event as any)}>
                                <option>Intel</option>
                                <option>Motorola</option>
                          </Form.Control>
                        </Form.Group>
                        <Form.Group as={Col} md="3" controlId="_unit">
                          <Form.Label>Unit:</Form.Label>
                          <Form.Control type="Length"
                                        defaultValue={this.signal.unit}
                                        onChange={(event) =>  this.handleFormChange(event as any)}>
                          </Form.Control>
                        </Form.Group>
                      </Form.Row>
                      <Form.Row>
                        <Form.Group as={Col} md="3" controlId="_valuetype">
                          <Form.Label>Value Type:</Form.Label>
                          <Form.Control as="select"
                                        defaultValue={this.signal.valuetype}
                                        onChange={(event) =>  this.handleFormChange(event as any)}>
                                  <option>Signed</option>
                                  <option>Unsigned</option>
                                  <option>IEEE Float</option>
                                  <option>IEEE Double</option>
                          </Form.Control>
                        </Form.Group>
                        <Form.Group as={Col} md="3" controlId="_initValue">
                          <Form.Label>Init Value:</Form.Label>
                          <Form.Control type="Length" 
                                        defaultValue={this.signal.initValue}
                                        onChange={(event) =>  this.handleFormChange(event as any)}>
                          </Form.Control>
                        </Form.Group>
                      </Form.Row>
                      <Form.Row>
                        <Form.Group as={Col} md="3" controlId="_factor">
                          <Form.Label>Factor:</Form.Label>
                          <Form.Control type="Length" 
                                        defaultValue={this.signal.factor}
                                        onChange={(event) =>  this.handleFormChange(event as any)}>
                          </Form.Control>
                        </Form.Group>
                        <Form.Group as={Col} md="3" controlId="_offset">
                          <Form.Label>Offset:</Form.Label>
                          <Form.Control type="Length" 
                                        defaultValue={this.signal.offset}
                                        onChange={(event) =>  this.handleFormChange(event as any)}>
                          </Form.Control>
                        </Form.Group>
                      </Form.Row>
                      <Form.Row>
                        <Form.Group as={Col} md="3" controlId="_minimun">
                          <Form.Label>Minimun:</Form.Label>
                          <Form.Control type="Length"
                                        defaultValue={this.signal.minimun}
                                        onChange={(event) =>  this.handleFormChange(event as any)}>
                          </Form.Control>
                        </Form.Group>
                        <Form.Group as={Col} md="3" controlId="_maximum">
                          <Form.Label>Maximum:</Form.Label>
                          <Form.Control type="Length"
                                        defaultValue={this.signal.maximum}
                                        onChange={(event) =>  this.handleFormChange(event as any)}>
                          </Form.Control>
                        </Form.Group>
                      </Form.Row>
                      <Form.Row>
                        <Form.Group as={Col} md="6" controlId="validationCustom03">
                          <Button variant="primary" size="sm" block>Calculate minimum and maximum</Button>
                        </Form.Group>
                      </Form.Row>
                      <Form.Row>
                        <Form.Group as={Col} md="6" controlId="validationCustom03">
                          <Form.Label>Value Table:</Form.Label>
                          <Form.Control as="select" 
                                        defaultValue={this.signal.valuetable}
                                        onChange={(event) =>  this.handleFormChange(event as any)}>
                            <option>None</option>
                          </Form.Control>
                        </Form.Group>
                      </Form.Row>
                    </>);
            } else {
              return(
                <>
                  <Form.Row>
                    <Form.Group as={Col} md="3" controlId="_startbit">
                      <Form.Label>Startbit (Bit):</Form.Label>
                      <Form.Control required
                                    type="text"
                                    defaultValue={0}>
                      </Form.Control>
                    </Form.Group>
                  </Form.Row>
                  <Form.Row>
                    <Form.Group as={Col} md="3" controlId="_startbit">
                      <Form.Label>Startbit (Bit):</Form.Label>
                      <Form.Control as="select">
                          <option>Signal</option>
                          <option>Multiplexor Signal</option>
                          <option>Multiplexed Signal</option>
                      </Form.Control>
                    </Form.Group>
                  </Form.Row>
                </>);
            }
          })()
        }
        </Form>
      );
    }
  }