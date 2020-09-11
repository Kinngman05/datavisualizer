import React, { Component } from "react";
import GoogleChartElement from "./ChartElements/GoogleChartElement";

class Visualization extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <GoogleChartElement />;
  }
}

export default Visualization;
