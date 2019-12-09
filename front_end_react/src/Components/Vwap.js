import React, { Component } from "react";
import { Chart } from "react-google-charts";
// import ChartComponent from "./ChartComponent";

class Vwap extends Component {
  constructor(props) {
    super(props);
    console.log("The input data in vwap is:", props.inputData);
    this.state = {
      data: props.inputData,
      pureVwapOptions: {
        chartType: "LineChart",
        title: "SIGMA visualization 1",
        hAxis: {
          title: "Time"
        },
        vAxis: {
          title: "SIGMA"
        },
        width: "1000px",
        height: "700px"
      },
      candleVwapOptions: {
        // chartType: "CandlestickChart",
        title: "SIGMA visualization 2",
        hAxis: {
          title: "Time"
        },
        vAxis: {
          title: "SIGMA"
        },
        seriesType: "candlesticks",
        series: { 1: { type: "line" } },
        legend: "none",
        width: "1000px",
        height: "700px"
      },
      candleSigmaVwapOptions: {
        title: "SIGMA visualization 3",
        hAxis: {
          title: "Time",
          viewWindow: {
            min: 30,
            max: 100
          }
        },
        vAxis: {
          title: "SIGMA"
        },
        seriesType: "candlesticks",
        series: {
          1: { type: "line" },
          2: { type: "line" },
          3: { type: "line" },
          4: { type: "line" },
          5: { type: "line" },
          6: { type: "line" },
          7: { type: "line" },
          8: { type: "line" },
          9: { type: "line" }
          // 10: { type: "line" }
        },
        legend: "none",
        width: "1000px",
        height: "700px"
      }
    };
    // this.preparePureVwap()
    // this.prepareCandleVwap()
    // this.prepareCandleSigmaVwap()
    // this.prepareAllData()
  }

  componentDidMount() {
    this.preparePureVwap();
    this.prepareCandleVwap();
    this.prepareCandleSigmaVwap();
    this.prepareAllData();
  }

