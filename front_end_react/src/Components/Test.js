import React, { Component } from "react";
// import { render } from "react-dom";
import { Chart } from "react-google-charts";
import io from "socket.io-client";


class Test extends Component {
  constructor(props) {
    super(props);

    this.state = {
      messageObject: {},
      lineOptions: {
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
      },
      lineData: [
        ["x", "dogs"],
        [0, 0],
        [1, 10],
        [2, 23],
        [3, 17],
        [4, 18],
        [5, 9],
        [6, 11],
        [7, 27],
        [8, 33],
        [9, 40],
        [10, 32],
        [11, 35]
      ],
      comboOptions: {
        chartType: "ComboChart",
        title: "VWAP visualization",
        hAxis: {
          title: "Time"
        },
        vAxis: {
          title: "VWAP"
        },
        width: "1000px",
        height: "700px"
      },
      comboData: [
        ["DATE", "OPEN", "HIGH", "LOW", "CLOSE", "VWAP"],
        ["19-7-4", 73.1, 73.15, 73.65, 72.45, 73.17],
        ["19-7-5", 70.15, 73.45, 73.5, 69.75, 71.93],
        ["19-7-8", 67.3, 69.5, 70.35, 66.6, 68.08],
        ["19-7-9", 67.2, 67.15, 67.75, 65.85, 66.78],
        ["19-7-10", 66.75, 67.95, 68.2, 66.2, 66.96],
        ["19-7-11", 65.05, 67.0, 67.15, 64.85, 65.38],
        ["19-7-12", 64.8, 65.0, 65.6, 64.4, 65.04],
        ["19-7-15", 64.25, 65.3, 65.55, 63.2, 64.08],
        ["19-7-16", 64.5, 64.35, 65.1, 63.9, 64.52],
        ["19-7-17", 64.1, 64.5, 64.9, 63.95, 64.31],
        ["19-7-18", 64.0, 64.1, 64.5, 63.5, 64.0],
        ["19-7-19", 63.7, 64.25, 64.45, 63.4, 63.95],
        ["19-7-22", 64.1, 64.0, 64.3, 62.95, 63.67],
        ["19-7-23", 63.9, 64.45, 64.5, 63.5, 64.02],
        ["19-7-24", 61.9, 64.05, 64.2, 61.5, 62.28],
        ["19-7-25", 61.15, 62.2, 62.4, 60.6, 61.4],
        ["19-7-26", 60.65, 61.2, 62.55, 60.3, 61.13],
        ["19-7-29", 59.25, 60.85, 61.05, 59.0, 59.73],
        ["19-7-30", 57.75, 59.45, 59.7, 57.5, 58.61],
        ["19-7-31", 58.9, 57.25, 59.05, 57.05, 58.17],
        ["19-8-1", 57.55, 58.35, 59.1, 56.55, 57.74],
        ["19-8-2", 56.5, 57.45, 57.55, 55.85, 56.6],
        ["19-8-5", 56.55, 55.95, 57.35, 54.6, 56.16],
        ["19-8-6", 57.3, 56.3, 57.6, 56.15, 56.91],
        ["19-8-7", 57.5, 57.5, 58.15, 56.0, 57.16],
        ["19-8-8", 58.35, 57.8, 58.6, 56.3, 57.59],
        ["19-8-9", 56.9, 58.6, 58.9, 56.2, 57.55],
        ["19-8-13", 50.55, 54.0, 56.5, 50.4, 52.62],
        ["19-8-14", 51.05, 50.85, 52.15, 50.6, 51.28],
        ["19-8-16", 51.35, 51.0, 51.8, 50.25, 51.12],
        ["19-8-19", 51.3, 51.4, 51.8, 50.9, 51.35],
        ["19-8-20", 49.95, 51.35, 51.55, 49.65, 50.44],
        ["19-8-21", 48.3, 49.9, 49.9, 47.5, 48.24],
        ["19-8-22", 48.0, 48.15, 48.8, 47.7, 48.2],
        ["19-8-23", 48.3, 48.0, 49.1, 46.65, 48.23],
        ["19-8-26", 50.0, 49.15, 50.35, 47.55, 48.95],
        ["19-8-27", 52.7, 50.7, 55.05, 50.5, 53.17],
        ["19-8-28", 51.35, 52.6, 53.4, 50.6, 51.61],
        ["19-8-29", 50.6, 51.35, 51.45, 50.0, 50.6],
        ["19-8-30", 50.55, 50.7, 51.2, 49.6, 50.32],
        ["19-9-3", 49.35, 50.4, 50.6, 49.05, 49.74],
        ["19-9-4", 50.1, 49.5, 50.25, 48.55, 49.23],
        ["19-9-5", 51.15, 50.5, 52.5, 50.4, 51.56],
        ["19-9-6", 51.8, 51.4, 52.1, 50.7, 51.5],
        ["19-9-9", 51.4, 52.05, 52.45, 51.2, 51.66],
        ["19-9-11", 51.95, 50.9, 52.3, 50.3, 51.64],
        ["19-9-12", 51.55, 51.9, 53.2, 51.2, 52.18],
        ["19-9-13", 51.65, 51.5, 52.0, 49.95, 51.11],
        ["19-9-16", 50.6, 51.0, 51.35, 50.45, 50.79],
        ["19-9-17", 48.75, 50.6, 50.85, 48.5, 49.65],
        ["19-9-18", 48.65, 49.0, 49.4, 48.4, 48.84],
        ["19-9-19", 47.4, 48.7, 48.75, 47.1, 47.66],
        ["19-9-20", 50.1, 47.55, 51.3, 46.6, 49.32],
        ["19-9-23", 51.8, 51.55, 52.15, 49.65, 51.07],
        ["19-9-24", 51.9, 51.9, 52.95, 50.8, 51.78],
        ["19-9-25", 50.15, 51.9, 51.9, 49.9, 50.66],
        ["19-9-26", 51.7, 50.1, 52.65, 49.9, 51.65],
        ["19-9-27", 50.0, 51.6, 52.1, 49.8, 50.96],
        ["19-9-30", 48.4, 50.1, 50.15, 47.5, 48.38],
        ["19-10-1", 46.85, 48.7, 49.6, 46.05, 47.82],
        ["19-10-3", 47.2, 46.7, 48.3, 46.2, 47.22],
        ["19-10-4", 45.9, 47.5, 48.0, 45.7, 46.72]
      ]
    };

    const socket = io("http://localhost:5000");

    socket.on("connect", () => {
      console.log("Working connection", socket.id);
      let requestData =
        '{"HEADER":{"DATABASE":"stocks","TABLE_NAME":"final","REQUEST_TYPE":"select"},"DATA":{"FIELDS":["date","VWAP"],"SET":null,"WHERE":{"__QUERY__":"`date` BETWEEN \'2019-04-01\' AND \'2019-10-20\'"}},"FOOTER":{"DATA ABOUT THE REQUEST":"ins_mock_data","COMMENT":"dbms_project","DEP":null,"UPDATE":null}}';
      console.log("sending:", requestData);
      socket.send(requestData);
    });

    socket.on("my response", message => {
      console.log("got a response from the server:", message);
    });

    socket.on("message", message => {
      console.log("The message from the server is:", message);
      let messageObject = JSON.parse(message.toString());
      this.convertToGoogleData(messageObject);
      console.log(typeof messageObject);
      this.setState({ messageObject });
    });
  }

