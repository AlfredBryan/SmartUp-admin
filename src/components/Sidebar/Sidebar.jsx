import React, { Component } from "react";
import { NavLink, Link, withRouter } from "react-router-dom";
import axios from "axios";

import AdminNavbarLinks from "../Navbars/AdminNavbarLinks.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
      return e.message;
    } finally {
      localStorage.clear("token");
      localStorage.clear("user");
      this.props.history.push("/");
    }
  };

  render() {
    const user = JSON.parse(localStorage.getItem("user"));

    let { ward_button, question_button, Answer_button } = "";
    if (user.status !== "educator") {
      ward_button = (
        <li>
          <NavLink to="/family">
            <i className="fa fa-users" />
            <p>{user.status === "guardian" ? "Wards" : "Guardians"}</p>
          </NavLink>
        </li>
      );
    }

    if (user.status === "educator" || user.admin === true) {
      Answer_button = (
        <li>
          <NavLink activeClassName="active" to="/assessment_answers">
            <i className="fa fa-question-circle" />
            <p>Marking</p>
          </NavLink>
        </li>
      );
    }

    if (user.status === "educator" || user.admin === true) {
      question_button = (
        <li>
          <NavLink to="/questions">
            <i className="fa fa-server" />
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
                <i className="fa fa-pie-chart" />
                <p>Dashboard</p>
              </NavLink>
            </li>
            <li>
              <NavLink activeClassName="active" to="/update_profile">
                <i className="fa fa-wrench" />
                <p>My Profile</p>
              </NavLink>
            </li>
            <li>
              <NavLink activeClassName="active" to="/institutions">
                <i className="fa fa-university" />
                <p>Institutions</p>
              </NavLink>
            </li>
            <li>
              <NavLink activeClassName="active" to="/courses">
                <i className="fa fa-graduation-cap" />
                <p>Courses</p>
              </NavLink>
            </li>
            {(() => {
              if (user.status === "educator" || user.admin === true) {
                return (
                  <li>
                    <NavLink activeClassName="active" to="/assessments">
                      <i className="fa fa-book" />
                      <p>Assessments</p>
                    </NavLink>
                  </li>
                );
              } else if (user.status === "student") {
                return (
                  <li>
                    <NavLink to="/student_assessment">
                      <i className="fa fa-book" />
                      <p>Assessments</p>
                    </NavLink>
                  </li>
                );
              } else {
                return "";
              }
            })()}
            {Answer_button}
            <li>
              <NavLink activeClassName="active" to="/study_groups">
                <FontAwesomeIcon icon="users-cog" size="2x" />
                <p>Study Groups</p>
              </NavLink>
            </li>
            {ward_button}
            {(() => {
              if (user.status === "educator") {
                return (
                  <li>
                    <NavLink to="/users">
                      <i className="fa fa-users" />
                      <p>Students</p>
                    </NavLink>
                  </li>
                );
              } else if (user.admin === true) {
                return (
                  <li>
                    <NavLink to="/users">
                      <i className="fa fa-users" />
                      <p>Users</p>
                    </NavLink>
                  </li>
                );
              } else {
                return "";
              }
            })()}
            {question_button}
            <hr />
            <li onClick={this.logOut} className="side_logout">
              <div>
                <i className="fa fa-power-off" />
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
