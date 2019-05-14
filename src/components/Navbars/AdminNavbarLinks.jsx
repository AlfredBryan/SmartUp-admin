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
    const user = JSON.parse(localStorage.getItem("user"));
    return (
      <div>
        <Nav pullRight>
          <NavItem eventKey={1} href="#">
            <div className="user-info">
              <i className="fa fa-user-circle nav-icon">
                <span className="remove-font">{user.first_name}</span>
              </i>
            </div>
          </NavItem>
          <NavItem onClick={this.logOut} eventKey={3} href="#">
            <span className="span-logout"> Log out</span>
          </NavItem>
        </Nav>
      </div>
    );
  }
}

export default withRouter(AdminNavbarLinks);
