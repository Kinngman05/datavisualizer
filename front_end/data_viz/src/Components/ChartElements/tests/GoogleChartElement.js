import React, { Component } from "react";
import { Chart } from "react-google-charts";
const EasyArray = require("arraymanipulation");

class GoogleChartElement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.inputData,
      dataDataTypes: props.dataTypes,
      dataOrder: props.dataOrder,
      pureVwapOptions: {
        chartType: "LineChart",
        title: "VWAP visualization",
        hAxis: {
          title: "Time",
        },
        vAxis: {
          title: "RSI",
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
      if (dataTypes[element] == "date") {
        let parts = input[element].split("-");
        var mydate = new Date(parts[0], parts[1] - 1, parts[2], 0, 0, 0, 0);
        // console.log(mydate.toISOString());
        result.push(mydate);
      } else if (dataTypes[element] == "number") {
        result.push(Number(input[element]));
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
      let coolChartData = new EasyArray.EasyArray(chartData);
      // console.log("x->",this.state.dataOrder)
      let newCoolChartData = coolChartData.arrangeData(this.state.dataOrder);
      this.setState({ chartData: newCoolChartData });
      //   console.log("chartData_else", this.state.chartData);
    }
    // console.log("chartData", this.state.chartData);
  };

  render() {
    return (
      <div>
        <Chart
          chartType={"LineChart"}
          options={this.state.pureVwapOptions}
          data={this.state.chartData}
          loader={<div>Loading Chart</div>}
          rootProps={{ "data-testid": "1" }}
        />
      </div>
    );
  }
}

export default GoogleChartElement;
