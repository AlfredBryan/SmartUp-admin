import React, { Component } from "react";
import { NavItem, Nav } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import axios from "axios";

class AdminNavbarLinks extends Component {
  constructor(props) {
    super(props);
  }
  logOut = e => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    axios
      .delete("https://smart-up.herokuapp.com/api/v1/session", {
        headers: {
          Authorization: token
        }
      })
      .then(res => {
        if (res.statusText === "OK") {
          localStorage.clear("token");
          localStorage.clear("user");
          this.props.history.replace("/");
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
  render() {
    return (
      <div>
        <Nav pullRight>
          <NavItem eventKey={1} href="#">
            Account
          </NavItem>
          <NavItem onClick={this.logOut} eventKey={3} href="#">
            Log out
          </NavItem>
        </Nav>
      </div>
    );
  }
}

export default withRouter(AdminNavbarLinks);
