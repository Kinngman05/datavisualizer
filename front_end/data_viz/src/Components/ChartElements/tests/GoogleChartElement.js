import React, { Component } from "react";
import { Chart } from "react-google-charts";
import { Button, Select, message, Row, Col } from "antd";
const EasyArray = require("arraymanipulation");
const { Option } = Select;

class GoogleChartElement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.inputData,
      dataDataTypes: props.dataTypes,
      dataOrder: [],
      dataFields: props.dataFields,
      chartType: null,
      pureVwapOptions: {
        // chartType: "CandlestickChart",
        title: "VWAP visualization",
        // legend: "none",
        hAxis: {
          title: "Time",
          viewWindow: {
            max: 100,
            min: -10,
          },
        },
        vAxis: {
          title: "RSI",
          viewWindow: {
            max: -10,
            min: 100,
          },
        },
        width: "1000px",
        height: "700px",
      },
    };
  }
  componentDidMount() {
    this.preparePureVwap();
  }

  justDoIt = (input) => {
    var result = [];
    var { dataDataTypes } = this.state;
    let dataTypes = Object.values(dataDataTypes);
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

  preparePureVwap = () => {
    let { data } = this.state;
    console.log("--ALLO-->>", data);
    if (Array.isArray(data[0])) {
      //   console.log("if part");
      this.setState({ chartData: data });
      //   console.log("chartData_if", this.state.chartData);
    } else {
      //   console.log("else part", data, data[0]);
      var chartData = [];
      chartData.push(Object.keys(data[0]));
      // console.log("header", Object.keys(data[0]));
      //   console.log("chartData_else1", chartData);
      for (var row in data) {
        // console.log(row, Object.values(data[row]));
        chartData.push(this.justDoIt(Object.values(data[row])));
        // console.log("chartData_elseX", chartData);
      }
      // let coolChartData = new EasyArray.EasyArray(chartData);
      // console.log("x->",this.state.dataOrder)
      // let newCoolChartData = coolChartData.arrangeData(this.state.dataOrder);
      this.setState({ processedChartData: chartData });
      this.setState({ chartData });
      //   console.log("chartData_else", this.state.chartData);
    }
    // console.log("chartData", this.state.chartData);
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
    await this.setState({ dataOrder: this.state.bufferOrder });
    let coolChartData = new EasyArray.EasyArray(this.state.processedChartData);
    // console.log("dataOrder->", this.state.dataOrder);
    let newCoolChartData = coolChartData.arrangeData(this.state.dataOrder);
    // console.log("newCoolChartData->", newCoolChartData);
    // coolChartData.showMetaData();
    await this.setState({ chartData: newCoolChartData });
    message.success("Data Order Updated!");
  };

  onChange = (value) => {
    this.setState({ chartType: value });
  };

  render() {
    return (
      <div>
        {this.state.dataOrder.length > 0 && this.state.chartType != null ? (
          <Chart
            // chartType={"LineChart"}
            options={this.state.pureVwapOptions}
            chartType={this.state.chartType}
            // options={{ legend: "none" }}
            data={this.state.chartData}
            loader={<div>Loading Chart</div>}
            rootProps={{ "data-testid": "1" }}
          />
        ) : (
          <p>Please select the data order</p>
        )}
        <div>
          <Row>
            <Col>
              <Select
                mode="multiple"
                style={{ width: "300px" }}
                placeholder="Please select"
                // defaultValue={["a10", "c12"]}
                onChange={this.handleDataChangeOrder}
              >
                {this.makeDataOrder()}
              </Select>
              <Button key="2" type="primary" onClick={this.plot}>
                Plot
              </Button>
            </Col>
            <Col>
              <Select
                showSearch
                style={{ width: 200 }}
                placeholder="Select a person"
                optionFilterProp="children"
                onChange={this.onChange}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                <Option value="LineChart">Line Chart</Option>
                <Option value="CandlestickChart">Candlestick Chart</Option>
                <Option value="PieChart">Pie Chart</Option>
              </Select>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default GoogleChartElement;
