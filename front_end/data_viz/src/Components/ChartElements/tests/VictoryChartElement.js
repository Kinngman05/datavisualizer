import React, { Component } from "react";
import {
  VictoryBar,
  VictoryChart,
  VictoryScatter,
  VictoryAxis,
  VictoryLine,
  VictoryContainer,
} from "victory";
import {
  Row,
  Col,
  PageHeader,
  Button,
  Descriptions,
  DatePicker,
  Select,
  Table,
} from "antd";
import io from "socket.io-client";

class ChartElement extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div style={{ width: 850, padding: 24 }}>
        <VictoryChart>
          <VictoryLine
            data={[
              { x: 1, y: 2, z:10 },
              { x: 2, y: 3, z:10 },
              { x: 3, y: 5, z:10 },
              { x: 4, y: 4, z:10 },
              { x: 5, y: 6, z:10 },
            ]}
            x="x"
            y="z"
          />
          <VictoryLine
            data={[
              { x: 1, y: 2 * 2 },
              { x: 2, y: 3 * 2 },
              { x: 3, y: 5 * 2 },
              { x: 4, y: 4 * 2 },
              { x: 5, y: 6 * 2 },
            ]}
          />
        </VictoryChart>
      </div>
    );
  }
}

export default ChartElement;
