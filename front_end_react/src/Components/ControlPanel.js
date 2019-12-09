import React, { Component } from "react";
import { Button, Row, Col } from "antd";

import io from "socket.io-client";

class ControlPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  handleInsertData = () => {
    console.log("Insert button clicked");

    const socket = io("http://localhost:5000");

    socket.on("connect", () => {
      console.log("Working connection", socket.id);
      socket.emit("insert_data", "no_data_to_be_sent");
      socket.close()
      // var stockName = "bhel";
      // let requestData =
      //   '{"HEADER":{"DATABASE":"stocks","TABLE_NAME":"final_' +
      //   stockName +
      //   '","REQUEST_TYPE":"select"},"DATA":{"FIELDS":["date","prev_close","open","high","low","close","VWAP","ln_returns","prev_volatility","daily_volatility","sigma_0_5","sigma_1_0","sigma_1_5","sigma_2_0","p_sigma_0_5","p_sigma_1_0","p_sigma_1_5","p_sigma_2_0","n_sigma_0_5","n_sigma_1_0","n_sigma_1_5","n_sigma_2_0","avg_gain","avg_loss","rs","rsi","vwap_3","vwap_5","vwap_7","vwap_11","vwap_13","vwap_17","vwap_21"],"SET":null,"WHERE":{"__QUERY__":"`date` BETWEEN \'2019-04-01\' AND \'2019-10-20\'"}},"FOOTER":{"DATA ABOUT THE REQUEST":"ins_mock_data","COMMENT":"dbms_project","DEP":null,"UPDATE":null}}';
      // console.log("sending:", requestData);
      // socket.send(requestData);
    });

    // socket.on("my response", message => {
    //   console.log("got a response from the server:", message);
    // });

    // socket.on("message", message => {
    //   console.log("The message from the server is:", message);
    //   let messageObject = JSON.parse(message.toString());
    //   this.convertToGoogleData(messageObject);
    //   console.log(typeof messageObject);
    //   this.setState({ messageObject });
    //   this.prepareData();
    //   this.prepareCols();
    // });
  };
  handleDeleteData = () => {
    console.log("Delete button clicked");
    const socket = io("http://localhost:5000");

    socket.on("connect", () => {
      console.log("Working connection", socket.id);
      socket.emit("delete_data", "no_data_to_be_sent");
      socket.close()
      // var stockName = "bhel";
      // let requestData =
      //   '{"HEADER":{"DATABASE":"stocks","TABLE_NAME":"final_' +
      //   stockName +
      //   '","REQUEST_TYPE":"select"},"DATA":{"FIELDS":["date","prev_close","open","high","low","close","VWAP","ln_returns","prev_volatility","daily_volatility","sigma_0_5","sigma_1_0","sigma_1_5","sigma_2_0","p_sigma_0_5","p_sigma_1_0","p_sigma_1_5","p_sigma_2_0","n_sigma_0_5","n_sigma_1_0","n_sigma_1_5","n_sigma_2_0","avg_gain","avg_loss","rs","rsi","vwap_3","vwap_5","vwap_7","vwap_11","vwap_13","vwap_17","vwap_21"],"SET":null,"WHERE":{"__QUERY__":"`date` BETWEEN \'2019-04-01\' AND \'2019-10-20\'"}},"FOOTER":{"DATA ABOUT THE REQUEST":"ins_mock_data","COMMENT":"dbms_project","DEP":null,"UPDATE":null}}';
      // console.log("sending:", requestData);
      // socket.send(requestData);
    });
  };
  render() {
    return (
      <Row gutter={[24, 24]}>
        <Col
          span={24}
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "40px"
          }}
        >
          <Button type="primary" onClick={this.handleInsertData}>
            Insert Data
          </Button>
        </Col>
        <Col
          span={24}
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "40px"
          }}
        >
          <Button type="danger" onClick={this.handleDeleteData}>
            Delete data
          </Button>
        </Col>
      </Row>
    );
  }
}

export default ControlPanel;
