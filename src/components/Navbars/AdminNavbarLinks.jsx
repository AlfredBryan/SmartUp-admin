import React, { Component } from "react";
import { NavItem, Nav } from "react-bootstrap";
import { withRouter } from "react-router-dom";

class AdminNavbarLinks extends Component {
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
        </Nav>
      </div>
    );
  }
}

export default withRouter(AdminNavbarLinks);
