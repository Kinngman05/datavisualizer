import React, { Component } from "react";
import {
  PageHeader,
  Button,
  Descriptions,
  DatePicker,
  Select,
  Table,
} from "antd";
import io from "socket.io-client";
const queryBuilder = require("mysqljsonquery");

const { RangePicker } = DatePicker;
const { Option } = Select;

class TabularData extends Component {
  constructor(props) {
    super(props);
    // console.log("XX-->>",props.availableStocks)
    this.state = {
      availableStocks: ["BHEL", "HDFCBANK", "HCLTECH", "MPHASIS"],
      databaseInfo: {
        databaseName: "stocks",
        tableName: "information",
      },
    };
  }

  onChange = (stockName) => {
    this.setState({ stockName });
    let { databaseInfo } = this.state;

    let query = new queryBuilder.queyBuilder();
    const socket = io(query.getUrl());
    query.setDatabase(databaseInfo.databaseName);
    query.setTableName(databaseInfo.tableName);
    query.setRequestType("select");
    query.setFields(["*"]);
    query.setWhere({ symbol: stockName });
    query.setComment("N");
    socket.on("connect", () => {
      // let { databaseInfo, stockName } = this.state;
      // console.log("Working connection", socket.id);
      console.log("The query is:", query.buildQuery());
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

  makeOptions = () =>
    this.state.availableStocks.map((stock) => (
      <Option value={stock}>{stock}</Option>
    ));

  render() {
    let stockDropDown = (
      <Select
        showSearch
        style={{ width: 100 }}
        placeholder="Stock"
        optionFilterProp="children"
        onChange={this.onChange}
        // onFocus={this.onFocus}
        // onBlur={this.onBlur}
        // onSearch={this.onSearch}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {this.makeOptions()}
      </Select>
    );
    let pageDescriptionHeader = (
      <div className="site-page-header-ghost-wrapper">
        <PageHeader
          ghost={false}
          // onBack={() => window.history.back()}
          title={stockDropDown}
          // subTitle="This is a subtitle"
          extra={[
            <Button key="1" type="primary">
              Refresh
            </Button>,
          ]}
        >
          <Descriptions size="small" column={3}>
            {/* <Descriptions.Item label="Created">Lili Qu</Descriptions.Item> */}
            <Descriptions.Item label="Date">
              2020/01/10 - 2020/05/01
            </Descriptions.Item>
            <Descriptions.Item label="Range">
              <RangePicker size="small" />
            </Descriptions.Item>
            <Descriptions.Item label="Association">
              <p>421421</p>
            </Descriptions.Item>
            <Descriptions.Item label="Creation Time">
              2017-01-10
            </Descriptions.Item>
            <Descriptions.Item label="Effective Time">
              2017-10-10
            </Descriptions.Item>
            <Descriptions.Item label="Remarks">HELLO?</Descriptions.Item>
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
