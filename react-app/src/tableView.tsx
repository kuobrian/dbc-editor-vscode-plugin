import * as React from 'react';
import * as ReactDOM from "react-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import * as CANDB from "../../src/candb_provider";
import { uuidv4 } from "../src/parameters";
import {SelectMsgTable} from "../signalComponents/msg_select";
import {SignalDefinitionEdit} from "../signalComponents/definition";
import { ModifyAttribute } from "../commonComponent/attribute_modify"
import { Dropdown, DropdownButton, Col, Table, Form, Button, Modal, Tabs, Tab } from "react-bootstrap";

interface IEditTableProps {
  item: CANDB.DBCValueTable;
  show: boolean;
  handleclose: () => (void);
  handleModify: (data: CANDB.DBCValueTable) => (void);
}

declare global {
    interface Window {
      acquireVsCodeApi(): any;
    }
}

window.addEventListener('message', (event) =>{
  let vscode = window.acquireVsCodeApi();
  let valuetables = event.data.valuetable;

  console.log("valuetable length: ", valuetables.length)

  const EditorApp = () =>  {
    const [tableState, setChangeTable] = React.useState(valuetables);
    let initData = CreateNewTable();
    const [selectData, setSelectData] = React.useState({ data: initData, show: false });

    function CreateNewTable(): CANDB.DBCValueTable {
      let newTable: CANDB.DBCValueTable = {
        uid: uuidv4(),
        name: "New_Value_Table_" + tableState.length,
        tables: []
      }
      return newTable;
    }

    function handleSpecificTable(table: CANDB.DBCValueTable): void {
      setSelectData({
        ...selectData,
        data: table,
        show: true
      });
    }

    function handleRemoveSpecificTable(idx: number): void {
      const rows = [...tableState];
      const delItem = rows[idx];
      rows.splice(idx, 1);
      setChangeTable(rows)
    }

    function handleclose() {
      setSelectData({
        ...selectData,
        data: initData,
        show: false
      });
    }

    function handleModifyTable(item: CANDB.DBCValueTable): void {
      handleclose()
      const rows = [...tableState];
      let idx = rows.findIndex((table: CANDB.DBCValueTable) => table.uid === item.uid)
      if (idx >= 0) {
        rows[idx] = item
      } else {
        rows.push(item)
      }
      setChangeTable(rows)
    };

    function onSaveBtnClick(): void {
      vscode.postMessage({
        command: 'modifyTable',
        data: tableState
      });
    }

    function onCancelBtnClick(): void {
      vscode.postMessage({
        command: 'cancelTable'
      });
    }
    
    return (
      <div>
        <Table striped bordered hover variant="dark"
          className="table table-bordered table-hover"
          id="tab_logic">
          <thead>
            <tr>
              <th>Name</th>
              <th>Comment</th>
              <th>
                <Button variant="success" onClick={() => handleSpecificTable(initData)}>
                  Create New
                </Button>
              </th>
            </tr>
          </thead>
          <tbody>
            {
              valuetables.map((table: CANDB.DBCValueTable, idx: number) => {
                return (
                  <tr>
                    <td>{table.name}</td>
                    <td> </td>
                    <td>
                      <Dropdown >
                        <Dropdown.Toggle id="dropdown-item-button" title="action">action</Dropdown.Toggle>
                        <Dropdown.Menu className="super-colors">
                          <Dropdown.Item as="button" onClick={() => handleSpecificTable(table)}> Edit </Dropdown.Item>
                          <Dropdown.Item as="button" onClick={() => handleRemoveSpecificTable(idx)}> Remove </Dropdown.Item>
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
          if (selectData.show) {
            return (
              <CreateEditTable item={selectData.data} 
                                show={selectData.show} 
                                handleclose={handleclose} 
                                handleModify={handleModifyTable} />
            )
          }
        })()
        }
        
        <div style={{ margin: "20px" }} className="mb-2">
          <Button variant="success" size="lg" type="save" onClick={onSaveBtnClick}>
            Save
            </Button>{' '}
          <Button variant="secondary" size="lg" type="cancel" onClick={onCancelBtnClick}>
            Cancel
            </Button>
        </div>
      </div>
      );
    };

  ReactDOM.render(<EditorApp />, document.getElementById('root'));
});

function CreateEditTable(props: IEditTableProps) {
  let selectItem = JSON.parse(JSON.stringify(props.item))
  const [tableData, setTableData] = React.useState<CANDB.DBCValueTable>(selectItem)
  const [backupData, setbackupData] = React.useState<CANDB.DBCValueTable>(JSON.parse(JSON.stringify(props.item)));

  // React.useEffect(() => {
  //   console.log("*****  ", tableData.name, tableData.tables.length)
  // });

  function handleFormChange(e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>, idx: number) {
    const tableKey = e.target.id.split("_")[1];
    console.log(tableKey, e.target.value)
    if (idx < 0 && tableKey == "name") {
      setTableData({ uid: tableData.uid, name: e.target.value, tables: tableData.tables })
    }
    else {

      let rows = [...tableData.tables];
      (tableKey == "value") ? rows[idx].value = e.target.value : rows[idx].name = e.target.value;
      console.log(rows[idx].value, rows[idx].name)
      setTableData({ uid: tableData.uid, name: tableData.name, tables: rows })
    }
  };


  function handleRemoveSpecificValue(idx: number): void {
    let rows = [...tableData.tables]
    rows.splice(idx, 1);
    setTableData({ uid: tableData.uid, name: tableData.name, tables: rows })
    
  }

  function handleAddTable() {
    let rows = [...tableData.tables]
    rows.push({ name: 'Description for the value 0x' + rows.length.toString(16), value: rows.length.toString(16)})
    setTableData({uid: tableData.uid, name: tableData.name, tables: rows})

  }

  function handleSave() {
    props.handleModify(tableData)
  }

  function handleQuit() {
    props.handleModify(backupData)
    setTableData({ uid: backupData.uid, name: backupData.name, tables: backupData.tables })
    props.handleclose()
  }

  return (
    <Modal size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={props.show}
      onHide={props.handleclose}
      backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Value Table '{props.item.name}'</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Tabs defaultActiveKey="definition" id="uncontrolled-tab-example">
          <Tab eventKey="definition" title="Definition">
            <Form.Row>
              <Form.Group as={Col} md="5" controlId="_name">
                <Form.Label>name :</Form.Label>
                <Form.Control required
                  type="text"
                  defaultValue={tableData.name}
                  onChange={(event) => handleFormChange(event as any, -1)}>
                </Form.Control>
              </Form.Group>
            </Form.Row>
            <Form.Group controlId="_comments">
              <Form.Label>Comments :</Form.Label>
              <Form.Control as="textarea"
                rows={10}
                disabled
                onChange={(event) => handleFormChange(event as any, -1)}/>
            </Form.Group>
          </Tab>
          <Tab eventKey="Value Descriptions" title="Value Descriptions">
            <Table striped bordered hover variant="dark"
              className="table table-bordered table-hover"
              id="tab_logic">
              <thead>
                <tr>
                  <th>Value </th>
                  <th>Description</th>
                  <th>
                    <Button variant="success" onClick={handleAddTable}>
                      Add
                    </Button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {
                  tableData.tables.map((t: CANDB.tableValue, idx: number) => {
                    return (
                      <tr>
                        <td>
                          <Form.Group as={Col} md="20" controlId="_value">
                            <Form.Control required
                              type="text"
                              placeholder={'0x' + t.value}
                              onChange={(event) => handleFormChange(event as any, idx)}>
                            </Form.Control>
                          </Form.Group>
                        </td>
                        <td>
                          <Form.Group as={Col} md="20" controlId="_description">
                          <Form.Control required
                            type="text"
                            defaultValue={t.name}
                            onChange={(event) => handleFormChange(event as any, idx)}>
                          </Form.Control>
                          </Form.Group>
                        </td>
                        <td>
                          <Button variant="danger" onClick={() => handleRemoveSpecificValue(idx)}>
                            Remove
                          </Button>
                        </td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </Table >

          </Tab>
        </Tabs>

      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleSave}>
          save
        </Button>
        <Button variant="secondary" onClick={handleQuit}>
          quit
        </Button>
      </Modal.Footer>
    </Modal>

  );
};