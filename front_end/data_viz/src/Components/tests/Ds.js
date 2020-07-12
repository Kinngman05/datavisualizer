import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Radio,
  Select,
  Cascader,
  DatePicker,
  InputNumber,
  TreeSelect,
  Switch,
  Space,
} from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};
const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 20, offset: 4 },
  },
};

const FormSizeDemo = () => {
  const [componentSize, setComponentSize] = useState("middle");

  const onFormLayoutChange = ({ size }) => {
    setComponentSize(size);
  };

  const onFinish = (values) => {
    console.log("Received values of form:", values);
  };

  return (
    <div>
      <Form
        labelCol={{
          span: 3,
        }}
        wrapperCol={{
          span: 10,
        }}
        // {...formItemLayoutWithOutLabel}
        onFinish={onFinish}
        layout="horizontal"
        initialValues={{
          size: componentSize,
        }}
        onValuesChange={onFormLayoutChange}
        size={componentSize}
        autoComplete="off"
      >
        {/* <Form.Item label="Form Size" name="size">
          <Radio.Group>
            <Radio.Button value="small">Small</Radio.Button>
            <Radio.Button value="middle">Middle</Radio.Button>
            <Radio.Button value="large">Large</Radio.Button>
          </Radio.Group>
        </Form.Item> */}
        <Form.Item label="Database Name" required={true}>
          <Input />
        </Form.Item>
        <Form.Item label="Table">
          <Switch checkedChildren="Yes" unCheckedChildren="No" />
        </Form.Item>
        <Form.Item>
          <Form.List name="table_names">
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
                          ? "Table " + (index + 1) + " Name"
                          : "Table " + (index + 1) + " Name"
                      }
                      required={true}
                      key={0 + field.key}
                    >
                      <Form.Item
                        {...field}
                        validateTrigger={["onChange", "onBlur"]}
                        rules={[
                          {
                            required: true,
                            whitespace: true,
                            message:
                              "Please input passenger's name or delete this field.",
                          },
                        ]}
                        noStyle
                      >
                        <Input
                          name={500+field.name}
                          placeholder="Table name"
                          style={{ width: "60%" }}
                        />
                        {fields.length > 0 ? (
                          <MinusCircleOutlined
                            className="dynamic-delete-button"
                            style={{ margin: "0 8px" }}
                            onClick={() => {
                              remove(field.name);
                            }}
                          />
                        ) : null}
                        <Form.List name="data_field">
                          {(subfields, { add, remove }) => {
                            return (
                              <div>
                                {subfields.map((subfield, index) => (
                                  <Space
                                    key={1000+subfield.key + index}
                                    style={{ display: "flex", marginBottom: 8 }}
                                    align="start"
                                  >
                                    <Form.Item
                                      {...subfield}
                                      name={[1500+subfield.name + index, "first"]}
                                      fieldKey={[
                                        subfield.fieldKey + index,
                                        "first",
                                      ]}
                                      rules={[
                                        {
                                          required: true,
                                          message: "Missing first ",
                                        },
                                      ]}
                                    >
                                      {subfield.key},{index},
                                      {subfield.key.toString() +
                                        index.toString()}
                                      ,{subfield.name}
                                      <Input placeholder="First " />
                                    </Form.Item>
                                    <Form.Item
                                      {...subfield}
                                      name={[2000+subfield.name + index, "last"]}
                                      fieldKey={[
                                        subfield.fieldKey + index,
                                        "last",
                                      ]}
                                      rules={[
                                        {
                                          required: true,
                                          message: "Missing last ",
                                        },
                                      ]}
                                    >
                                      <Input placeholder="Last " />
                                    </Form.Item>

                                    <MinusCircleOutlined
                                      onClick={() => {
                                        remove(subfield.name);
                                      }}
                                    />
                                  </Space>
                                ))}

                                <Form.Item>
                                  <Button
                                    type="dashed"
                                    onClick={() => {
                                      add();
                                    }}
                                    block
                                  >
                                    <PlusOutlined /> Add field
                                  </Button>
                                </Form.Item>
                              </div>
                            );
                          }}
                        </Form.List>
                      </Form.Item>
                    </Form.Item>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => {
                        add();
                      }}
                      style={{ width: "60%" }}
                    >
                      <PlusOutlined /> Add field
                    </Button>
                  </Form.Item>
                </div>
              );
            }}
          </Form.List>
        </Form.Item>
        {/* <Form.List name="users">
          {(fields, { add, remove }) => {
            return (
              <div>
                {fields.map((field) => (
                  <Space
                    key={field.key}
                    style={{ display: "flex", marginBottom: 8 }}
                    align="start"
                  >
                    <Form.Item
                      {...field}
                      name={[field.name, "first"]}
                      fieldKey={[field.fieldKey, "first"]}
                      rules={[
                        { required: true, message: "Missing first name" },
                      ]}
                    >
                      <Input placeholder="First Name" />
                    </Form.Item>
                    <Form.Item
                      {...field}
                      name={[field.name, "last"]}
                      fieldKey={[field.fieldKey, "last"]}
                      rules={[{ required: true, message: "Missing last name" }]}
                    >
                      <Input placeholder="Last Name" />
                    </Form.Item>

                    <MinusCircleOutlined
                      onClick={() => {
                        remove(field.name);
                      }}
                    />
                  </Space>
                ))}

                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => {
                      add();
                    }}
                    block
                  >
                    <PlusOutlined /> Add field
                  </Button>
                </Form.Item>
              </div>
            );
          }}
        </Form.List> */}
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
        {/* <Form.Item label="Select">
          <Select>
            <Select.Option value="demo">Demo</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="TreeSelect">
          <TreeSelect
            treeData={[
              {
                title: 'Light',
                value: 'light',
                children: [
                  {
                    title: 'Bamboo',
                    value: 'bamboo',
                  },
                ],
              },
            ]}
          />
        </Form.Item>
        <Form.Item label="Cascader">
          <Cascader
            options={[
              {
                value: 'zhejiang',
                label: 'Zhejiang',
                children: [
                  {
                    value: 'hangzhou',
                    label: 'Hangzhou',
                  },
                ],
              },
            ]}
          />
        </Form.Item>
        <Form.Item label="DatePicker">
          <DatePicker />
        </Form.Item>
        <Form.Item label="InputNumber">
          <InputNumber />
        </Form.Item>
        <Form.Item label="Switch">
          <Switch />
        </Form.Item>
        <Form.Item label="Button">
          <Button>Button</Button>
        </Form.Item> */}
      </Form>
    </div>
  );
};

export default FormSizeDemo;
