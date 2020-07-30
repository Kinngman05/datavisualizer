import React, { Component } from "react";
import {
  Upload,
  Button,
  message,
  Collapse,
  Row,
  Col,
  Input,
  Select,
  Divider,
} from "antd";
import io from "socket.io-client";
import { UploadOutlined } from "@ant-design/icons";
var PapaParse = require("papaparse");
const queryBuilder = require("mysqljsonquery");
const { Panel } = Collapse;
const { Option } = Select;
// import reqwest from 'reqwest';

class UploadData extends Component {
  constructor(props) {
    // self = this;
    super(props);
    this.state = {
      fileList: [],
      uploading: false,
      fileHeaders: [],
      databaseName: null,
      tableName: null,
      currentTables: [],
      availableDatabases: [],
      databaseTableMap: {},
      tableDescription: [],
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
      let availableDatabases = Object.keys(databaseTableMap);
      console.log("availableDatabases", availableDatabases);
      this.setState({ availableDatabases });
      this.setState({ databaseTableMap });
    });
  }
  handleUpload = () => {
    const { fileList } = this.state;
    // console.log("-->", formData);
    // console.log("-->", fileList);
    this.setState({
      uploading: true,
    });
    for (var file in fileList) {
      console.log(file);
      const formData = new FormData();
      formData.append("file", fileList[file]);
      formData.append("filename", fileList[file].name);

      let query = new queryBuilder.queyBuilder();
      let url =
        query.getUrl() +
        "/uploadcsv?+database=" +
        this.state.databaseName +
        "&table=" +
        this.state.tableName;
      fetch(url, {
        method: "POST",
        body: formData,
      }).then((response) => {
        console.log("response", response);
        response.json().then((body) => {
          console.log("body", body);
          this.setState({ uploading: false });
          if (body.status) message.success(body.message + ":File Uploaded!");
          else message.error(body.error);
        });
      });
    }
  };

  columnName = (name) => {
    return name;
  };

  onChangeDatabase = (value) => {
    this.setState({ databaseName: value });
    console.log("ALLLOO", this.state.databaseTableMap[value]);
    this.setState({ currentTables: this.state.databaseTableMap[value] });
  };

  onChangeTableName = (value) => {
    this.setState({ tableName: value });
  };

  onClickGet = () => {
    if (this.state.databaseName == null || this.state.tableName == null) {
      message.error(
        "Please make sure you ahve selected database and table name."
      );
    } else {
      const { databaseName, tableName } = this.state;
      if (databaseName !== null && tableName !== null) {
        let query = new queryBuilder.queyBuilder();
        const socket = io(query.getUrl());
        query.setDatabase(databaseName);
        query.setTableName(tableName);
        query.setRequestType("describe");

        socket.on("connect", () => {
          socket.emit("query", query.buildQuery());
        });

        socket.on("result", (result) => {
          console.log(JSON.parse(result));
          message.success("Success!");
          this.setState({ tableDescription: JSON.parse(result) });
        });
      }
    }
  };

  render() {
    const { uploading, fileList } = this.state;
    const setHeaderState = (file, header) => {
      // console.log("DSKLFJSKL", file, header);
      this.setState({
        fileHeaders: [...this.state.fileHeaders, { [file]: header }],
      });
    };
    const removeHeaderState = (fileHeaders) => {
      this.setState(fileHeaders);
    };
    const props = {
      onRemove: (file) => {
        this.setState((state) => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          removeHeaderState(newFileList);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: (file) => {
        this.setState((state) => ({
          fileList: [...state.fileList, file],
        }));
        PapaParse.parse(file, {
          complete: function (results) {
            setHeaderState(file.name, results.data[0]);
          },
        });
        return false;
      },
      fileList,
    };

    return (
      <>
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
        <Button type="primary" onClick={this.onClickGet}>
          GET
        </Button>
        <Collapse>
          <Panel header={"Table Description"} key={100}>
            <Row>
              <Col span={6}>{"Field"}</Col>
              <Col span={6}>{"Type"}</Col>
              <Col span={3}>{"Null"}</Col>
              <Col span={4}>{"Key"}</Col>
              <Col span={5}>{"Default"}</Col>
            </Row>
            {this.state.tableDescription.length > 0
              ? this.state.tableDescription.map((row) => {
                  let values = Object.values(row);
                  return (
                    <Row>
                      <Col span={6}>{values[0]}</Col>
                      <Col span={6}>{values[1]}</Col>
                      <Col span={3}>{values[2]}</Col>
                      <Col span={4}>{values[3]}</Col>
                      <Col span={5}>{values[4]}</Col>
                    </Row>
                  );
                })
              : null}
          </Panel>
        </Collapse>
        <Divider />
        {this.state.fileHeaders.length !== 0
          ? this.state.fileHeaders.map((header, index) => {
              return (
                <Collapse>
                  <Panel header={Object.keys(header)[0]} key={index}>
                    {Object.values(header)[0].map((eachHeader) => {
                      return (
                        <Row>
                          <Col span={12}>{eachHeader}</Col>
                          <Col span={12}>
                            {
                              <Input
                                size="small"
                                placeholder="column name"
                                defaultValue={this.columnName(eachHeader)}
                              />
                            }
                          </Col>
                        </Row>
                      );
                    })}
                  </Panel>
                </Collapse>
              );
            })
          : null}
        <Upload {...props}>
          <Button>
            <UploadOutlined /> Select File
          </Button>
        </Upload>
        <Button
          type="primary"
          onClick={this.handleUpload}
          disabled={
            fileList.length === 0 && this.state.fileHeaders.length === 0
          }
          loading={uploading}
          style={{ marginTop: 16 }}
        >
          {uploading ? "Uploading" : "Start Upload"}
        </Button>
      </>
    );
  }
}

export default UploadData;
