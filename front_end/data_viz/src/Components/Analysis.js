import React, { Component } from "react";
import { Button, message, Select } from "antd";
import { UnControlled as CodeMirror } from "react-codemirror2";
import io from "socket.io-client";
import "codemirror/lib/codemirror.css";

const queryBuilder = require("mysqljsonquery");
const { Option } = Select;

class Analysis extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uploading: false,
      code: "",
      databaseName: null,
      tableName: null,
      currentTables: [],
      availableDatabases: [],
      databaseTableMap: {},
    };
    let query = new queryBuilder.queyBuilder();
    const socket = io(query.getUrl());
    query.setRequestType("show");

    socket.on("connect", () => {
      socket.emit("query", query.buildQuery());
    });

    socket.on("result", (result) => {
      console.log("show", result);
      let databaseTableMap = JSON.parse(result);
      socket.disconnect();
      let availableDatabases = Object.keys(databaseTableMap);
      this.setState({ availableDatabases });
      this.setState({ databaseTableMap });
    });
  }
  handleUpload = () => {
    if (this.state.databaseName == null || this.state.tableName == null) {
      message.error(
        "Please make sure you ahve selected database and table name."
      );
    } else {
      let query = new queryBuilder.queyBuilder();
      let url =
        query.getUrl() +
        "/pythoncode?database=" +
        this.state.databaseName +
        "&table=" +
        this.state.tableName;
      fetch(url, {
        method: "POST",
        body: this.state.code,
      }).then((response) => {
        message.success("Success ig");
        console.log("response", response);
      });
    }
  };

  onChangeDatabase = (value) => {
    this.setState({ databaseName: value });
    console.log("ALLLOO", this.state.databaseTableMap[value]);
    this.setState({ currentTables: this.state.databaseTableMap[value] });
  };

  onChangeTableName = (value) => {
    this.setState({ tableName: value });
  };

  render() {
    return (
      <div>
        <Select
          showSearch
          style={{ width: 200 }}
          placeholder="Select Database"
          optionFilterProp="children"
          onChange={this.onChangeDatabase}
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {this.state.availableDatabases.map((database) => {
            return <Option value={database}>{database}</Option>;
          })}
          {/* <Option value="stocks">stocks</Option> */}
        </Select>
        <Select
          showSearch
          style={{ width: 200 }}
          placeholder="Select Table"
          optionFilterProp="children"
          onChange={this.onChangeTableName}
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {this.state.currentTables.map((table) => {
            return <Option value={table}>{table}</Option>;
          })}
        </Select>
        <h1>Python Code</h1>
        <CodeMirror
          value={this.state.code}
          options={{
            mode: "xml",
            theme: "material",
            lineNumbers: true,
          }}
          onChange={(editor, data, value) => {
            console.log("value", value);
            this.setState({ code: value });
          }}
        />
        <Button
          type="primary"
          onClick={this.handleUpload}
          disabled={this.state.code.length === 0}
          loading={this.state.uploading}
          style={{ marginTop: 16 }}
        >
          {this.state.uploading ? "Uploading" : "Start Upload"}
        </Button>
      </div>
    );
  }
}

export default Analysis;
