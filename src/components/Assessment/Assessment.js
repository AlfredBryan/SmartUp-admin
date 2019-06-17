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
            <div className="row push-down">
              <h3>Assessment</h3>
              <div className="col-xs-12 col-sm-8 col-md-8">
                <div className="row">
                  {assessment.map(ass => (
                    <div
                      key={ass.id}
                      className="card family-member-info text-center col-xs-12 col-sm-3 col-md-3"
                      id="family-card"
                    >
                      <Link
                        to={`/assessment/${ass.id}`}
                        className="display-uni"
                      >
                        <div>
                          <strong>
                            {ass.name}
                          </strong>
                          <div
                            style={{ marginTop: "2em" }}
                            className="ass-text"
                          >
                            <span>
                              <strong>Course: {ass.course.name}</strong>
                            </span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Assessment;
