import * as React from "react";
import * as ReactDOM from "react-dom";

import {HomePage, MyComponent} from './hello';
import 'bootstrap/dist/css/bootstrap.min.css';

// ReactDOM.render(
//     <Hello compiler="TypeScript123" framework="React" />,
//     document.getElementById("hello")
// );


// ReactDOM.render(<MyComponent />, document.getElementById('hello'));
ReactDOM.render(<HomePage/>, document.getElementById('hello'));
