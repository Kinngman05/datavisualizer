import React from "react";

// import logo from './logo.svg';
// import './App.css';

// import React from "react";

import "antd/dist/antd.css";
import UserHomePage from "./Components/UserHomePage"

// import LoginPage from "./Components/LoginPage";
// import LoginPageNew from "./Components/LoginPageNew";
// import Landing from "./Components/Landing";
// import Registration from "./Components/Registration";
// import darkTheme from '@ant-design/dark-theme';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      page: localStorage.getItem("token") ? "landing" : "login",
      sock: null,
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
              }}
            >
              <h1>DATAVIZ</h1>
            </header>
            {/* { <LoginPageNew
              style={{ paddingTop: "400px" }}
              loggedIn={this.state.loggedIn}
              updateLogin={this.updateLogin}
              updateToRegister={this.updateToRegister}
            /> } */}
          </div>
        );
        break;
      // case "landing":
      //   page = <Landing updateLogout={this.updateLogout} />;
      //   break;
      // case "register":UserHomePage
      //   page = <Registration />;
      //   break;
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
        {/* {page} */}
        {/* <h1>HELLO WHATS HAPPENING?</h1> */}
        <UserHomePage />
      </div>
    );
  }
}

export default App;
