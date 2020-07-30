import React, { Component } from "react";
import { Chart } from "react-google-charts";
import {
  Button,
  Select,
  message,
  PageHeader,
  Descriptions,
  DatePicker,
  Modal,
  Row,
  Col,
  Result,
  Input,
} from "antd";
import io from "socket.io-client";
import { AreaChartOutlined, PlusOutlined } from "@ant-design/icons";
import "./../../css/GoogleChartElementNew.css";
const EasyArray = require("arraymanipulation");
const queryBuilder = require("mysqljsonquery");
const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

class GoogleChartElementNew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chartData: [],
      dataOrder: [],
      dataFields: [],
      chartType: null,
      where: null,
      initDtypeSetup: false,
      whereValue: "",
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
      visible: false,
      databaseName: null,
      tableName: null,
      whereCondition: [],
      whereConditionAttribute: null,
      whereConditionCase: "=",
      whereConditionValue: null,
    };
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
      visible: true,
    });
  };

  handleOk = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  getDataFromDatabase = () => {
    let { databaseName, tableName, dataFields, where } = this.state;

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
    if (where !== null) query.setWhere({ __QUERY__: where });

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
        for (var column in row) {
          dataFields.push(column);
          dataFieldsDataTypes[column] = "number"; //Make this a function to determine datatype
        }
        this.setState({ dataFields });
        this.setState({ dataFieldsDataTypes });
        this.setState({ initDtypeSetup: true });
      } else {
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

  onChangeDatabase = (databaseName) => {
    this.setState({ databaseName });
  };

  onChangeTableName = (tableName) => {
    this.setState({ tableName });
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

  setWhereCondition = async ({ target: { value } }) => {
    await this.setState({ where: value });
    await this.setState({ whereValue: value });
  };

  addWhereCondition = () => {
    let {
      whereConditionAttribute,
      whereConditionCase,
      whereConditionValue,
    } = this.state;
    let append =
      whereConditionAttribute + whereConditionCase + whereConditionValue;
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
                <Option value="stocks">stocks</Option>
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
                <Option value="information">information</Option>
              </Select>
            </Descriptions.Item>
          </Descriptions>
          <TextArea
            value={this.state.whereValue}
            onChange={this.setWhereCondition}
            placeholder="Where condition"
            autoSize={{ minRows: 1, maxRows: 1 }}
          />
          {this.state.whereCondition.length > 0 ? (
            <Select
              mode="multiple"
              style={{ width: "100%" }}
              placeholder="Where condition"
              defaultValue={this.state.whereCondition}
              // onChange={handleChange}
            ></Select>
          ) : null}
          <Row>
            <Col span={2}>WHERE:</Col>
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
            // chartType={"LineChart"}
            options={this.state.chartOptions}
            chartType={this.state.chartType}
            // options={{ legend: "none" }}
            data={this.state.newCoolChartData}
            loader={<div>Loading Chart</div>}
            rootProps={{ "data-testid": "1" }}
          />
        ) : (
          <Result
            icon={<AreaChartOutlined />}
            title="Please select the options to render the chart"
            // extra={<Button type="primary">Next</Button>}
          />
        )}
        {chartMenu}
        <Modal
          title="Select datatypes"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
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
      </div>
    );
  }
}

export default GoogleChartElementNew;
