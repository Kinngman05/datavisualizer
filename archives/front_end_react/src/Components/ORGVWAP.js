import React, { Component } from "react";
import { Chart } from "react-google-charts";

class RSI extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.inputData,
      pureVwapOptions: {
        chartType: "LineChart",
        title: "VWAP visualization",
        hAxis: {
          title: "Time"
        },
        vAxis: {
          title: "VWAP"
        },
        width: "1000px",
        height: "700px"
      }
    };
  }
  componentDidMount() {
    this.preparePureVwap();
  }

  preparePureVwap = () => {
    let data = this.state.data;
    let header = data[0];
    var vwap_3_Index = 0;
    var vwap_5_Index = 0;
    var vwap_7_Index = 0;
    var vwap_11_Index = 0;
    var vwap_13_Index = 0;
    var vwap_17_Index = 0;
    var vwap_21_Index = 0;
    var dateIndex = 0;
    for (var indexNo in header) {
      if (header[indexNo] === "vwap_3") {
        vwap_3_Index = indexNo;
      } else if (header[indexNo] === "vwap_5") {
        vwap_5_Index = indexNo;
      } else if (header[indexNo] === "vwap_7") {
        vwap_7_Index = indexNo;
      } else if (header[indexNo] === "vwap_11") {
        vwap_11_Index = indexNo;
      } else if (header[indexNo] === "vwap_13") {
        vwap_13_Index = indexNo;
      } else if (header[indexNo] === "vwap_17") {
        vwap_17_Index = indexNo;
      } else if (header[indexNo] === "vwap_21") {
        vwap_21_Index = indexNo;
      } else if (header[indexNo] === "date") {
        dateIndex = indexNo;
      }
    }
    // console.log("vwapIndex:", vwapIndex);
    var pureVwapData = [];
    for (var element in data) {
      var localArray = [];
      localArray.push(data[element][dateIndex]);
      localArray.push(data[element][vwap_3_Index]);
      localArray.push(data[element][vwap_5_Index]);
      localArray.push(data[element][vwap_7_Index]);
      localArray.push(data[element][vwap_11_Index]);
      localArray.push(data[element][vwap_13_Index]);
      localArray.push(data[element][vwap_17_Index]);
      localArray.push(data[element][vwap_21_Index]);
      pureVwapData.push(localArray);
    }
    console.log("pureVwapData", typeof pureVwapData, pureVwapData);
    this.setState({ pureVwapData });
  };
  render() {
    return (
      <div>
        <Chart
          chartType={"LineChart"}
          options={this.state.pureVwapOptions}
          data={this.state.pureVwapData}
          loader={<div>Loading Chart</div>}
          rootProps={{ "data-testid": "1" }}
        />
      </div>
    );
  }
}

export default RSI;
