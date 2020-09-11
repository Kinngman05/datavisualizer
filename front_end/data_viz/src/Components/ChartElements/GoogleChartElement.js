import React, { Component } from "react";
import { Chart } from "react-google-charts";
import {
  Button,
  Select,
  message,
  PageHeader,
  Descriptions,
  // DatePicker,
  Modal,
  Row,
  Col,
  Result,
  Input,
} from "antd";
import io from "socket.io-client";
import { AreaChartOutlined, PlusOutlined } from "@ant-design/icons";
import "./../css/GoogleChartElement.css";
const EasyArray = require("arraymanipulation");
const queryBuilder = require("mysqljsonquery");
const { Option } = Select;
// const { TextArea } = Input;
// const { RangePicker } = DatePicker;

class GoogleChartElement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chartData: [],
      bufferOrder: [],
      dataOrder: [],
      dataFields: [],
      chartType: null,
      initDtypeSetup: false,
      chartOptions: {
        // chartType: "CandlestickChart",
        title: "Visualization",
        // legend: "none",
        hAxis: {
          title: "X Axis",
        },
        vAxis: {
          title: "Y Axis",
        },
        width: "1000px",
        height: "700px",
        crosshair: { trigger: "both" },
      },
      dataTypeVisible: false,
      chartOptionsVisible: false,
      databaseName: null,
      tableName: null,
      whereCondition: [],
      whereConditionAttribute: null,
      whereConditionCase: "=",
      whereConditionValue: null,
      whereMergeCase: "AND",
      mergeCaseDisables: false,
      availableDatabases: [],
      databaseTableMap: {},
      currentTables: [],
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

  justDoIt = (input) => {
    var result = [];
    var { dataFieldsDataTypes } = this.state;
    let dataTypes = Object.values(dataFieldsDataTypes);
    // console.log(input);
    for (var element in input) {
      // console.log(dataTypes[element], input[element]);
      if (dataTypes[element] === "date") {
        let parts = input[element].split("-");
        var mydate = new Date(parts[0], parts[1] - 1, parts[2], 0, 0, 0, 0);
        // console.log(mydate.toISOString());
        result.push(mydate);
      } else if (dataTypes[element] === "number") {
        result.push(Number(input[element]));
      } else if (dataTypes[element] === "string") {
        result.push(input[element]);
      }
    }
    return result;
  };

  createChartHeader = (keys) => {
    return keys;
  };

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

  plot = async () => {
    let { chartData } = this.state;
    if (
      this.state.bufferOrder.length === 0 ||
      this.state.chartData.length === 0
    ) {
      message.error("Error");
      return;
    }
    await this.setState({ dataOrder: this.state.bufferOrder });
    message.success("Data Order Updated!");
    if (Array.isArray(chartData[0])) {
    } else {
      var processedChartData = [];
      processedChartData.push(
        this.createChartHeader(Object.keys(chartData[0]))
      );
      for (var row in chartData) {
        processedChartData.push(this.justDoIt(Object.values(chartData[row])));
      }
      this.setState({ processedChartData });
    }
    let coolChartData = new EasyArray.EasyArray(processedChartData);
    coolChartData.showMetaData();
    let newCoolChartData = coolChartData.arrangeData(this.state.dataOrder);
    await this.setState({ newCoolChartData });
    console.log("--ALLO-->>", newCoolChartData);
  };

  onChangeChartType = (value) => {
    this.setState({ chartType: value });
  };

  setDatatypes = () => {
    this.setState({
      dataTypeVisible: true,
    });
  };

  handleDataTypeOk = (e) => {
    console.log(e);
    this.setState({
      dataTypeVisible: false,
    });
  };

  handleDataTypeCancel = (e) => {
    console.log(e);
    this.setState({
      dataTypeVisible: false,
    });
  };

  determineDataType = (input) => {
    console.log("input", input);
  };

  getDataFromDatabase = () => {
    let { databaseName, tableName, dataFields, whereCondition } = this.state;

    if (databaseName === null || tableName === null) {
      message.error("Please make sure you have selected database and table");
      return;
    }
    let query = new queryBuilder.queyBuilder();
    const socket = io(query.getUrl());

    query.setDatabase(databaseName);
    query.setTableName(tableName);
    query.setRequestType("select");
    query.setFields(["*"]);
    if (whereCondition.length > 0) {
      query.setWhere({ __QUERY__: whereCondition.join(" ") });
    }

    socket.on("connect", () => {
      socket.emit("query", query.buildQuery());
    });

    socket.on("result", (result) => {
      console.log(result);
      message.success("Success!");
      let chartData = JSON.parse(result);
      socket.disconnect();
      let row = chartData[0];
      let dataFieldsDataTypes = {};
      if (this.state.initDtypeSetup === false) {
        dataFields = [];
        for (var column in row) {
          dataFields.push(column);
          dataFieldsDataTypes[column] = this.determineDataType(row[column]);
          dataFieldsDataTypes[column] = "number"; //Make this a function to determine datatype
        }
        this.setState({ dataFields });
        this.setState({ dataFieldsDataTypes });
        this.setState({ initDtypeSetup: true });
      } else {
        console.log("UNRELIABLE CODDE RUNNING PLEASE REVIEW IT");
        for (var column in row) {
          if (this.state.dataFields.includes(column)) {
            console.log("Yes", column, "in", this.state.dataFields);
            continue;
          } else {
            console.log("No", column, "not in", this.state.dataFields);
            var newDataFields = [],
              newDataFieldsDataTypes = {};
            newDataFields.push(column);
            newDataFieldsDataTypes[column] = "number"; //Make this a function to determine datatype
          }
          this.setState([...dataFields, "ola"]);
          this.setState({ ...dataFieldsDataTypes, newDataFields });
        }
      }
      this.setState({ chartData });
    });
  };

  getTableDescription = () => {
    let { databaseName, tableName } = this.state;

    if (databaseName === null || tableName === null) {
      message.error("Please make sure you have selected database and table");
      return;
    }
    let query = new queryBuilder.queyBuilder();
    const socket = io(query.getUrl());

    query.setDatabase(databaseName);
    query.setTableName(tableName);
    query.setRequestType("describe");

    socket.on("connect", () => {
      socket.emit("query", query.buildQuery());
    });

    socket.on("result", (result) => {
      // console.log(result);
      message.success("Success!");
      let descriptionData = JSON.parse(result);
      socket.disconnect();
      // console.log("descriptionData", descriptionData);
      let dataFields = [];
      for (var element in descriptionData) {
        dataFields.push(descriptionData[element]["Field"]);
      }
      this.setState({ dataFields });
    });
  };

  onChangeDatabase = async (databaseName) => {
    await this.setState({ databaseName });
    await this.setState({
      currentTables: this.state.databaseTableMap[databaseName],
    });
    if (this.state.databaseName !== null && this.state.tableName !== null) {
      this.getTableDescription();
    }
  };

  onChangeTableName = async (tableName) => {
    await this.setState({ tableName });
    if (this.state.databaseName !== null && this.state.tableName !== null) {
      this.getTableDescription();
    }
  };

  handleChangeOfDatatype = (value) => {
    var res = value.split("|");
    let x = res[0];
    let y = res[1];
    this.setState((prevState) => ({
      dataFieldsDataTypes: {
        // object that we want to update
        ...prevState.dataFieldsDataTypes, // keep all other key-value pairs
        [x]: y, // update the value of specific key
      },
    }));
  };

  // setWhereCondition = async ({ target: { value } }) => {
  //   await this.setState({ where: value });
  //   await this.setState({ whereValue: value });
  // };

  addWhereCondition = () => {
    let {
      whereConditionAttribute,
      whereConditionCase,
      whereConditionValue,
      whereMergeCase,
    } = this.state;
    let append = "";
    if (["is_not_null", "is_null"].includes(whereConditionCase)) {
      // console.log("ROFL");
      if (this.state.whereCondition.length === 0) {
        append =
          whereConditionAttribute +
          " " +
          whereConditionCase.split("_").join(" ").toUpperCase();
      } else {
        append =
          whereMergeCase +
          " " +
          whereConditionAttribute +
          " " +
          whereConditionCase.split("_").join(" ").toUpperCase();
      }
    } else {
      if (this.state.whereCondition.length === 0) {
        append =
          whereConditionAttribute +
          " " +
          whereConditionCase +
          " " +
          whereConditionValue;
      } else {
        append =
          whereMergeCase +
          " " +
          whereConditionAttribute +
          " " +
          whereConditionCase +
          " " +
          whereConditionValue;
      }
    }
    this.setState({ whereCondition: [...this.state.whereCondition, append] });
  };

  setWhereCase = (value) => {
    this.setState({ whereConditionCase: value });
  };

  setWhereAttribute = (value) => {
    this.setState({ whereConditionAttribute: value });
  };

  setWhereValue = ({ target: { value } }) => {
    this.setState({ whereConditionValue: value });
  };

  handleWhereConditionChange = (value) => {
    // console.log(value);
    // console.log("value", typeof value);
    this.setState({ whereCondition: value });
  };

  setMergeCase = (value) => {
    this.setState({ whereMergeCase: value });
  };

  openChartOptionsModal = () => {
    this.setState({
      chartOptionsVisible: true,
    });
  };

  handleChartOptionsOk = (e) => {
    this.setState({
      chartOptionsVisible: false,
    });
  };

  handleChartOptionsCancel = (e) => {
    this.setState({
      chartOptionsVisible: false,
    });
  };

  render() {
    let availableCharts = (
      <Select
        showSearch
        style={{ width: 200 }}
        placeholder="Select Chart Type"
        optionFilterProp="children"
        onChange={this.onChangeChartType}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        <Option value="LineChart">Line Chart</Option>
        <Option value="CandlestickChart">Candlestick Chart</Option>
        <Option value="PieChart">Pie Chart</Option>
        <Option value="AnnotationChart">Annotation Chart</Option>
      </Select>
    );
    let chartMenu = (
      <div className="site-page-header-chart-ghost-wrapper">
        <PageHeader
          ghost={false}
          // onBack={() => window.history.back()}
          title={availableCharts}
          // subTitle="This is a subtitle"
          extra={[
            <Button key="1" type="primary" onClick={this.plot}>
              Plot
            </Button>,
            <Button key="2" type="primary" onClick={this.getDataFromDatabase}>
              Fetch Data
            </Button>,
            <Button key="3" type="primary" onClick={this.setDatatypes}>
              Data Types
            </Button>,
            <Button key="4" type="primary" onClick={this.openChartOptionsModal}>
              Chart Options
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
          <Select
            mode="multiple"
            style={{ width: "100%" }}
            placeholder="Where condition"
            key={1000 + this.state.whereCondition.length}
            defaultValue={this.state.whereCondition}
            onChange={this.handleWhereConditionChange}
          ></Select>
          <Row>
            <Col span={2}>WHERE:</Col>
            <Col span={2}>
              <Select
                style={{ width: "100%" }}
                defaultValue="AND"
                onChange={this.setMergeCase}
                disabled={this.state.mergeCaseDisables}
              >
                <Option value="AND">{"AND"}</Option>
                <Option value="OR">{"OR"}</Option>
              </Select>
            </Col>
            <Col span={6}>
              <Select
                style={{ width: "100%" }}
                onChange={this.setWhereAttribute}
              >
                {this.state.dataFields.length > 0
                  ? this.state.dataFields.map((eachDataField) => {
                      return (
                        <Option value={eachDataField}>{eachDataField}</Option>
                      );
                    })
                  : null}
              </Select>
            </Col>
            <Col span={6}>
              <Select
                style={{ width: "100%" }}
                defaultValue="="
                onChange={this.setWhereCase}
              >
                <Option value="=">{"="}</Option>
                <Option value="<">{"<"}</Option>
                <Option value=">">{">"}</Option>
                <Option value="<=">{"<="}</Option>
                <Option value=">=">{">="}</Option>
                <Option value="is_null">{"IS NULL"}</Option>
                <Option value="is_not_null">{"IS NOT NULL"}</Option>
              </Select>
            </Col>
            <Col span={6}>
              <Input placeholder="Basic usage" onChange={this.setWhereValue} />
            </Col>
            <Col span={2}>
              <Button type="primary" onClick={this.addWhereCondition}>
                ADD
                <PlusOutlined />
              </Button>
            </Col>
          </Row>
          <Select
            mode="multiple"
            showSearch
            style={{ width: "100%" }}
            placeholder="Select Data Columns"
            optionFilterProp="children"
            onChange={this.handleDataChangeOrder}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {this.makeDataOrder()}
          </Select>
        </PageHeader>
      </div>
    );
    return (
      <div>
        {this.state.dataOrder.length > 0 && this.state.chartType != null ? (
          <Chart
            options={this.state.chartOptions}
            chartType={this.state.chartType}
            data={this.state.newCoolChartData}
            loader={<div>Loading Chart</div>}
            rootProps={{ "data-testid": "1" }}
          />
        ) : (
          <Result
            icon={<AreaChartOutlined />}
            title="Please select the options to render the chart"
          />
        )}
        {this.state.availableDatabases.length > 0 ? chartMenu : null}
        <Modal
          title="Select datatypes"
          visible={this.state.dataTypeVisible}
          onOk={this.handleDataTypeOk}
          onCancel={this.handleDataTypeCancel}
          centered
        >
          {this.state.dataFields.length > 0 ? (
            this.state.dataFields.map((eachDataField) => {
              return (
                <Row>
                  <Col span={12}>{eachDataField}</Col>
                  <Col span={12}>
                    :
                    <Select
                      defaultValue={eachDataField + "|number"}
                      style={{ width: 100 }}
                      onChange={this.handleChangeOfDatatype}
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
        </Modal>
        <Modal
          title="Chart Options"
          visible={this.state.chartOptionsVisible}
          onOk={this.handleChartOptionsOk}
          onCancel={this.handleChartOptionsCancel}
          centered
        >
          <div>OLA AMIGOS</div>
        </Modal>
      </div>
    );
  }
}

export default GoogleChartElement;
