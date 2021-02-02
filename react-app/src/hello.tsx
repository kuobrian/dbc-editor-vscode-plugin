import React, { useState } from 'react';
import * as ReactDOM from "react-dom";
import Jumbotron from 'react-bootstrap/Jumbotron';
import Toast from 'react-bootstrap/Toast';
import Container from 'react-bootstrap/Container';
import Tabs from "react-bootstrap/Tabs";

import Tab from "react-bootstrap/Tab";
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {InteractorFactory, Interactor } from './utils';

const res = new InteractorFactory();




export class HomePage extends React.Component {
	initvvvv = "init value";

	constructor(props) {
		super(props);
		this.state = { directoryInfo: "", val: "" };
	}
	
	updateFilesToDisplay() {
		res._interactor.getDirectoryInfo(directoryInfo => {
				this.setState({ directoryInfo: directoryInfo });
		});
	}

	onSubmit = () => {
		console.log(this.state["val"]);
	};

	render(): JSX.Element {
		return (
			<>
			<Tabs defaultActiveKey="definition" id="uncontrolled-tab-example">
				<Tab eventKey="definition" title="Definition">
					<div className="col-sm">
						<Form>
							<Form.Group controlId="signalName">
								<Form.Label>Name:</Form.Label> <Form.Control type="email" placeholder="Enter email" />
								<Form.Text className="text-muted">
								init value
								</Form.Text>
							</Form.Group>

							<Form.Group controlId="formBasicPassword">
								<Form.Label>Password</Form.Label>
								<Form.Control type="password" placeholder="Password" />
							</Form.Group>
							<Form.Group controlId="formBasicCheckbox">
								<Form.Check type="checkbox" label="Check me out" />
							</Form.Group>
							<Button variant="primary" type="submit">
								Submit
							</Button>
						</Form>
					</div>
				</Tab>
				<Tab eventKey="messages" title="Messages">
					<Form.Group className="m-0">
						<Form.Control
							className="textFeedback"
							placeholder="feedback"
							value={this.state["val"]}
							onChange={e => this.setState({ val: e.target.value })}
							type="text"
							/>
						<Button className="btnFormSend" variant="outline-success" onClick={this.onSubmit} >
						Send Feedback
						</Button>
					</Form.Group>
				</Tab>
				<Tab eventKey="receivers" title="Receivers" >
				<Button onClick={() => { res._interactor.showInformationMessageTTT("Emojis are in vogue at the moment 🐛"); }}>
					Happy Coding  
					</Button>
				</Tab>
				<Tab eventKey="attributes" title="Attributes" >
				<Button onClick={() => { res._interactor.showInformationMessageTTT("Emojis are in vogue at the moment 🐛"); }}>
					Happy Coding  
					</Button>
				</Tab>
				<Tab eventKey="valueDescriptions" title="Value Descriptions" >
				<Button onClick={() => { res._interactor.showInformationMessageTTT("Emojis are in vogue at the moment 🐛"); }}>
					Happy Coding  
					</Button>
				</Tab>
				<Tab eventKey="comment" title="Comment" >
				<Button onClick={() => { res._interactor.showInformationMessageTTT("Emojis are in vogue at the moment 🐛"); }}>
					Happy Coding  
					</Button>
				</Tab>
			</Tabs>


			<div>
				<button onClick={() => this.updateFilesToDisplay()}>Run <code>dir</code> command</button>
				<br/>
				<code>
					{this.state["directoryInfo"] !== "" ? this.state["directoryInfo"] : "Run the command123..."}
				</code>
			</div>
			
			{/* <div className="col-sm">
			<div>
			<Button onClick={() => { res._interactor.showInformationMessageTTT("Emojis are in vogue at the moment 🐛"); }}>
			Happy Coding  
			</Button>
			</div>
			<button onClick={() => this.updateFilesToDisplay()}>Run <code>dir</code> command</button>
			<br />
			<code>
			{this.directoryInfo !== "" ? this.directoryInfo : "Run the command..."}
			</code>
			</div>    */}
			</>  
		);
	}
}


