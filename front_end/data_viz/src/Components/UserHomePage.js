import React, { Component } from "react";
import {
  Layout,
  Menu,
  Row,
  Col,
  PageHeader,
  Button,
  Descriptions,
  DatePicker,
  Dropdown,
  Select,
} from "antd";
import {
  TableOutlined,
  DatabaseOutlined,
  LineChartOutlined,
  UserOutlined,
  DownOutlined,
} from "@ant-design/icons";
import "./css/UserHomePage.css";
import io from "socket.io-client";
// import { queryBuilder } from './../UserDefinedModules/mysqlJsonQueryBuilder/index'
import TabularData from "./TabularData";
import DatabaseSettings from "./DatabaseSettings";
import Visualization1 from "./Visualization1";
const queryBuilder = require("mysqljsonquery");
// import UploadTest from "./UploadTest";

const { RangePicker } = DatePicker;
const { Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
const { Option } = Select;

class UserHomePageNew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: true,
      currentPage: "4",
      currentStock: "BHEL",
      availableStocks: ["BHEL", "TATA"],
      databaseInfo: {
        databaseName: "stocks",
        tableName: "stocks",
      },
      // defaultSelectedKeys: "2",
    };
    const socket = io("http://192.168.31.50:5000");
    let { databaseInfo } = this.state;

    let query = new queryBuilder.queyBuilder();
    query.setDatabase(databaseInfo.databaseName);
    query.setTableName(databaseInfo.tableName);
    query.setRequestType("select");
    query.setFields(["symbol"]);
    query.setComment("N");

    socket.on("connect", () => {
      console.log("Working connection", socket.id);
      socket.emit("query", query.buildQuery());
    });

    socket.on("result", (result) => {
      console.log("stocks:", result);
      let jsonResult = JSON.parse(result);
      socket.disconnect();
      var availableStocks = [];
      var element;
      for (element in jsonResult) {
        // console.log(jsonResult[element].symbol)
        availableStocks.push(jsonResult[element].symbol);
      }
      this.setState({ availableStocks });
    });
  }

  onCollapse = (collapsed) => {
    // if (collapsed) {
    //   console.log("Sider is collapsed");
    // } else {
    //   console.log("Sider is expanded");
    // }
    this.setState({ collapsed });
  };

  onClick = (obj) => {
    let currentPage = obj.key;
    console.log("Menu button was clicked:", currentPage);
    this.setState({ currentPage });
  };

  handleMenuClick = (currentStock) => {
    console.log("Selected:", currentStock);
    this.setState({ currentStock });
  };

  onChange = (value) => {
    console.log(`selected ${value}`);
  };

  makeOptions = () =>
    this.state.availableStocks.map((stock) => (
      <Option value={stock}>{stock}</Option>
    ));

  render() {
    let stockDropDown = (
      <Select
        showSearch
        style={{ width: 100 }}
        placeholder="Stock"
        optionFilterProp="children"
        onChange={this.onChange}
        // onFocus={this.onFocus}
        // onBlur={this.onBlur}
        // onSearch={this.onSearch}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {this.makeOptions()}
      </Select>
    );
    let pageDescriptionHeader = (
      <div className="site-page-header-ghost-wrapper">
        <PageHeader
          ghost={false}
          // onBack={() => window.history.back()}
          title={stockDropDown}
          // subTitle="This is a subtitle"
          extra={[
            <Button key="1" type="primary">
              Refresh
            </Button>,
          ]}
        >
          <Descriptions size="small" column={3}>
            {/* <Descriptions.Item label="Created">Lili Qu</Descriptions.Item> */}
            <Descriptions.Item label="Date">
              2020/01/10 - 2020/05/01
            </Descriptions.Item>
            <Descriptions.Item label="Range">
              <RangePicker size="small" />
            </Descriptions.Item>
            <Descriptions.Item label="Association">
              <a>421421</a>
            </Descriptions.Item>
            <Descriptions.Item label="Creation Time">
              2017-01-10
            </Descriptions.Item>
            <Descriptions.Item label="Effective Time">
              2017-10-10
            </Descriptions.Item>
            <Descriptions.Item label="Remarks">HELLO?</Descriptions.Item>
          </Descriptions>
        </PageHeader>
      </div>
    );
    return (
      <reactElement>
        <Layout style={{ minHeight: "100vh" }}>
          <Sider
            collapsible
            collapsed={this.state.collapsed}
            onCollapse={this.onCollapse}
          >
            <div className="logo" />
            <Menu
              theme="dark"
              defaultSelectedKeys={this.state.currentPage}
              mode="inline"
              onClick={this.onClick}
            >
              <Menu.Item key="1" icon={<UserOutlined />}>
                User
              </Menu.Item>
              <Menu.Item key="2" icon={<TableOutlined />}>
                Tabular Data
              </Menu.Item>
              <SubMenu
                key="3"
                icon={<LineChartOutlined />}
                title="Visulizations"
              >
                <Menu.Item key="3_1">1</Menu.Item>
                <Menu.Item key="3_2">2</Menu.Item>
                <Menu.Item key="3_3">3</Menu.Item>
              </SubMenu>
              <Menu.Item key="4" icon={<DatabaseOutlined />}>
                Database Settings
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout className="site-layout">
            <Content
              className="site-page-body-charts-wrapper"
              style={{ margin: "0 0px" }}
            >
              {(() => {
                switch (this.state.currentPage) {
                  case "1":
                    return (
                      <div>
                        <h6>STILL UNDER DEV</h6>
                        <Row gutter={[8, 32]}>
                          <Col span={24}>
                            <div
                              style={{
                                background: "#0092ff",
                                padding: "8px 0",
                              }}
                            >
                              ALOO1
                            </div>
                          </Col>
                        </Row>
                        <Row gutter={[8, 32]}>
                          <Col span={24}>
                            <div
                              style={{
                                background: "#0092ff",
                                padding: "8px 0",
                              }}
                            >
                              ALOO2
                            </div>
                          </Col>
                        </Row>
                      </div>
                    );
                  case "2":
                    return (
                      <TabularData
                        availableStocks={this.state.availableStocks}
                      />
                    );
                  case "3_1":
                    return (
                      <Visualization1
                        availableStocks={this.state.availableStocks}
                      />
                    );
                  case "3_2":
                    return pageDescriptionHeader;
                  case "3_3":
                    return pageDescriptionHeader;
                  case "4":
                    return <DatabaseSettings />;
                }
              })()}
            </Content>
            <Footer style={{ textAlign: "center" }}>
              Created by Tarun Gopalkrishna A
            </Footer>
          </Layout>
        </Layout>
      </reactElement>
    );
  }
}

export default UserHomePageNew;
