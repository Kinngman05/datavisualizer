// import { Table, Divider, Tag } from "antd";
import React, { Component } from "react";
import {
  Table,
  // Tag,
  // Descriptions,
  // Typography,
  // Button,
  // List,
  // Divider,
  // Row,
  // Col,
  // Spin
} from "antd";
// const { Title } = Typography;

// const dataSource = [
//   {
//     key: "1",
//     name: "John Brown",
//     age: 32,
//     address: "New York No. 1 Lake Park",
//     tags: ["nice", "developer"]
//   },
//   {
//     key: "2",
//     name: "Jim Green",
//     age: 42,
//     address: "London No. 1 Lake Park",
//     tags: ["loser"]
//   },
//   {
//     key: "3",
//     name: "Joe Black",
//     age: 32,
//     address: "Sidney No. 1 Lake Park",
//     tags: ["cool", "teacher"]
//   }
// ];
// const columns = [
//   {
//     title: "Name",
//     dataIndex: "name",
//     key: "name",
//     render: text => <a>{text}</a>
//   },
//   {
//     title: "Age",
//     dataIndex: "age",
//     key: "age"
//   },
//   {
//     title: "Address",
//     dataIndex: "address",
//     key: "address"
//   },
//   {
//     title: "Tags",
//     key: "tags",
//     dataIndex: "tags",
//     render: tags => (
//       <span>
//         {tags.map(tag => {
//           let color = tag.length > 5 ? "geekblue" : "green";
//           if (tag === "loser") {
//             color = "volcano";
//           }
//           return (
//             <Tag color={color} key={tag}>
//               {tag.toUpperCase()}
//             </Tag>
//           );
//         })}
//       </span>
//     )
//   },
//   {
//     title: "Action",
//     key: "action",
//     render: (text, record) => (
//       <span>
//         <a>{record.name}</a>
//       </span>
//     )
//   }
// ];

class TabularData extends Component {
  constructor(props) {
    super(props);
    console.log("inputData",props.inputData)
    console.log("inputCols",props.inputCols)
    this.state = {
      // data: [
      //   {
      //     key: "1",
      //     name: "RSK17CS036",
      //     student_name: "Tarun",
      //     age: 32,
      //     address: "New York No. 1 Lake Park",
      //     tags: ["nice", "developer"]
      //   }
      // ],
      // column_headers:[
      //   {
      //     title: "rail_id",
      //     dataIndex: "name",
      //     key: "name",
      //     render: text => <a>{text}</a>
      //   },
      //   {
      //     title: "student_name",
      //     dataIndex: "student_name",
      //     key: "student_name"
      //   },
      // ],
      // dataSource: dataSource,
      // columns: columns,
      inputData : props.inputData,
      inputCols : props.inputCols
    };
  }
  render() {
    return (
      <div style={{margin:"10px"}}>
        {/* <Table dataSource={this.state.data} columns={this.state.column_headers} /> */}
        <Table dataSource={this.state.inputData} columns={this.state.inputCols} scroll={{ x: "100vw" }}/>
      </div>
    );
  }
}

export default TabularData;
