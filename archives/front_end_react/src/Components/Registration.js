import React, { Component } from "react";
import { Form, Icon, Button, Card, Input } from "antd";
import io from "socket.io-client";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  sendDataToDb = values => {
    console.log("Tesing console.log-2");
    var requestData =
      '{"HEADER":{"DATABASE":"stocks","TABLE_NAME":"users","REQUEST_TYPE":"insert"},"DATA":{"FIELDS":{' +
      '"uid":"' +
      values.username.slice(0, 10) +
      '","name":"' +
      values.username +
      '","password":"' +
      values.password +
      '","email":"' +
      values.email +
      '"},"SET":null,"WHERE":null},"FOOTER":{"DATA ABOUT THE REQUEST":"ins_mock_data","COMMENT":"dbms_project","DEP":null,"UPDATE":null}}';
    console.log("The json is:", JSON.stringify(requestData));
    //Write code here to send data to the back end
    const socket = io("http://localhost:5000");

    socket.on("connect", () => {
      console.log("Working connection", socket.id);
      console.log("sending:", requestData);
      socket.send(requestData);
      socket.close();
    });
    // socket.close();
    // socket.on("message", () => {
    //   console.log("Closing the socketio connection.")
    //   socket.close();
    // });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
        console.log("Tesing console.log-1");
        this.sendDataToDb(values);
        console.log("Tesing console.log-10");
      }
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <section
        className="hero is-fullheight"
        // style={{ backgroundColor: "#0B132B" }}
      >
        <h1 className="is-size-1" style={{ color: "black" }}>
          DATAVIZ
        </h1>
        <div className="hero-body">
          <div className="container">
            <div className="columns">
              <div className="column is-5 is-offset-7">
                <Card bordered={false}>
                  <h1
                    className="is-size-2"
                    style={{ color: "white", textAlign: "center" }}
                  >
                    Register
                  </h1>
                  <Form
                    onSubmit={this.handleSubmit}
                    style={{ "max-width": "300px", justifyContent: "center" }}
                  >
                    <Form.Item label="Email">
                      {getFieldDecorator("email", {
                        rules: [
                          {
                            required: true,
                            message: "Please enter your email!"
                          }
                        ]
                      })(
                        <Input
                          prefix={
                            <Icon
                              type="mail"
                              style={{ color: "rgba(0,0,0,.25)" }}
                            />
                          }
                          placeholder="Email"
                        />
                      )}
                    </Form.Item>
                    <Form.Item label="Username">
                      {getFieldDecorator("username", {
                        rules: [
                          {
                            required: true,
                            message: "Please enter your username!"
                          }
                        ]
                      })(
                        <Input
                          prefix={
                            <Icon
                              type="text"
                              style={{ color: "rgba(0,0,0,.25)" }}
                            />
                          }
                          placeholder="Name"
                        />
                      )}
                    </Form.Item>
                    <Form.Item label="Password">
                      {getFieldDecorator("password", {
                        rules: [
                          {
                            required: true,
                            message: "Please enter your Password!"
                          }
                        ]
                      })(
                        <Input
                          prefix={
                            <Icon
                              type="mail"
                              style={{ color: "rgba(0,0,0,.25)" }}
                            />
                          }
                          placeholder="Email"
                        />
                      )}
                    </Form.Item>
                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        style={{
                          width: "100%"
                          // background: "#6FFFE9",
                          // border: "#6FFFE9",
                          // color: "#0B132B"
                        }}
                      >
                        Register
                      </Button>
                      <p style={{ color: "white" }}>
                        Already have an Account ?{" "}
                        {/* <Link to="/" style={{ color: "#6FFFE9" }}>
                          Login
                        </Link> */}
                      </p>
                    </Form.Item>
                  </Form>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
const WrappedNormalRegisterForm = Form.create({ name: "login" })(Register);

export default WrappedNormalRegisterForm;
