import React, { Component } from "react";
import { Descriptions } from "antd";

class DatabaseDescription extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data,
    };
  }
  render() {
    return (
      <div>
        <h1>HELLO?</h1>
        {console.log("----->", this.state.data)}
        {this.state.data.map((info) => {
          return (
            <Descriptions title={info.database_name}>
              <Descriptions.Item label="UserName">
                Zhou Maomao
              </Descriptions.Item>
              <Descriptions.Item label="Telephone">
                1810000000
              </Descriptions.Item>
              <Descriptions.Item label="Live">
                Hangzhou, Zhejiang
              </Descriptions.Item>
              <Descriptions.Item label="Remark">empty</Descriptions.Item>
              <Descriptions.Item label="Address">
                No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China
              </Descriptions.Item>
            </Descriptions>
          );
        })}
      </div>
    );
  }
}

export default DatabaseDescription;
