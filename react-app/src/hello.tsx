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


export const MyComponentTest = () => (
	<div>Hello, World!</div>
);
// export default MyComponent123;
