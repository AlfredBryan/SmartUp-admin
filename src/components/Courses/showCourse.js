import React, { Component } from "react";
import "./course.css";
import axios from "axios";

import Sidebar from "../Sidebar/Sidebar";
import AdminNavbar from "../Navbars/AdminNavbar";

import routes from "../../routes";


class showCourse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      course: {}
    };
  }

  getBrandText = path => {
    for (let i = 0; i < routes.length; i++) {
      if (this.props.location.pathname.indexOf(routes[i].path) !== -1) {
        return routes[i].name;
      }
    }
    return "Brand";
  };

  fetchCourse = id => {
    const token = localStorage.getItem("token");
    axios
      .get(`https://smart-up.herokuapp.com/api/v1/courses/${id}/`, {
        headers: {
          Authorization: token
        }
      })
      .then(res => {
        this.setState({
          course: res.data
        }).catch(err => {});
      });
  };

  render() {
    const { course } = this.state;

    return (
      <div>
        {" "}
        <Sidebar
          {...this.props}
          routes={routes}
          hasImage={this.state.hasImage}
        />
        <div id="main-panel" className="main-panel" ref="mainPanel">
          <AdminNavbar
            {...this.props}
            brandText={this.getBrandText(this.props.location.pathname)}
          />
        </div>
        <div className="center">
          <h2>{course.name}</h2>
          <hr />
        </div>
      </div>
    );
  }
}

export default showCourse;