  convertToGoogleData = inputObject => {
    console.log(inputObject);
    let obj = inputObject[0];
    var keys = [];
    var lineData = [];
    for (var k in obj) keys.push(k);
    console.log("The keys are:", keys);
    lineData.push(keys);
    console.log("lineData", lineData);
    for (var element in inputObject) {
      let eachElement = inputObject[element];
      // console.log(eachElement)
      var localList = [];
      for (var key in eachElement) {
        // console.log(eachElement[key])
        if (key !== "date") localList.push(parseFloat(eachElement[key]));
        else localList.push(eachElement[key]);
        // localList.push(this.convertToDateFormat(eachElement[key]))
      }
      lineData.push(localList);
    }
    console.log("lineData", lineData);
    // data = [data]
    console.log("lineData", lineData);
    console.log("The datatype of the second column is:", typeof lineData[0][1][1]);
    this.setState({ lineData });
  };

  convertToDateFormat = inputString => {
    let data = inputString.split("-");
    console.log(data);
    return new Date(data[0], data[1], data[2]);
  };

  render() {
    return (
      <div>
        <Chart
          chartType={"LineChart"}
          options={this.state.lineOptions}
          data={this.state.lineData}
          loader={<div>Loading Chart</div>}
          width={"1000px"}
          height={"400px"}
          rootProps={{ "data-testid": "1" }}
        />
        {/* <div id="chart_div"></div> */}
        <Chart
          chartType={"ComboChart"}
          options={this.state.comboOptions}
          data={this.state.comboData}
          loader={<div>Loading Chart</div>}
        />
      </div>
    );
  }
}

export default Test;

