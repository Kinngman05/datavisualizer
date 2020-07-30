import React, { Component } from "react";
import GoogleChartElementNew from "./ChartElements/GoogleChartElementNew";

class Visualization extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <GoogleChartElementNew />;
  }
}

export default Visualization;
