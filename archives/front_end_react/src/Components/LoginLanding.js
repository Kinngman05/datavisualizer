import React, { Component } from "react";

import TestLogin from "./TestLogin";
import Landing from "./Landing";

class LoginLanding extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginStatus: false,
      page: localStorage.getItem("token") ? "landing" : "login"
    };
  }

  render() {
    let page;

    switch (this.state.page) {
      case "login":
        page = <TestLogin />;
        break;
      case "user":
        page = <Landing />;
        break;
      default:
        return <p>MAJOR ERROR</p>;
    }
    return <div>{page}</div>;
  }
}

export default LoginLanding;
