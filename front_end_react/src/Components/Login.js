import React from "react";
import { Form, Icon, Input, Button, Checkbox } from "antd";

import io from "socket.io-client";

class TestLogin extends React.Component {
  checkIfRegistered = values => {
    // var boolean = true;
    const socket = io("http://localhost:5000");

    let requestData =
      '{"HEADER":{"DATABASE":"stocks","TABLE_NAME":"users","REQUEST_TYPE":"select"},"DATA":{"FIELDS":["uid","name","password","email"],"SET":null,"WHERE":{' +
      '"email":"' +
      values.username +
      '","password":"' +
      values.password +
      '"}},"FOOTER":{"DATA ABOUT THE REQUEST":"ins_mock_data","COMMENT":"dbms_project","DEP":null,"UPDATE":null}}';
    socket.on("connect", () => {
      console.log("Working connection", socket.id);
      console.log("sending:", requestData);
      socket.send(requestData);
      // socket.close();
    });
    socket.on("message", message => {
      // console.log("Working connection", socket.id);
      // console.log("sending:", requestData);
      // socket.send(requestData);
      console.log("Got a response back from the server");
      socket.close();
      if (message.length > 0) {
        console.log("Length > 0");
        console.log("Yes he is registered!");
        localStorage.setItem("token", "data");
        this.props.updateLogin();
      } else {
        console.log("Length = 0/undefined");
      }
    });
    // return boolean;
  };
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
        //Fetch and check if hes present in the db
        this.checkIfRegistered(values);
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div
        style={{
          display: "flex",
          float: "center",
          justifyContent: "center",
          marginTop: "40px"
        }}
      >
        <Form
          onSubmit={this.handleSubmit}
          className="login-form"
          style={{ "max-width": "300px", justifyContent: "center" }}
        >
          <Form.Item>
            {getFieldDecorator("username", {
              rules: [
                { required: true, message: "Please input your username!" }
              ]
            })(
              <Input
                prefix={
                  <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                placeholder="Username"
              />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator("password", {
              rules: [
                { required: true, message: "Please input your Password!" }
              ]
            })(
              <Input
                prefix={
                  <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                type="password"
                placeholder="Password"
              />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator("remember", {
              valuePropName: "checked",
              initialValue: true
            })(<Checkbox>Remember me</Checkbox>)}
            {/* <a className="login-form-forgot" href="" style={{ float: "right" }}>
              Forgot password
            </a> */}
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              style={{ width: "100%" }}
            >
              Log in
            </Button>
            Or{" "}
            <a
              onClick={() => {
                this.props.updateToRegister();
              }}
            >
              register now!
            </a>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

const WrappedNormalLoginForm = Form.create({ name: "normal_login" })(TestLogin);

export default WrappedNormalLoginForm;
