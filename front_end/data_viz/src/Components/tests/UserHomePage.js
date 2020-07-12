import React, { Component } from "react";
import { Layout, Menu, Button } from "antd";
// import io from "socket.io-client";
const { Header } = Layout;

class UserHomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <reactElement>
        <Header className="header">
          {/* <div>
            <image src={logo} width="48px" height="48px"></image>
          </div> */}
          <Menu
            theme="dark"
            mode="horizontal"
            // defaultSelectedKeys={this.defaultPage}
            style={{ lineHeight: "64px" }}
            // onClick={this.onClick}
            // onChange={this.onChangeMenuOption}
          >
            <Menu.Item key="0">Tabular Data</Menu.Item>
            <Menu.Item key="1">Visualization</Menu.Item>
            <Menu.Item key="2">Settings</Menu.Item>
            <Menu.Item key="3">CONTROL PANEL</Menu.Item>
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
            {/* <Button
              onClick={() => {
                this.props.updateLogout();
              }}
            >
              LOGOUT
            </Button> */}
          </Menu>
        </Header>
        {/* <h1 style={{ margin: "auto", "text-align": "center" }}>
          {this.state.stockName.toUpperCase()}
        </h1> */}
        {(() => {
          switch (this.state.currentPage) {
            case "0":
              return this.state.inputData.length > 0 &&
                this.state.inputCols.length > 0 ? (
                <h1>LMAO</h1>
                  // <TabularData
                //   inputData={this.state.inputData}
                //   inputCols={this.state.inputCols}
                // />
              ) : (
                <p>"No data"</p>
              );
            // case "1":
            //   return this.state.data.length > 0 ? (
            //     <Vwap inputData={this.state.data} />
            //   ) : (
            //     <p>No data</p>
            //   );
            // case "2":
            //   return this.state.data.length > 0 ? (
            //     <RSI inputData={this.state.data} />
            //   ) : (
            //     <p>No data</p>
            //   );
            // case "3":
            //   return this.state.data.length > 0 ? (
            //     <ORGVWAP inputData={this.state.data} />
            //   ) : (
            //     <p>No data</p>
            //   );
            default:
              // return <ControlPanel />
              // return <ControlPanel />;
              return (<h1>HELLO</h1>)
          }
        })()}
      </reactElement>
    );
  }
}

export default UserHomePage;
