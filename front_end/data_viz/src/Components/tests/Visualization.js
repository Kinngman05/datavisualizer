import React, { Component } from "react";
import {
  Row,
  Col,
  PageHeader,
  Button,
  Descriptions,
  DatePicker,
  Select,
  Drawer,
} from "antd";
import io from "socket.io-client";
// import ChartElement from "./ChartElements/tests/VictoryChartElement";
// import LineTestZoom from "./ChartElements/tests/VictoryLineTestZoom";
// import GoogleChartElement from "./ChartElements/tests/GoogleChartElement";
import GoogleChartElementNew from "./ChartElements/tests/GoogleChartElementNew";
// const EasyArray = require("arraymanipulation");
const queryBuilder = require("mysqljsonquery");

// const { VictoryBar } = V;
const { RangePicker } = DatePicker;
const { Option } = Select;

class Visualization extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: [],
      dataFields: [],
      dataFieldsDataTypes: {},
      optionOrder: [],
      databaseName: "stocks",
      tableName: "information",
      fields: ["*"],
      where: null,
      dataTypesSet: false,
    };
  }

  onChange = (value) => {
    this.setState({ where: { symbol: value } });
    let query = new queryBuilder.queyBuilder();
    query.setDatabase(this.state.databaseName);
    query.setTableName(this.state.tableName);
    query.setRequestType("select");
    query.setFields(this.state.fields);
    query.setWhere({ symbol: value });
    // query.setWhere({ symbol: stockName });
    // query.setComment("N");

    const socket = io(query.getUrl());

    socket.on("connect", () => {
      // console.log("Working connection", socket.id);
      // console.log("viz", query.buildQuery());
      socket.emit("query", query.buildQuery());
    });

    socket.on("result", (result) => {
      var { dataFields } = this.state;
      // console.log("stocks data:", result);
      let tableData = JSON.parse(result);
      this.setState({ result: tableData });
      socket.disconnect();
      // console.log(tableData[0]);
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
        dataFields.push(column);
        // console.log(column)
      }
      let dataFieldsDataTypes = {};
      for (var x of dataFields) {
        dataFieldsDataTypes[x] = "number";
      }
      this.setState({ dataFieldsDataTypes });
      this.setState({ dataFields });
      this.setState({ columnHeader });
      this.setState({ tableData });
    });
  };

  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  handleChange = (value) => {
    var res = value.split("|");
    // console.log(res[0], res[1]);
    let x = res[0];
    let y = res[1];
    // this.setState({ dataFieldsDataTypes:
    //   {...this.state.dataFieldsDataTypes, this.state.dataFieldsDataTypes[res[0]] : res[1]}
    // })
    // this.setState({ queries: [...this.state.queries, query] });
    this.setState((prevState) => ({
      dataFieldsDataTypes: {
        // object that we want to update
        ...prevState.dataFieldsDataTypes, // keep all other key-value pairs
        [x]: y, // update the value of specific key
      },
    }));
  };

  approveDataTypes = () => {
    this.setState({ dataTypesSet: true });
  };

  // makeOptions = () =>
  //   this.state.availableStocks.map((stock) => (
  //     <Option value={stock}>{stock}</Option>
  //   ));

  makeDataOrder = () =>
    this.state.dataFields.map((dataField) => (
      <Option key={dataField} value={dataField}>
        {dataField}
      </Option>
    ));

  handleDataChangeOrder = (value) => {
    // console.log(value)
    this.setState({ bufferOrder: value });
  };

  plot = () => {
    // console.log(this.state.bufferOrder)
    this.setState({ dataOrder: this.state.bufferOrder });
  };

  render() {
    // let stockDropDown = (
    //   <Select
    //     showSearch
    //     style={{ width: 100 }}
    //     placeholder="Stock"
    //     optionFilterProp="children"
    //     onChange={this.onChange}
    //     // onFocus={this.onFocus}
    //     // onBlur={this.onBlur}
    //     // onSearch={this.onSearch}
    //     filterOption={(input, option) =>
    //       option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
    //     }
    //   >
    //     {this.makeOptions()}
    //   </Select>
    // );
    // let pageDescriptionHeader = (
    //   <div className="site-page-header-ghost-wrapper">
    //     <PageHeader
    //       ghost={false}
    //       // onBack={() => window.history.back()}
    //       title={stockDropDown}
    //       // subTitle="This is a subtitle"
    //       extra={[
    //         <Button key="1" type="primary">
    //           Refresh
    //         </Button>,
    //         <Button key="2" type="primary" onClick={this.showDrawer}>
    //           Data Types
    //         </Button>,
    //       ]}
    //     >
    //       <Descriptions size="small" column={3}>
    //         {/* <Descriptions.Item label="Created">Lili Qu</Descriptions.Item> */}
    //         <Descriptions.Item label="Database Name">
    //           {this.state.databaseName}
    //         </Descriptions.Item>
    //         <Descriptions.Item label="Table Name">
    //           {this.state.tableName}
    //         </Descriptions.Item>
    //         <Descriptions.Item label="Range">
    //           <RangePicker size="small" />
    //         </Descriptions.Item>
    //         <Descriptions.Item label="Creation Time">
    //           2017-01-10
    //         </Descriptions.Item>
    //         <Descriptions.Item label="Effective Time">
    //           <Select
    //             mode="multiple"
    //             style={{ width: "200px" }}
    //             placeholder="Please select"
    //             // defaultValue={["a10", "c12"]}
    //             onChange={this.handleDataChangeOrder}
    //           >
    //             {this.makeDataOrder()}
    //           </Select>
    //           <Button key="2" type="primary" onClick={this.plot}>
    //             Plot
    //           </Button>
    //         </Descriptions.Item>
    //       </Descriptions>
    //     </PageHeader>
    //   </div>
    // );
    return (
      <div>
        {/* {pageDescriptionHeader} */}
        {/* <ChartElement /> */}
        {/* {this.state.result.length > 0 && */}
        {/* this.state.dataTypesSet === true && */}
        {/* this.state.dataFields.length === Object.keys(this.state.dataFieldsDataTypes).length ? ( */}
        {/* <GoogleChartElement
          inputData={this.state.result}
          dataTypes={this.state.dataFieldsDataTypes}
          dataOrder={this.state.dataOrder}
          dataFields={this.state.dataFields}
        /> */}
        <GoogleChartElementNew />
        {/* ) : (
          <div>NO data </div>
        )} */}
        {/* <Drawer
          title="Basic Drawer"
          placement="right"
          closable={false}
          onClose={this.onClose}
          visible={this.state.visible}
          getContainer={false}
          width={400}
          // style={{ position: "absolute" }}
          footer={
            <div
              style={{
                textAlign: "right",
              }}
            >
              <Button onClick={this.approveDataTypes} type="primary">
                Submit
              </Button>
            </div>
          }
        >
          {this.state.dataFields.length > 0 ? (
            this.state.dataFields.map((eachDataField) => {
              return (
                <Row>
                  <Col>
                    {eachDataField}:
                    <Select
                      defaultValue={eachDataField + "|number"}
                      style={{ width: 100 }}
                      onChange={this.handleChange}
                    >
                      <Option value={eachDataField + "|date"}>Date</Option>
                      <Option value={eachDataField + "|number"}>Number</Option>
                      <Option value={eachDataField + "|string"}>String</Option>
                    </Select>
                  </Col>
                </Row>
              );
            })
          ) : (
            <p>No data</p>
          )}
        </Drawer> */}
      </div>
    );
  }
}

export default Visualization;
