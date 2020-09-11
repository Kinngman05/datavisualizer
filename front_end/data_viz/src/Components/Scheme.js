// import React, { Component } from "react";
// import { UnControlled as CodeMirror } from "react-codemirror2";
// var CodeMirror = require("react-codemirror");

// class Scheme extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       code: "// Code",
//     };
//   }
//   updateCode = (newCode) => {
//     this.setState({
//       code: newCode,
//     });
//   };
//   render() {
//     return <CodeMirror value={this.state.code} onChange={this.updateCode} />;
//   }
// }

import React, { Component } from "react";
// import { render } from "react-dom";
import CodeMirror from "react-codemirror";
// import Hello from "./Hello";
// import "./style.css";
import "codemirror/lib/codemirror.css";

class Scheme extends Component {
  constructor() {
    super();
    this.state = {
      name: "CodeMirror",
      code: "// Code",
    };
  }

  updateCode(newCode) {
    this.setState({
      code: newCode,
    });
  }

  render() {
    let options = {
      lineNumbers: true,
    };
    return (
      <div>
        <h1>Hello!</h1>
        <p>Start editing to see some magic happen :)</p>
        <CodeMirror
          value={this.state.code}
          onChange={this.updateCode.bind(this)}
          options={options}
        />
      </div>
    );
  }
}
export default Scheme;
