import React, { Component } from "react";
import Sidebar from "components/Sidebar/Sidebar";
import AdminNavbar from "../Navbars/AdminNavbar";

class Navigation extends Component {
  render() {
    return (
      <React.Fragment>
        <Sidebar />
        <div id="main-panel" className="main-panel" ref="mainPanel">
          <AdminNavbar />
        </div>
      </React.Fragment>
    );
  }
}

export default Navigation;
