import React, { Component } from "react";
import "./course.css";
import axios from "axios";
import { Link } from "react-router-dom";

import Sidebar from "../Sidebar/Sidebar";
import AdminNavbar from "../Navbars/AdminNavbar";

import routes from "../../routes";

class showCourse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      course: "",
      topics: [],
      course_slug: this.props.match.params.slug
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
    this.fetchCourse();
  }

  fetchCourse = () => {
    const token = localStorage.getItem("token");
    let { course_slug } = this.state;
    axios
      .get(`https://smart-up.herokuapp.com/api/v1/courses/${course_slug}/`, {
        headers: {
          Authorization: token
        }
      })
      .then(res => {
        console.log(res);
        this.setState({
          course: res.data,
          topics: res.data.topics
        });
      });
  };

  render() {
    const { course, topics, course_slug } = this.state;
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
        <div className="main-content">
          <div className="course_n_topics">
            <div className="align-course">
              <div>
                <h3 className="course-name">{course.name}</h3>
                <span className="pull-right">
                  <Link to={`/new_topic/${course_slug}`}>
                    <button className="topics-button">Add Topic</button>
                  </Link>
                  <Link to={`/update_course/${course_slug}`}>
                    <button className="topics-button">Edit Course</button>
                  </Link>
                </span>
              </div>
              <div className="topics-cover">
                <ul>
                  <li>
                    <span>
                      {course.topics < 1 ? (
                        <span className="topics-span">No topics yet</span>
                      ) : (
                        <span className="topics-span">
                          Topics:{topics.length}
                        </span>
                      )}
                    </span>
                  </li>
                  <li>
                    <span>Description</span>
                    <span style={{ display: "flex" }}>
                      <hr id="line-colored" /> <hr id="line-gray" />
                    </span>
                  </li>
                  <li>
                    <p style={{ textTransform: "capitalize" }}>
                      {course.description}
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default showCourse;
