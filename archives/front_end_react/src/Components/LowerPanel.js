import React, { Component } from "react";
// import {Helmet} from "react-helmet";
// import React from 'react';
// import ReactDOM from 'react-dom';
import { DatePicker, message } from "antd";
// import 'antd/dist/antd.css';
// import '../index.css';

const { RangePicker } = DatePicker;

class LowerPanel extends Component {
  state = {
    // date: null,
    startDate: null,
    endDate: null
  };


  onChange = (date, dateString) => {
    // console.log("What is this?:", date, dateString);
    // console.log(dateString["0"]);
    let startDate = dateString["0"];
    let endDate = dateString["1"];
    this.setState({ startDate });
    this.setState({ endDate });
  };

  render() {
    // const { startDate, endDate } = this.state;
    return (
      // <div style={{ width: "100%"}}>
          <RangePicker style={{width:"100%"}} onChange={this.onChange} />
      // </div>
    );
  }
}

export default LowerPanel;
