import React, { Component } from "react";
import { Layout, Menu, Select, Result } from "antd";
import {
  TableOutlined,
  DatabaseOutlined,
  LineChartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import "./css/UserHomePage.css";
import TabularData from "./TabularData";
import Database from "./Database";
import Visualization from "./Visualization";

const { Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
const { Option } = Select;

class UserHomePageNew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: true,
      currentPage: "4",
    };
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
    // console.log("Menu button was clicked:", currentPage);
    this.setState({ currentPage });
  };

  handleMenuClick = (currentStock) => {
    // console.log("Selected:", currentStock);
    this.setState({ currentStock });
  };

  onChange = (value) => {
    // console.log(`selected ${value}`);
  };

  makeOptions = () =>
    this.state.availableStocks.map((stock) => (
      <Option value={stock}>{stock}</Option>
    ));

  render() {
    return (
      <>
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
                      </div>
                    );
                  case "2":
                    return <TabularData />;
                  case "3_1":
                    return <Visualization />;
                  case "3_2":
                    return <Visualization />;
                  case "3_3":
                    return <Visualization />;
                  case "4":
                    return <Database />;
                  default:
                    return (
                      <Result
                        status="404"
                        title="404"
                        subTitle="Sorry, the page you visited does not exist."
                      />
                    );
                }
              })()}
            </Content>
            <Footer style={{ textAlign: "center" }}>
              Created by Tarun Gopalkrishna A
            </Footer>
          </Layout>
        </Layout>
      </>
    );
  }
}

export default UserHomePageNew;
