import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./course.css";
import axios from "axios";

import Sidebar from "../Sidebar/Sidebar";
import AdminNavbar from "../Navbars/AdminNavbar";

import routes from "../../routes";

class Courses extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      visible: false,
      course_list: [],
      topics: []
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

  componentDidMount() {
    this.fetchCourses();
  }

  fetchCourses = () => {
    const token = localStorage.getItem("token");

    const institution = this.props.match.params.id;

    let Url = "https://smart-up.herokuapp.com/api/v1/courses";

    if (institution) {
      Url += `?institution_id=${institution.id}`;
    }
    axios
      .get(Url, {
        headers: {
          Authorization: token
        }
      })
      .then(res => {
        console.log(res);
        this.setState({
          course_list: res.data,
          topics: res.data.topics,
          visible: res.data.length > 0
        });
      });
  };

  render() {
    const { course_list, topics } = this.state;

    return (
      <div>
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
        <div className="main-content">
          <div className="container">
            <div className="row">
              <div className="container">
                <div className="no-wards">
                  <Link to="/courses/new">
                    <button className="btn btn-success btn-circle pull-right">
                      <i className="fa fa-plus" />
                    </button>
                  </Link>
                  <h5>Courses</h5>
                  <div className="wards-cover text-center">
                    <br />
                    <p>No Courses yet.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="course-list">
            {course_list.map(course => (
              <li className="list-course" key={course.id}>
                <div className="course-name">{course.name}</div>
                <div className="topics">{topics}</div>
              </li>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default Courses;
