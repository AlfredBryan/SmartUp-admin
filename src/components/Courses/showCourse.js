import React, { Component } from "react";
import "./course.css";
import axios from "axios";
import { Link } from "react-router-dom";

import Sidebar from "../Sidebar/Sidebar";
import AdminNavbar from "../Navbars/AdminNavbar";
import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";
import Tooltip from "@material-ui/core/Tooltip";

import routes from "../../routes";

class showCourse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      course: "",
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
    if (!this.state.course) {
      this.fetchCourse()
        .then(course => {
          this.setState({ course: course });
          console.log(course);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }

  async fetchCourse() {
    const token = localStorage.getItem("token");
    let { course_slug } = this.state;
    const res = await axios.get(
      `https://smart-up.herokuapp.com/api/v1/courses/${course_slug}/`,
      {
        headers: {
          Authorization: token
        }
      }
    );
    return await res.data;
  }

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
        <div className="main-content">
          <div className="action-buttons">
            <Link to={`/course/${course.id}`} className="button-area">
              <Tooltip title="Add" aria-label="Add">
                <Fab
                  color="primary"
                  style={{
                    background:
                      "linear-gradient(174.78deg, #3394AB -8.91%, #64DAF6 99.52%) !important"
                  }}
                >
                  <AddIcon />
                </Fab>
              </Tooltip>
            </Link>
          </div>
          <div className="wards-cover">
            <h5>{course.name}</h5>
            <li>
              {course.name}
              <span className="pull-right">
                {course.topics == 0
                  ? "No topics yet"
                  : "Topics" + course.topics}
              </span>
            </li>
          </div>
        </div>
      </div>
    );
  }
}

export default showCourse;
