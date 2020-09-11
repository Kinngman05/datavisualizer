import React, { Component } from "react";
import { PageHeader, Button, Descriptions, Select, Table, message } from "antd";
import io from "socket.io-client";
const queryBuilder = require("mysqljsonquery");

const { Option } = Select;

class TabularData extends Component {
  constructor(props) {
    super(props);
    // console.log("XX-->>",props.availableStocks)
    this.state = {
      availableDatabases: [],
      databaseTableMap: {},
      currentTables: [],
      tableData: [],
      databaseName: null,
      tableName: null,
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
      console.log("availableDatabases->", availableDatabases);
      this.setState({ availableDatabases });
      this.setState({ databaseTableMap });
    });
  }

  getDataFromDatabase = () => {
    let { databaseName, tableName } = this.state;

    if (databaseName === null || tableName === null) {
      message.error("Please make sure you have selected database and table");
      return;
    }
    console.log("WOKRING detdatafromdatabase");
    let query = new queryBuilder.queyBuilder();
    const socket = io(query.getUrl());

    query.setDatabase(databaseName);
    query.setTableName(tableName);
    query.setRequestType("select");
    query.setFields(["*"]);

    socket.on("connect", () => {
      message.info("Loading data")
      socket.emit("query", query.buildQuery());
    });

    socket.on("result", (result) => {
      console.log("stocks data:", result);
      let tableData = JSON.parse(result);
      socket.disconnect();
      console.log(tableData[0]);
      let row = tableData[0];
      var columnHeader = [];
      for (var column in row) {
        // columnHeader.push(column)
        columnHeader.push({
          title: column.toUpperCase(),
          // width: 100,
          dataIndex: column,
          key: column,
          // fixed: "left",
        });
        // console.log(column);
      }
      this.setState({ columnHeader });
      this.setState({ tableData }); // antd recomemnds putting a 'key' in this object list for each element
    });
  };

  onChangeDatabase = async (databaseName) => {
    await this.setState({ databaseName });
    await this.setState({
      currentTables: this.state.databaseTableMap[databaseName],
    });
    if (this.state.databaseName !== null && this.state.tableName !== null) {
      this.getDataFromDatabase();
    }
  };

  onChangeTableName = async (tableName) => {
    await this.setState({ tableName });
    if (this.state.databaseName !== null && this.state.tableName !== null) {
      this.getDataFromDatabase();
    }
  };

  render() {
    let pageDescriptionHeader = (
      <div className="site-page-header-ghost-wrapper">
        <PageHeader
          ghost={false}
          // onBack={() => window.history.back()}
          // title={stockDropDown}
          // subTitle="This is a subtitle"
          extra={[
            <Button key="1" type="primary">
              Refresh
            </Button>,
            <Button key="2" type="primary" onClick={this.getDataFromDatabase}>
              Reload Data
            </Button>,
          ]}
        >
          <Descriptions size="small" column={3}>
            {/* <Descriptions.Item label="Created">Lili Qu</Descriptions.Item> */}
            <Descriptions.Item label="Database Name">
              <Select
                showSearch
                style={{ width: 200 }}
                placeholder="Select Chart Type"
                optionFilterProp="children"
                onChange={this.onChangeDatabase}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {this.state.availableDatabases.map((database) => {
                  return <Option value={database}>{database}</Option>;
                })}
              </Select>
            </Descriptions.Item>
            <Descriptions.Item label="Table Name">
              <Select
                showSearch
                style={{ width: 200 }}
                placeholder="Select Chart Type"
                optionFilterProp="children"
                onChange={this.onChangeTableName}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {this.state.currentTables.map((table) => {
                  return <Option value={table}>{table}</Option>;
                })}
              </Select>
            </Descriptions.Item>
          </Descriptions>
        </PageHeader>
      </div>
    );
    return (
      <div>
        {pageDescriptionHeader}
        <Table
          // yScroll={true}
          // hasData={false}
          size={"small"}
          expandable
          bordered={true}
          columns={this.state.columnHeader}
          dataSource={this.state.tableData}
          scroll={{ x: 1500, y: 300 }}
        />
      </div>
    );
  }
}

export default TabularData;
