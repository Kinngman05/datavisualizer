import React, { Component } from "react";
import { Input } from "antd";

const { TextArea } = Input;

class Analysis extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
    };
  }
  onChange = ({ target: { value } }) => {
    this.setState({ value });
  };
  render() {
    return (
      <TextArea
        value={this.state.value}
        onChange={this.onChange}
        placeholder="Python Code"
        autoSize={{ minRows: 10, maxRows: 200 }}
      />
    );
  }
}

export default Analysis;
