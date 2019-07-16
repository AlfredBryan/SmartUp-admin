import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

import "./style.css";
import Navigation from "components/Navigation/Navigation";
import Collapsible from "react-collapsible";
import EditIcon from "@material-ui/icons/Edit";
import AssessmentIcon from "@material-ui/icons/Assessment";
import Button from "@material-ui/core/Button";
import Fab from "@material-ui/core/Fab";
import Tooltip from "@material-ui/core/Tooltip";

const Url = process.env.REACT_APP_BASE_URL;

class StudentShowAssessment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      assessment_id: this.props.match.params.id,
      assessment: ""
    };
  }
  componentDidMount() {
    this.fetchAssessment();
  }

  Capitalize = str => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  fetchAssessment = () => {
    const token = localStorage.getItem("token");
    axios
      .get(
        `${Url}/api/v1/assessments/${this.state.assessment_id}`,

        {
          headers: {
            Authorization: token
          }
        }
      )
      .then(res => {
        this.setState({
          assessment: res.data,
          questions: res.data.questions
        });
      });
  };

  render() {
    const { assessment } = this.state;
    const ReactMarkdown = require("react-markdown");
    return (
      <div>
        <Helmet>
          <meta charSet="utf-8" />
          <title>Assessment</title>
        </Helmet>
        <Navigation />
        <div className="main-content">
          <div className="container questions">
            <span className="pull-right">
              <Link to={`/assessments/${assessment.id}/take_assessment`}>
                <Button color="secondary" variant="contained" component="span">
                  <AssessmentIcon />
                  Take Assessment
                </Button>
              </Link>
            </span>
            <h3>{assessment.name}</h3>
            <div className="">
              <blockquote>
                <ReactMarkdown source={assessment.description} />
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default StudentShowAssessment;
