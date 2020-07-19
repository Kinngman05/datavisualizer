import React, { Component } from "react";
import {
  Form,
  Input,
  Button,
  Space,
  PageHeader,
  Descriptions,
  Select,
  Divider,
  message,
  Tabs,
  Upload,
} from "antd";
import "./css/DatabaseSettings.css";
import UploadData from "./UploadData";
import {
  MinusCircleOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import io from "socket.io-client";

const { Option } = Select;
const { TabPane } = Tabs;

class DatabaseSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      componentSize: "middle",
      queries: [],
      items: [],
      name: "",
      ifDisabled: true,
      fileList: [],
      uploading: false,
    };

    let formRef = React.createRef();
    this.setState({ formRef });
    const socket = io("http://192.168.31.50:5000");
    // this.setState({ socket });

    socket.on("connect", () => {
      // console.log("Working connection", socket.id);
      socket.emit("settings", JSON.stringify({ type: "request" }));
    });

    socket.on("result", (result) => {
      console.log(result);
      // query = this.converte
      // this.setState({ queries: [...this.state.queries, query] });
      socket.disconnect();
    });
  }

  onFinish = (query) => {
    console.log("Finished", query);
    console.log("a", this.state.queries);
    if (query.database_name === undefined) {
      message.error("No database seelected, please create/choose one!");
    } else {
      this.setState({ queries: [...this.state.queries, query] });
    }
    console.log("b", this.state.queries);
  };

  buildBackendQuery = () => {
    let before =
      '{"databases":{"' + this.state.queries[0].database_name + '":{"tables":{';
    // console.log("hmmmmmm", this.state.queries[0].attributes);
    // let zamba = this.state.queries[0].attributes
    //   .map((item) => JSON.stringify(item));
    // console.log("zamba", zamba);
    let something = this.state.queries.map(
      (query) =>
        '"' +
        query.table_name +
        '":{"table_constrains":' +
        // JSON.stringify(query.attributes[index][index]) +
        query.attributes.map((item) => JSON.stringify(item)).join(",") +
        // x.map((item,index)=> JSON.stringify(item[index]))
        ',"read_list":null,"index_constrains":null,"primary_key":"' +
        query.primary_key +
        '","foreign_key":null,"initial_data":null}'
    );
    let after = "}}}}";
    let backendQuery = before + something + after;
    console.log("blah", something);
    console.log("blah", backendQuery);
    this.setState({ backendQuery });
    //   '{"HEADER":{"DATABASE":"+''+","TABLE_NAME":"+''+","REQUEST_TYPE":"create"},
    //   "DATA":{"FIELDS":["*"],"SET":null,"WHERE":null},
    //   "FOOTER":{"DATA ABOUT THE REQUEST":"N","COMMENT":"N","DEP":null,"UPDATE":null}}'
    // )
  };

  finishAction = () => {
    console.log("X", this.state.queries);
    this.buildBackendQuery();

    const socket = io("http://localhost:5000");
    socket.on("connect", () => {
      // console.log("Working connection", socket.id);
      socket.emit("message", JSON.stringify(this.backendQuery));
    });

    socket.on("result", (result) => {
      console.log(result);
      socket.disconnect();
    });
  };

  onNameChange = (event) => {
    if (event.target.value.length === 0) {
      message.error("This field should not be empty");
      this.setState({ ifDisabled: true });
    } else {
      this.setState({ ifDisabled: false });
    }
    this.setState({
      name: event.target.value,
    });
  };

  addItem = () => {
    console.log("addItem");
    const { items, name } = this.state;
    this.setState({
      items: [...items, name],
      name: "",
    });
    this.setState({ ifDisabled: true });
  };
  callback = (key) => {
    console.log(key);
  };

  render() {
    const { items, name } = this.state;
    const props1 = {
      name: "file",
      action: "http://localhost:5000/upload",
      headers: {
        authorization: "authorization-text",
      },
      onChange(info) {
        if (info.file.status !== "uploading") {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === "done") {
          message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === "error") {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };
    return (
      <div>
        <PageHeader
          className="site-page-header"
          // onBack={() => null}
          title="Database Settings"
          // subTitle="This is a subtitle"
        />
        <Tabs defaultActiveKey="1" onChange={this.callback} type="card">
          <TabPane tab="Settings" key="1">
            {this.state.queries.map((info) => {
              return (
                <div className="site-page-header-ghost-wrapper">
                  <PageHeader
                    ghost={false}
                    // onBack={() => window.history.back()}
                    title={info.database_name + "." + info.table_name}
                    // subTitle="This is a subtitle"
                    extra={[
                      <Button key="1000" type="primary">
                        Update
                      </Button>,
                    ]}
                  >
                    <Descriptions size="small" column={3}>
                      {info.attributes.map((attr, index) => {
                        return (
                          <Descriptions.Item
                            key={index}
                            label={"Attribute " + (index + 1)}
                          >
                            {attr.attribute} {attr.dataType}
                          </Descriptions.Item>
                        );
                      })}
                    </Descriptions>
                  </PageHeader>
                </div>
              );
            })}
            <Form
              ref={this.formRef}
              labelCol={{
                span: 4,
              }}
              wrapperCol={{
                span: 20,
              }}
              onFinish={this.onFinish}
              layout="horizontal"
              initialValues={{
                size: this.componentSize,
              }}
              size={this.componentSize}
              autoComplete="off"
              scrollToFirstError={true}
            >
              <Form.Item
                label="Database Name"
                name="database_name"
                required={true}
              >
                <Select
                  style={{ width: 250 }}
                  placeholder="select/add database"
                  // allowClear={true}
                  dropdownRender={(menu) => (
                    <div>
                      {menu}
                      <Divider style={{ margin: "4px 0" }} />
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "nowrap",
                          padding: 8,
                        }}
                      >
                        <Input
                          style={{ flex: "auto" }}
                          defaultValue="database_name"
                          value={name}
                          onChange={this.onNameChange}
                        />
                        <a
                          style={{
                            flex: "none",
                            padding: "8px",
                            display: "block",
                            cursor: "pointer",
                          }}
                          disabled={this.state.ifDisabled}
                          onClick={this.addItem}
                        >
                          <PlusOutlined /> Add database
                        </a>
                      </div>
                    </div>
                  )}
                >
                  {items.map((item) => (
                    <Option key={item}>
                      {item}
                      <MinusCircleOutlined
                        style={{
                          alignSelf: "flex-end",
                        }}
                        onClick={() => {
                          let indexElement = items.indexOf(item);
                          items.splice(indexElement, 1);
                          this.setState({ items });
                          message.warning("Please select a different database");
                        }}
                      />
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              {/* <Form.Item label="Database Name" name="database_name" required={true}>
            <Input />
          </Form.Item> */}
              <Form.Item label="Table Name" name="table_name" required={true}>
                <Input />
              </Form.Item>
              <Form.List name="attributes">
                {(fields, { add, remove }) => {
                  return (
                    <div>
                      {fields.map((field, index) => (
                        <Form.Item
                          // {...(index === 0
                          //   ? formItemLayout
                          //   : formItemLayoutWithOutLabel)}
                          label={
                            index === 0
                              ? "Attribute " + (index + 1) + " Name"
                              : "Attribute " + (index + 1) + " Name"
                          }
                          required={false}
                          key={field.key}
                        >
                          <Space
                            key={field.key}
                            style={{ display: "flex", marginBottom: 4 }}
                            align="start"
                          >
                            <Form.Item
                              {...field}
                              name={[field.name, "attribute"]}
                              fieldKey={[field.fieldKey, "attribute"]}
                              rules={[
                                {
                                  required: true,
                                  message: "Missing attribute name",
                                },
                              ]}
                            >
                              <Input placeholder="Attribute Name" />
                            </Form.Item>
                            <Form.Item
                              {...field}
                              name={[field.name, "dataType"]}
                              fieldKey={[field.fieldKey, "dataType"]}
                              rules={[
                                {
                                  required: true,
                                  message: "Missing data type",
                                },
                              ]}
                            >
                              <Input placeholder="Data Type" />
                            </Form.Item>

                            <MinusCircleOutlined
                              onClick={() => {
                                remove(field.name);
                              }}
                            />
                          </Space>
                        </Form.Item>
                      ))}

                      <Form.Item>
                        <Button
                          type="dashed"
                          onClick={() => {
                            add();
                          }}
                          block
                        >
                          <PlusOutlined /> Add Attribute
                        </Button>
                      </Form.Item>
                    </div>
                  );
                }}
              </Form.List>
              <Form.Item label="Read List" name="read_list">
                <Input defaultValue="null" disabled />
              </Form.Item>
              <Form.List name="index_constrains">
                {(fields, { add, remove }) => {
                  return (
                    <div>
                      {fields.map((field, index) => (
                        <Form.Item
                          // {...(index === 0
                          //   ? formItemLayout
                          //   : formItemLayoutWithOutLabel)}
                          label={
                            index === 0
                              ? "Index " + (index + 1) + " Name"
                              : "Index " + (index + 1) + " Name"
                          }
                          required={false}
                          key={field.key}
                        >
                          <Space
                            key={field.key}
                            style={{ display: "flex", marginBottom: 4 }}
                            align="start"
                          >
                            <Form.Item
                              {...field}
                              name={[field.name, "index"]}
                              fieldKey={[field.fieldKey, "index"]}
                              rules={[
                                {
                                  required: true,
                                  message: "Missing index name",
                                },
                              ]}
                            >
                              <Input placeholder="Index Name" />
                            </Form.Item>
                            <MinusCircleOutlined
                              onClick={() => {
                                remove(field.name);
                              }}
                            />
                          </Space>
                        </Form.Item>
                      ))}

                      <Form.Item>
                        <Button
                          type="dashed"
                          onClick={() => {
                            add();
                          }}
                          block
                        >
                          <PlusOutlined /> Add Index
                        </Button>
                      </Form.Item>
                    </div>
                  );
                }}
              </Form.List>
              <Form.Item label="Primary Key" name="primary_key">
                <Input />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Add table
                </Button>
                {/* <Button type="primary" >
              Reset
            </Button> */}
              </Form.Item>
            </Form>
            <Button
              type="primary"
              htmlType="button"
              onClick={this.finishAction}
              danger
            >
              Update Database
            </Button>
          </TabPane>
          <TabPane tab="Upload Data" key="2">
            <UploadData />
          </TabPane>
          <TabPane tab="Schema" key="3">
            Content of Tab Pane 3
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default DatabaseSettings;
