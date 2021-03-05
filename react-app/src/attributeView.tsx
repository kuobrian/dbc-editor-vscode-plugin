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
  const [attrData, setAttrData] = React.useState<CANDB.DBCAttribute>(props.item)
  

  // React.useEffect(() => {
  //   console.log("*****  ", attrData.type, attrData.typeWithValue)
  // });

  function handleFormChange(e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) {
    const attrKey = e.target.id.split("_")[1];
    if (attrKey ==="typeWithValue") { 
      setAttrData({
        ...attrData,
        [attrKey]: e.target.value.split(/\n/)
      });
    }
    else { 
      setAttrData({
        ...attrData,
        [attrKey]: e.target.value
      });
    }
  };  


  function handleSave() {
    props.handleModifyAttribute(attrData)
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
                defaultValue={attrData.name}
                onChange={(event) => handleFormChange(event as any)}>
              </Form.Control>
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col} md="3" controlId="_objectType">
              <Form.Label>Object Type:</Form.Label>
              <Form.Control as="select"
                defaultValue={attrData.objectType}
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
                defaultValue={attrData.type}
                onChange={(event) => handleFormChange(event as any)}>
                <option>Integer</option>
                <option>Float</option>
                <option>String</option>
                <option>Enumeration</option>
                <option>Hex</option>
              </Form.Control>
            </Form.Group>
          </Form.Row>
          {(() => {
            if (attrData.type === "Enumeration") {
              return (
                <>
                <Form.Row>
                  <Form.Group as={Col} md="3" controlId="_defaultValue">
                    <Form.Label>Default :</Form.Label>
                    <Form.Control as="select"
                      defaultValue={props.item.type}
                      onChange={(event) => handleFormChange(event as any)}>
                      {
                        attrData.typeWithValue.map((item: string) => {
                          return ( <option>{item}</option> )
                        })
                      }
                    </Form.Control>
                  </Form.Group>
                </Form.Row>
                <Form.Row>
                  <Form.Group controlId="_typeWithValue">
                    <Form.Label>Value Range :</Form.Label>
                    <Form.Control as="textarea"
                        rows={5}
                        defaultValue={attrData.typeWithValue.join("\n")}
                        onChange={(event) => handleFormChange(event as any)} />
                  </Form.Group>
                </Form.Row>
              </>
              )
            } 
            else {
              return (
                <>
                <Form.Row>
                  <Form.Group as={Col} md="5" controlId="_defaultValue">
                    <Form.Label>Default :</Form.Label>
                    <Form.Control required
                      defaultValue={attrData.defaultValue}
                      onChange={(event) => handleFormChange(event as any)}>
                    </Form.Control>
                  </Form.Group>
                </Form.Row>
                </>
              )
            }
          })()
          }
          {(() => {
            if (attrData.type !== "Enumeration" && attrData.type !== "String") {
              return (
                <>
                  <Form.Row>
                    <Form.Group as={Col} md="5" controlId="_Minimum">
                      <Form.Label>Minimum :</Form.Label>
                      <Form.Control required
                        type="number"
                        defaultValue={(attrData.typeWithValue.length > 0) ? attrData.typeWithValue[0] : " "}
                        onChange={(event) => handleFormChange(event as any)}>
                      </Form.Control>
                    </Form.Group>
                  </Form.Row>
                  <Form.Row>
                    <Form.Group as={Col} md="5" controlId="_Maximum">
                      <Form.Label>Maximum :</Form.Label>
                      <Form.Control required
                        type="number"
                        defaultValue={(attrData.typeWithValue.length > 1) ? attrData.typeWithValue[1] : " "}
                        onChange={(event) => handleFormChange(event as any)}>
                      </Form.Control>
                    </Form.Group>
                  </Form.Row>
                </>
              )
            }

          })()}
          
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

    let initData = CreateNewAttr();
    const [dataModal, setDataModal] = React.useState({ data: initData, show:false});

    function CreateNewAttr(): CANDB.DBCAttribute {
      let newAttr: CANDB.DBCAttribute = {
        uid: uuidv4(),
        name: "New_AttrDef_" + attributeState.length,
        type: "Integer", 
        objectType: "Message",
        defaultValue: " ",
        typeWithValue: [],
        values: [],
      }
      return newAttr;
    }
    

    function handleclose() {
      setDataModal({
        ...dataModal,
        data: initData,
        show: false
      });
     }

    function handleSpecificAttribute(attr: CANDB.DBCAttribute): void {
      setDataModal({
        ...dataModal,
        data: attr,
        show: true
      });
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
                <Button variant="success" onClick={() => handleSpecificAttribute(initData)}>
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
          {(() => {
            if (dataModal.show){
              return (
                <CreateEditAttribute item={dataModal.data} show={dataModal.show} handleclose={handleclose} handleModifyAttribute={handleModifyAttribute}/>
              )}
            })()
          }
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