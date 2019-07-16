import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

import "./style.css";
import Navigation from "components/Navigation/Navigation";

const Url = process.env.REACT_APP_BASE_URL;

class StudentAssessment extends Component {
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
      .get(`${Url}/api/v1/assessments`, {
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
        <Helmet>
          <meta charSet="utf-8" />
          <title>Assessments</title>
        </Helmet>
        <Navigation />
        <div className="main-content">
          <div className="container">
            <div className="row push-down">
              <h3>Assessments</h3>
              <div className="row" id="assessments_home">
                {assessment.map(ass => (
                  <div key={ass.id} className="col-md-4">
                    <div className="card">
                      <Link
                        to={`/student_assessment/${ass.id}`}
                        className="display-uni"
                      >
                        <i className="fa fa-vcard-o assessment_logo" />
                        <h6 className="assessment_name">{ass.name}</h6>
                        <p className="assessment_course_name">
                          Course: {ass.course.name}
                        </p>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default StudentAssessment;
