import React, { Component } from "react";
import { Chart } from "react-google-charts";
// import { DatePicker } from "antd";
// import LowerPanel from "./LowerPanel";
import { Row, Col } from "antd";
// import moment from 'moment';

// const { RangePicker } = DatePicker;
const width = "100%";
const height = "400px";
// const dateFormat = "YYYY/MM/DD";

class ChartComponent extends Component {
  constructor(props) {
    console.log("constructor",props)
    console.log("The arguments are:",props)
    console.log("The china argument is:",props.china)
    super(props);
    this.state = {
      chartType: "ScatterChart",
      title: "No Title specified",
      vTitle: "No title",
      options: {
        title: "No Title specified",
        hAxis: {
          title: "No title"
        },
        vAxis: {
          title: "No title"
        },
        width: width,
        height: height
      },
      data: [
        ["number", "dogs"],
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
      startDate: null,
      endDate: null,
      spanValue: 24
    };
  }

  componentDidMount = () => {
    this.func("Hello", "how", "are");
  };
  onChange = (date, dateString) => {
    // console.log("What is this?:", date, dateString);
    // console.log(dateString["0"]);
    let startDate = dateString["0"];
    let endDate = dateString["1"];
    this.setState({ startDate });
    this.setState({ endDate });
  };
  func = (title, xTitle, yTitle) => {
    this.setState({ title });
    this.setState({ xTitle });
    this.setState({ yTitle });
  };

  render() {
    return (
      <div style={{ width: "1000px", margin: "auto" }}>
        {/* <span>This is being developed as of now</span> */}
        {/* <span> */}
        <Row>
          <Chart
            chartType={this.state.chartType}
            options={this.state.options}
            data={this.state.data}
            loader={<div style={{ margin: "150px" }}>Loading Chart</div>}
            // width={"1000px"}
            // height={"400px"}
            rootProps={{ "data-testid": "1" }}
          />
        </Row>
        {/* <Row>
          <Col span={this.state.spanValue}>
            <RangePicker
              defaultValue={[
                moment("2019/04/01", dateFormat),
                moment("2015/01/01", dateFormat)
              ]}
              format={dateFormat}
              style={{ width: "100%" }}
              onChange={this.onChange}
            />
          </Col>
          <Col span={12}>
        <LowerPanel />
        </Col>
        </Row> */}
        {/* </span> */}
      </div>
    );
  }
}

export default ChartComponent;
