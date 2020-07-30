import React from "react";
import "antd/dist/antd.css";
import UserHomePage from "./Components/UserHomePage";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <UserHomePage />
      </div>
    );
  }
}

export default App;
