import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import AssessmentIcon from "@material-ui/icons/Assessment";
import Button from "@material-ui/core/Button";

import Navigation from "components/Navigation/Navigation";

class StudentAssessment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      assessment: []
    };
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

  componentDidMount() {
    this.fetchAssessments();
  }

  render() {
    const ReactMarkdown = require("react-markdown");
    const { assessment } = this.state;
    return (
      <React.Fragment>
        <Navigation />
        <div className="main-content">
          <div className="container">
            {assessment.map(item => (
              <div key={item.id}>
                <h3>{item.name}</h3>
                <Link
                  className="pull-right"
                  to={`/assessments/${item.id}/take_assessment`}
                >
                  <Button
                    color="secondary"
                    variant="contained"
                    component="span"
                  >
                    <AssessmentIcon />
                    Take Assessment
                  </Button>
                </Link>
                <blockquote>
                  <ReactMarkdown source={item.description} />
                </blockquote>
              </div>
            ))}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default StudentAssessment;
