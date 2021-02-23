import * as React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {  Row, Col, Tabs, Tab, Table, Form, Button,  Modal } from "react-bootstrap";
import {ISignalProps, ISelItemsState} from "../src/parameters";
import {SignalForm, MessageForm} from "../../src/candb_provider";






export class SignalDefinitionEdit extends React.Component <ISignalProps, { [key: string]: number }> {
  signal = this.props.signal;
  listOfMsg = this.props.listOfMsg;
  signalConnect = this.props.connection;
  isPreview = this.props.isPreview;
  
  constructor(props : ISignalProps) {
    super(props);
    this.state = {minimun:  this.signal["minimun"],
                  maximum:  this.signal["maximum"] };
    this.onCalMinMaxBtnClick=this.onCalMinMaxBtnClick.bind(this);
  }
  updateValue = this.props.updateValue;

  handleFormChange (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) {
    const msgKey = e.target.id.split("_")[1];
    this.signal[msgKey]= e.target.value;
  };

  onCalMinMaxBtnClick(){
    this.setState({
      minimun: (0 * this.signal["factor"]) + +this.signal["offset"],
      maximum: ((Math.pow(2, this.signal["bitlength"])-1) *  this.signal["factor"] )+ +this.signal["offset"]
    }, () =>{
      this.signal["minimun"]  = this.state.minimun;
      this.signal["maximum"] = this.state.maximum;
    });
    
  }


  render() {
    return (
      <Form >
        <Form.Row>
          <Form.Group as={Col} md="3" controlId="_name">
            <Form.Label>name :</Form.Label>
            <Form.Control required
                          type="text"
                          defaultValue={this.signal.name}
                          disabled={this.isPreview}
                          onChange={(event) =>  this.handleFormChange(event as any)}>
            </Form.Control>
          </Form.Group>
        </Form.Row>
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
                            value={this.state.minimun}
                            onChange={(event) =>  this.handleFormChange(event as any)}>
              </Form.Control>
            </Form.Group>
            <Form.Group as={Col} md="3" controlId="_maximum">
              <Form.Label>Maximum:</Form.Label>
              <Form.Label>{this.state.maximum}</Form.Label>
              <Form.Control type="Length"
                            value={this.state.maximum}
                            onChange={(event) =>  this.handleFormChange(event as any)}>
              </Form.Control>
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col} md="6" controlId="_CalculateMinMax">
              <Button variant="primary"
                      size="sm"
                      block
                      onClick={() => this.onCalMinMaxBtnClick()}>
                  Calculate minimum and maximum
              </Button>
              
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
      </Form>
    );
  }
}