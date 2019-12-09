import React from "react";
// import { Menu } from "antd";

// Components import
// import Landing from './Components/Landing'
// import LoginLanding from "./Components/LoginLanding";
// import Test from './Components/Test'
// import LowerPanel from './Components/LowerPanel'
// import ChartComponent from './Components/ChartComponent'
import "antd/dist/antd.css";

import Login from "./Components/Login";
import Landing from "./Components/Landing";
import Registration from "./Components/Registration";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      page: localStorage.getItem("token") ? "landing" : "login"
    };
  }

  updateLogin = () => {
    console.log("logged in");
    this.setState({ loggedIn: true, page: "landing" });
  };
  updateLogout = () => {
    console.log("logged Out");
    localStorage.removeItem("token");
    this.setState({ loggedIn: false, page: "login" });
  };
  updateToRegister = () => {
    console.log("Updating to register");
    this.setState({ loggedIn: false, page: "register" });
  };

  render() {
    let page;

    switch (this.state.page) {
      case "login":
        page = (
          <div>
            <header
              style={{
                height: "10px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                paddingTop: "40px",
                // backgroundColor: "rgba(0, 0, 0, .45)"
                // backgroundColor: "#40a9ff"
              }}
            >
              <h1>DATAVIZ</h1>
            </header>
            <Login
              style={{ paddingTop: "400px" }}
              loggedIn={this.state.loggedIn}
              updateLogin={this.updateLogin}
              updateToRegister={this.updateToRegister}
            />
          </div>
        );
        break;
      case "landing":
        page = <Landing updateLogout={this.updateLogout} />;
        break;
      case "register":
        page = <Registration />;
        break;
      default:
        return <p>MAJOR ERROR</p>;
    }
    return (
      <div>
        {/* <Menu
          theme="dark"
          mode="horizontal"
          // defaultSelectedKeys={this.defaultPage}
          style={{ lineHeight: "64px" }}
          onClick={this.onClick}
          // onChange={this.onChangeMenuOption}
        >
            <Menu.Item key="0">STOCK ANALYSIS</Menu.Item>
           LOL
        </Menu> */}
        {page}
      </div>
    );
  }
}

export default App;
