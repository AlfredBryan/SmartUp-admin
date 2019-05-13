import React, { Component } from "react";
import "./course.css";
import axios from "axios";

import routes from "../../routes";

class CreateCourses extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      visible: false,
      course_list: []
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

  render() {
    return (
      <div>
        <div className="main-content">
          <div className="container">
            <div className="row">
              <div className="container">
                <div className="no-wards">
                  <h5>Courses</h5>
                  <div className="wards-cover text-center">
                    <br />
                    <p>No Courses yet.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CreateCourses;