  preparePureVwap = () => {
    let data = this.state.data;
    let header = data[0];
    var vwapIndex = 0;
    var dateIndex = 0;
    for (var indexNo in header) {
      if (header[indexNo] === "VWAP") {
        vwapIndex = indexNo;
        //   break;
      } else if (header[indexNo] === "date") {
        dateIndex = indexNo;
      }
    }
    console.log("vwapIndex:", vwapIndex);
    var pureVwapData = [];
    for (var element in data) {
      var localArray = [];
      localArray.push(data[element][dateIndex]);
      localArray.push(data[element][vwapIndex]);
      pureVwapData.push(localArray);
    }
    console.log("pureVwapData", typeof pureVwapData, pureVwapData);
    this.setState({ pureVwapData });
  };
  prepareCandleVwap = () => {
    let data = this.state.data;
    let header = data[0];
    var dateIndex = 0;
    var openIndex = 0;
    var highIndex = 0;
    var lowIndex = 0;
    var closeIndex = 0;
    var vwapIndex = 0;
    for (var indexNo in header) {
      if (header[indexNo] === "VWAP") {
        vwapIndex = indexNo;
        //   break;
      } else if (header[indexNo].toLowerCase() === "date") {
        dateIndex = indexNo;
      } else if (header[indexNo].toLowerCase() === "open") {
        openIndex = indexNo;
      } else if (header[indexNo].toLowerCase() === "high") {
        highIndex = indexNo;
      } else if (header[indexNo].toLowerCase() === "low") {
        lowIndex = indexNo;
      } else if (header[indexNo].toLowerCase() === "close") {
        closeIndex = indexNo;
      }
    }
    console.log(
      "The indexes are:",
      dateIndex,
      openIndex,
      highIndex,
      lowIndex,
      closeIndex,
      vwapIndex
    );
    var candleVwapData = [];
    for (var element in data) {
      var localArray = [];
      localArray.push(data[element][dateIndex]);
      localArray.push(data[element][openIndex]);
      localArray.push(data[element][highIndex]);
      localArray.push(data[element][lowIndex]);
      localArray.push(data[element][closeIndex]);
      localArray.push(data[element][vwapIndex]);
      candleVwapData.push(localArray);
    }
    console.log("candleVwapData", typeof candleVwapData, candleVwapData);
    this.setState({ candleVwapData });
  };
  prepareCandleSigmaVwap = () => {
    let data = this.state.data;
    let header = data[0];
    var dateIndex = 0;
    var vwapIndex = 0;
    var p_0_5_Index = 0;
    var p_1_0_Index = 0;
    var p_1_5_Index = 0;
    var p_2_0_Index = 0;
    var n_0_5_Index = 0;
    var n_1_0_Index = 0;
    var n_1_5_Index = 0;
    var n_2_0_Index = 0;
    var openIndex = 0;
    var highIndex = 0;
    var lowIndex = 0;
    var closeIndex = 0;
    for (var indexNo in header) {
      if (header[indexNo] === "VWAP") {
        vwapIndex = indexNo;
      } else if (header[indexNo].toLowerCase() === "date") {
        dateIndex = indexNo;
      } else if (header[indexNo].toLowerCase() === "open") {
        openIndex = indexNo;
      } else if (header[indexNo].toLowerCase() === "high") {
        highIndex = indexNo;
      } else if (header[indexNo].toLowerCase() === "low") {
        lowIndex = indexNo;
      } else if (header[indexNo].toLowerCase() === "close") {
        closeIndex = indexNo;
      } else if (header[indexNo].toLowerCase() === "p_sigma_0_5") {
        p_0_5_Index = indexNo;
      } else if (header[indexNo].toLowerCase() === "p_sigma_1_0") {
        p_1_0_Index = indexNo;
      } else if (header[indexNo].toLowerCase() === "p_sigma_1_5") {
        p_1_5_Index = indexNo;
      } else if (header[indexNo].toLowerCase() === "p_sigma_2_0") {
        p_2_0_Index = indexNo;
      } else if (header[indexNo].toLowerCase() === "n_sigma_0_5") {
        n_0_5_Index = indexNo;
      } else if (header[indexNo].toLowerCase() === "n_sigma_1_0") {
        n_1_0_Index = indexNo;
      } else if (header[indexNo].toLowerCase() === "n_sigma_1_5") {
        n_1_5_Index = indexNo;
      } else if (header[indexNo].toLowerCase() === "n_sigma_2_0") {
        n_2_0_Index = indexNo;
      }
    }
    var candleSigmaVwapData = [];
    for (var element in data) {
      var localArray = [];
      localArray.push(data[element][dateIndex]);
      localArray.push(data[element][openIndex]);
      localArray.push(data[element][highIndex]);
      localArray.push(data[element][lowIndex]);
      localArray.push(data[element][closeIndex]);
      localArray.push(data[element][vwapIndex]);
      localArray.push(data[element][p_0_5_Index]);
      localArray.push(data[element][p_1_0_Index]);
      localArray.push(data[element][p_1_5_Index]);
      localArray.push(data[element][p_2_0_Index]);
      localArray.push(data[element][n_0_5_Index]);
      localArray.push(data[element][n_1_0_Index]);
      localArray.push(data[element][n_1_5_Index]);
      localArray.push(data[element][n_2_0_Index]);
      candleSigmaVwapData.push(localArray);
    }
    console.log(
      "candleSigmaVwapData",
      typeof candleSigmaVwapData,
      candleSigmaVwapData
    );
    this.setState({ candleSigmaVwapData });
  };
  prepareAllData = () => {
    return null;
  };
  render() {
    return (
      <div>
        <Chart
          chartType={"LineChart"}
          options={this.state.pureVwapOptions}
          data={this.state.pureVwapData}
          loader={<div>Loading Chart</div>}
          //   width={"1000px"}
          //   height={"400px"}
          rootProps={{ "data-testid": "1" }}
        />
        <Chart
          options={this.state.candleVwapOptions}
          chartType="ComboChart"
          loader={<div>Loading Chart</div>}
          data={this.state.candleVwapData}
          rootProps={{ "data-testid": "1" }}
        />
        <Chart
          options={this.state.candleSigmaVwapOptions}
          chartType="ComboChart"
          loader={<div>Loading Chart</div>}
          data={this.state.candleSigmaVwapData}
          rootProps={{ "data-testid": "1" }}
        />
        {/* <Chart
          width="1000px"
          height="700px"
          chartType="CandlestickChart"
          loader={<div>Loading Chart</div>}
          data={[
            ["day", "a", "b", "c", "d"],
            ["Mon", 20, 28, 38, 45],
            ["Tue", 31, 38, 55, 66],
            ["Wed", 50, 55, 77, 80],
            ["Thu", 77, 77, 66, 50],
            ["Fri", 68, 66, 22, 15]
          ]}
          //   options={{
          //     legend: "none"
          //   }}
          rootProps={{ "data-testid": "1" }}
        /> */}
        {/* <Chart
          width={"500px"}
          height={"300px"}
          chartType="ComboChart"
          loader={<div>Loading Chart</div>}
          data={[
            [
              "Month",
              "Bolivia",
              "Ecuador",
              "Madagascar",
              "Papua New Guinea",
              "Rwanda",
              "Average"
            ],
            ["2004/05", 165, 938, 522, 998, 450, 614.6],
            ["2005/06", 135, 1120, 599, 1268, 288, 682],
            ["2006/07", 157, 1167, 587, 807, 397, 623],
            ["2007/08", 139, 1110, 615, 968, 215, 609.4],
            ["2008/09", 136, 691, 629, 1026, 366, 569.6]
          ]}
          options={{
            title: "Monthly Coffee Production by Country",
            vAxis: { title: "Cups" },
            hAxis: { title: "Month" },
            seriesType: "bars",
            series: { 5: { type: "column" } }
          }}
          rootProps={{ "data-testid": "1" }}
        /> */}
      </div>
    );
  }
}

export default Vwap;
