import * as React from 'react';
import * as ReactDOM from "react-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import * as CANDB from "../../src/candb_provider";
import {SelectMsgTable} from "../signalComponents/msg_select";
import {SignalDefinitionEdit} from "../signalComponents/definition";
import { ModifyAttribute } from "../commonComponent/attribute_modify"


import {  Row, Col, Tabs, Tab, Table, Form, Button,  Modal } from "react-bootstrap";

declare global {
    interface Window {
      acquireVsCodeApi(): any;
    }
}

window.addEventListener('message', (event) =>{
  let vscode = window.acquireVsCodeApi();
  let attributes = event.data.attribute;

  console.log("attribute length: ", attributes.typeWithValue)

  const EditorApp = () =>  {
    
    const [attributeState, setChangeAttribute] = React.useState(attributes);
    function handleRemoveSpecificSignal(idx:number): void {
      console.log(attributeState.length, attributes.length)
      const rows = [...attributeState];
      const delItem = rows[idx];
      rows.splice(idx, 1);
      
      setChangeAttribute(rows)
      
    }
    function onSaveBtnClick(): void {
      console.log(attributeState.length, attributes.lenght)
      // vscode.postMessage({
      //   command: 'modifySignalForm',
      //   data: signal,
      //   connect: connectionSignal
      // });
    }

    function onCancelBtnClick(): void {
      console.log(attributeState.length, attributes.lenght)
      // vscode.postMessage({
      //   command: 'cancelSignalForm'
      // });
    }

    return (
        <div>
          <Table striped bordered hover variant="dark"
                className="table table-bordered table-hover"
                id="tab_logic">
            <thead>
              <tr>
                <th>Type Of Object</th>
                <th>Name</th>
                <th>Value Type</th>
                <th>Minimum</th>
                <th>Maximum</th>
                <th>Default</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {
                attributeState.map((attr: any, idx: number) => {
                  return (
                    <tr>
                      <td>{idx}{attr.objectType}</td>
                      <td>{attr.name}</td>
                      <td>{attr.type}</td>
                      {(() => {
                        if (['Integer', 'Hex', 'Float'].includes(attr.type)) {
                          return [ <td>{attr.typeWithValue[0]}</td>,
                            <td>{attr.typeWithValue[1]}</td>]
                        }
                        else {
                          return [<td> - </td>,
                          <td> - </td>]
                        }
                      })()}
                      <td>{attr.defaultValue}</td>
                      <td>
                        <Button variant="danger" onClick={() =>handleRemoveSpecificSignal(idx)} >
                          Remove
                        </Button>
                      </td>
                    </tr>
                  )
                })
              }
            </tbody>
          </Table >
            <button  className="btn btn-primary">
              Add ...
            </button>
          <div style={{margin:"20px"}} className="mb-2">
            <Button variant="success" size="lg" type="save" onClick={onSaveBtnClick}>
            Save
            </Button>{' '}
            <Button   variant="secondary" size="lg"  type="cancel" onClick={onCancelBtnClick}>
            Cancel
            </Button>
          </div>
        </div>
      );
    };

  ReactDOM.render(<EditorApp />, document.getElementById('root'));
});