import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import "./style.css";
import Navigation from "components/Navigation/Navigation";

class Assessment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      assessment: []
    };
  }
  componentDidMount() {
    this.fetchAssessments();
  }

  fetchAssessments = () => {
    const token = localStorage.getItem("token");
    axios
      .get("https://smart-up.herokuapp.com/api/v1/assessments", {
        headers: {
          Authorization: token
        }
      })
      .then(res => {
        this.setState({
          assessment: res.data
        });
      });
  };
  render() {
    const { assessment } = this.state;
    return (
      <React.Fragment>
        <Navigation />
        <div className="main-content">
          <div className="container">
            <h3>Assessments</h3>
            {assessment.map(ass => (
              <ul className="assessment_body" key={ass.id}>
                <Link to={`/assessment/${ass.id}`}>
                  <li className="display_asses">
                    <span className="asses_name">
                      <strong>{ass.name}</strong>
                    </span>
                    <span className="pull-right">
                      <strong>Course: {ass.course.name}</strong>
                    </span>
                  </li>
                </Link>
              </ul>
            ))}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Assessment;
