import React, { Component } from "react";
import { NavLink, Link, withRouter } from "react-router-dom";
import axios from "axios";

import AdminNavbarLinks from "../Navbars/AdminNavbarLinks.jsx";

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: window.innerWidth
    };
  }
  updateDimensions() {
    this.setState({ width: window.innerWidth });
  }
  componentDidMount() {
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions.bind(this));
  }

  logOut = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.delete(
        "https://smart-up.herokuapp.com/api/v1/session",
        {
          headers: {
            Authorization: token
          }
        }
      );
      return res;
    } catch (e) {
      console.log(e);
      return e.message;
    } finally {
      localStorage.clear("token");
      localStorage.clear("user");
      this.props.history.push("/");
    }
  };

  render() {
    const user = JSON.parse(localStorage.getItem("user"));

    let ward_button;
    if (user.status !== "educator") {
      ward_button = (
        <li>
          <NavLink to="/family">
            <i className="pe-7s-users" />
            <p>{user.status === "guardian" ? "Wards" : "Guardians"}</p>
          </NavLink>
        </li>
      );
    }

    let question_button;
    if (user.status !== "guardian" && "wards") {
      question_button = (
        <li>
          <NavLink to="/questions">
            <i className="pe-7s-server" />
            <p>Questions</p>
          </NavLink>
        </li>
      );
    }
    return (
      <div
        id="sidebar"
        className="sidebar"
        data-color={this.props.color}
        data-background={this.props.background}
        data-image={this.props.image}
      >
        <div className="logo">
          <Link to="/">
            <img
              className="logo-header"
              src={require("../../images/logo_color.png")}
              alt="SmartUp Logo"
            />
          </Link>
        </div>
        <div className="sidebar-wrapper">
          <ul className="nav">
            {this.state.width <= 991 ? <AdminNavbarLinks /> : null}
            <li>
              <NavLink activeClassName="active" to="/profile">
                <i class="pe-7s-graph" />
                <p>Dashboard</p>
              </NavLink>
            </li>
            <li>
              <NavLink activeClassName="active" to="/update_profile">
                <i class="pe-7s-config" />
                <p>My Profile</p>
              </NavLink>
            </li>
            <li>
              <NavLink activeClassName="active" to="/institutions">
                <i class="pe-7s-culture" />
                <p>Institution</p>
              </NavLink>
            </li>
            <li>
              <NavLink activeClassName="active" to="/courses">
                <i class="fa fa-graduation-cap" />
                <p>Courses</p>
              </NavLink>
            </li>
            {ward_button}
            {question_button}
            <hr />
            <li onClick={this.logOut} className="side_logout">
              <div>
                <i class="pe-7s-power" />
                <p>Log Out </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default withRouter(Sidebar);
