import React, { Component } from "react";
import { Layout, Menu, Button } from "antd";
// import { Select } from "antd";
import io from "socket.io-client";
/*
 * User defined code
 */
// import Test from "./Test";
import logo from '../Images/google.png'
import TabularData from "./TabularData";
// import ChartComponent from "./ChartComponent";
import Vwap from "./Vwap";
import RSI from "./RSI";
import ORGVWAP from "./ORGVWAP";
import ControlPanel from "./ControlPanel";
// import TestLogin from "./Login";
/*
 * CSS
 */
import "antd/dist/antd.css";

// const { Option } = Select;
// const { SubMenu, Content, Sider } = Menu;
const { Header } = Layout;

class Landing extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // defaultPage: ["1"],
      currentPage: "0",
      stockName: "BHEL",
      messageObject: [],
      inputData: [],
      inputCols: [],
      data: []
    };
    const socket = io("http://localhost:5000");

    socket.on("connect", () => {
      console.log("Working connection", socket.id);
      var stockName = "bhel";
      let requestData =
        '{"HEADER":{"DATABASE":"stocks","TABLE_NAME":"final_' +
        stockName +
        '","REQUEST_TYPE":"select"},"DATA":{"FIELDS":["date","prev_close","open","high","low","close","VWAP","ln_returns","prev_volatility","daily_volatility","sigma_0_5","sigma_1_0","sigma_1_5","sigma_2_0","p_sigma_0_5","p_sigma_1_0","p_sigma_1_5","p_sigma_2_0","n_sigma_0_5","n_sigma_1_0","n_sigma_1_5","n_sigma_2_0","avg_gain","avg_loss","rs","rsi","vwap_3","vwap_5","vwap_7","vwap_11","vwap_13","vwap_17","vwap_21"],"SET":null,"WHERE":{"__QUERY__":"`date` BETWEEN \'2019-04-01\' AND \'2019-10-20\'"}},"FOOTER":{"DATA ABOUT THE REQUEST":"ins_mock_data","COMMENT":"dbms_project","DEP":null,"UPDATE":null}}';
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
      this.prepareData();
      this.prepareCols();
    });
  }

  convertToGoogleData = inputObject => {
    // console.log(inputObject);
    let obj = inputObject[0];
    var keys = [];
    var data = [];
    for (var k in obj) keys.push(k);
    console.log("The keys are:", keys);
    this.setState({ keys });
    data.push(keys);
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
      data.push(localList);
    }
    this.setState({ data });
  };

  prepareData = () => {
    let data = this.state.messageObject;
    console.log("The data is:", data);
    var inputData = [];
    for (var element in data) {
      // console.log(element,data[element])
      let x = {};
      x["key"] = element;
      for (var subElement in data[element]) {
        // console.log("subElement",subElement)
        x[subElement] = data[element][subElement];
      }
      // console.log(x);
      inputData.push(x);
    }
    this.setState({ inputData });
  };

  prepareCols = () => {
    let cols = this.state.keys;
    // let cols = {hello:"Its me"};
    console.log("The columns are:", cols);
    var inputCols = [];
    for (var element in cols) {
      // console.log(element);
      let x = {};
      x["title"] = cols[element].toUpperCase();
      x["dataIndex"] = cols[element];
      x["key"] = cols[element];
      inputCols.push(x);
      // console.log("inputCols", inputCols);
    }
    this.setState({ inputCols });
  };

  onChange = stockName => {
    this.setState({ stockName });
    console.log(`selected ${stockName}`);
  };

  // onBlur = () => {
  //   console.log("blur");
  // };

  // onFocus = () => {
  //   console.log("focus");
  // };

  onSearch = val => {
    console.log("search:", val);
  };

  onClick = obj => {
    let currentPage = obj.key;
    console.log("Menu button was clicked:", currentPage);
    this.setState({ currentPage });
  };

  render() {
    return (
      <reactElement>
        <Header className="header">
          <div>
            <image src={logo} width="48px" height="48px"></image>
          </div>
          <Menu
            theme="dark"
            mode="horizontal"
            // defaultSelectedKeys={this.defaultPage}
            style={{ lineHeight: "64px" }}
            onClick={this.onClick}
            // onChange={this.onChangeMenuOption}
          >
            <Menu.Item key="0">Tabular Data</Menu.Item>
            <Menu.Item key="1">SIGMA</Menu.Item>
            <Menu.Item key="2">RSI</Menu.Item>
            <Menu.Item key="3">VWAP</Menu.Item>
            <Menu.Item key="4">CONTROL PANEL</Menu.Item>
            {/* <Menu.Item key="5">Yet to decide</Menu.Item> */}
            {/* <Select
              showSearch
              style={{ width: 200 }}
              placeholder="Select a stock"
              optionFilterProp="children"
              onChange={this.onChange}
              // onFocus={this.onFocus}
              // onBlur={this.onBlur}
              onSearch={this.onSearch}
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
            >
              <Option value="bhel">BHEL</Option>
              <Option value="reliance">RELIANCE</Option>
              <Option value="sbin">SBIN</Option>
              <Option value="icici">ICICI BANK</Option>
              <Option value="tata_elxsi">TATELXSI</Option>
              <Option value="maruthi">MARUTHI</Option>
              <Option value="not_decided">NOT DECIDED</Option>
            </Select> */}
          <Button onClick={()=>{this.props.updateLogout();}}>LOGOUT</Button>
          </Menu>
        </Header>
        <h1 style={{ margin: "auto", "text-align": "center" }}>
          {this.state.stockName.toUpperCase()}
        </h1>
        {(() => {
          switch (this.state.currentPage) {
            case "0":
              return this.state.inputData.length > 0 &&
                this.state.inputCols.length > 0 ? (
                <TabularData
                  inputData={this.state.inputData}
                  inputCols={this.state.inputCols}
                />
              ) : (
                <p>"No data"</p>
              );
            case "1":
              return this.state.data.length > 0 ? (
                <Vwap inputData={this.state.data} />
              ) : (
                <p>No data</p>
              );
            case "2":
              return this.state.data.length > 0 ? (
                <RSI inputData={this.state.data} />
              ) : (
                <p>No data</p>
              );
            case "3":
              return this.state.data.length > 0 ? (
                <ORGVWAP inputData={this.state.data} />
              ) : (
                <p>No data</p>
              );
            default:
              // return <ControlPanel />
              return <ControlPanel />;
          }
        })()}
      </reactElement>
    );
  }
}

export default Landing;
