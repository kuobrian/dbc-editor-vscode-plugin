// import * as React from "react";
// import { Button } from "react-bootstrap";

// export interface HelloProps { compiler: string; framework: string;}

// export class Hello extends React.Component<HelloProps, {}> {
//   render() {
//       return <h1>Hello from123 {this.props.compiler} and {this.props.framework}!</h1>;
//   }
// }
import React, { useState } from 'react';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Toast from 'react-bootstrap/Toast';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';


export class MyComponent  extends React.Component {
    render () {
      return (
        <div>Hello, World!</div>
      );
    }
}


const App = () => (
  <Container className="p-3">
    <Jumbotron>
      <h1 className="header">Welcome To React-Bootstrap</h1>
      <MyComponent>
        We now have Toasts
        <span role="img" aria-label="tada">
          🎉
        </span>
      </MyComponent>
    </Jumbotron>
  </Container>
);


export class HomePage extends React.Component<unknown, unknown> {
  public render(): JSX.Element {
      return (
        <>
          <div>
            <Button> Happy Coding  </Button>
          </div>
          <div>     
          <Form>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
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

      </>  
      );
  }
}