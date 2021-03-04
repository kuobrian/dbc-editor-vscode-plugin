import * as React from 'react';
import * as ReactDOM from "react-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import * as CANDB from "../../src/candb_provider";
import { uuidv4 } from "../src/parameters";
import {SelectMsgTable} from "../signalComponents/msg_select";
import {SignalDefinitionEdit} from "../signalComponents/definition";
import { ModifyAttribute } from "../commonComponent/attribute_modify"
import { Dropdown, DropdownButton, Col, Table, Form, Button,  Modal } from "react-bootstrap";


interface IEditAttrProps {
  item: CANDB.DBCAttribute;
  show: boolean;
  handleclose: ()=>(void);
  handleModifyAttribute: (data:CANDB.DBCAttribute) => (void);
}


function CreateEditAttribute(props: IEditAttrProps) {

  const [isRageValue, setRageValue] = React.useState(true)

  const mCopy = JSON.parse(JSON.stringify(props.item));

  function handleFormChange(e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) {
    const attrKey = e.target.id.split("_")[1];
    console.log(attrKey, e.target.value)
    mCopy[attrKey] = e.target.value;
    (mCopy.type === "String") ? setRageValue(false) : setRageValue(true)
  };

  function handleSave() {
    props.handleModifyAttribute(mCopy)
  }

  return (
    <Modal size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={props.show}
      onHide={props.handleclose}
      backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Attribute Definition '{props.item.name}'</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form >
          <Form.Row>
            <Form.Group as={Col} md="5" controlId="_name">
              <Form.Label>name :</Form.Label>
              <Form.Control required
                type="text"
                defaultValue={props.item.name}
                onChange={(event) => handleFormChange(event as any)}>
              </Form.Control>
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col} md="3" controlId="_objectType">
              <Form.Label>Object Type:</Form.Label>
              <Form.Control as="select"
                defaultValue={props.item.objectType}
                onChange={(event) => handleFormChange(event as any)}>
                <option>Network</option>
                <option>Node</option>
                <option>Message</option>
                <option>Signale</option>
                <option>Environmental Variable</option>
                <option>Control Unit - Env. Variable</option>
                <option>Node - Tx Message</option>
                <option>Node - Mapped Rx Signal</option>
              </Form.Control>
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col} md="3" controlId="_type">
              <Form.Label>Value Type:</Form.Label>
              <Form.Control as="select"
                defaultValue={props.item.type}
                onChange={(event) => handleFormChange(event as any)}>
                <option>Integer</option>
                <option>Float</option>
                <option>String</option>
                <option>Enumeration</option>
                <option>Hex</option>
              </Form.Control>
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col} md="5" controlId="_defaultValue">
              <Form.Label>Default :</Form.Label>
              <Form.Control required
                defaultValue={props.item.defaultValue}
                onChange={(event) => handleFormChange(event as any)}>
              </Form.Control>
            </Form.Group>
          </Form.Row>
          
            {(() => {
            if (isRageValue) {
                return (
                  <>
                  <Form.Row>
                  <Form.Group as={Col} md="5" controlId="_Minimum">
                    <Form.Label>Minimum :</Form.Label>
                    <Form.Control required
                      type="number"
                      defaultValue={props.item.typeWithValue[0]}
                      onChange={(event) => handleFormChange(event as any)}>
                    </Form.Control>
                  </Form.Group>
                  </Form.Row>
                  <Form.Row>
                    <Form.Group as={Col} md="5" controlId="_Maximum">
                      <Form.Label>Maximum :</Form.Label>
                      <Form.Control required
                        type="number"
                        defaultValue={props.item.typeWithValue[1]}
                        onChange={(event) => handleFormChange(event as any)}>
                      </Form.Control>
                    </Form.Group>
                  </Form.Row>
                  </>
                )}
            })()
              }
          
        </Form>
    </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleSave}>
          save
        </Button>
        <Button variant="secondary" onClick={props.handleclose}>
          quit
        </Button>
      </Modal.Footer>
    </Modal>

  );
};

declare global {
    interface Window {
      acquireVsCodeApi(): any;
    }
}

window.addEventListener('message', (event) =>{
  let vscode = window.acquireVsCodeApi();
  let attributes = event.data.attribute;

  console.log("attribute length: ", attributes.length)

  const EditorApp = () =>  {
    
    const [attributeState, setChangeAttribute] = React.useState(attributes);

    const [showModal, setModal] = React.useState(false);
    const [dataModal, setDataModal] = React.useState<CANDB.DBCAttribute>(() => CreateNewAttr());

    function CreateNewAttr(): CANDB.DBCAttribute {
      let newAttr: CANDB.DBCAttribute = {
        uid: uuidv4(),
        name: "New_AttrDef_" + attributeState.length,
        type: "Integer", 
        objectType: "Message",
        defaultValue: 0,
        typeWithValue: 0,
        values: [],
      }
      return newAttr;
    }

    function handleclose() { setModal(false) }

    function handleSpecificAttribute(attr: CANDB.DBCAttribute): void {
      setDataModal(attr)
      setModal(true)
    }

    function handleModifyAttribute(attr: CANDB.DBCAttribute): void {
      handleclose()
      const rows = [...attributeState];
      let idx = rows.findIndex((item : CANDB.DBCAttribute) => item.uid === attr.uid)
      if (idx >= 0) {
        rows[idx] = attr
      } else {
        rows.push(attr)
      }
      setChangeAttribute(rows)
    };

    function handleRemoveSpecificAttribute(idx: number): void {
      const rows = [...attributeState];
      const delItem = rows[idx];
      rows.splice(idx, 1);
      setChangeAttribute(rows)
    }

    function onSaveBtnClick(): void {
      vscode.postMessage({
        command: 'modifyAttribute',
        data: attributeState
      });    
    }

    function onCancelBtnClick(): void {
      vscode.postMessage({
        command: 'cancelAttribute'
      });    }

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
                <th>
                <Button variant="success" onClick={() => handleSpecificAttribute(CreateNewAttr())}>
                    Create New
                </Button>
                </th>
              </tr>
            </thead>
            <tbody>
              {
                attributeState.map((attr: CANDB.DBCAttribute, idx: number) => {
                  return (
                    <tr>
                      <td>{attr.objectType}</td>
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
                        <Dropdown >
                        <Dropdown.Toggle  id="dropdown-item-button" title="action">action</Dropdown.Toggle>
                          <Dropdown.Menu className="super-colors">
                            <Dropdown.Item as="button" onClick={() => handleSpecificAttribute(attr)}>Edit {attr.name} </Dropdown.Item>
                            <Dropdown.Item as="button" onClick={() => handleRemoveSpecificAttribute(idx)}>Remove</Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </td>
                    </tr>
                  )
                })
              }
            </tbody>
          </Table >
        <CreateEditAttribute item={dataModal} show={showModal} handleclose={handleclose} handleModifyAttribute={handleModifyAttribute}/>
            
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