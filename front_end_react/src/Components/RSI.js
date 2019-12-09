import React, { Component } from "react";
import { Chart } from "react-google-charts";

class ORGVWAP extends Component {
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
          title: "RSI"
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
    var avgGainIndex = 0;
    var avgLossIndex = 0;
    var rsIndex = 0;
    var rsiIndex = 0;
    var dateIndex = 0;
    for (var indexNo in header) {
      if (header[indexNo] === "avg_gain") {
        avgGainIndex = indexNo;
      } else if (header[indexNo] === "avg_loss") {
        avgLossIndex = indexNo;
      } else if (header[indexNo] === "rs") {
        rsIndex = indexNo;
      } else if (header[indexNo] === "rsi") {
        rsiIndex = indexNo;
      } else if (header[indexNo] === "date") {
        dateIndex = indexNo;
      }
    }
    // console.log("vwapIndex:", vwapIndex);
    var pureVwapData = [];
    for (var element in data) {
      var localArray = [];
      localArray.push(data[element][dateIndex]);
      localArray.push(data[element][avgGainIndex]);
      localArray.push(data[element][avgLossIndex]);
      localArray.push(data[element][rsIndex]);
      localArray.push(data[element][rsiIndex]);
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

export default ORGVWAP;
