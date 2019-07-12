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

class showAssessment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      assessment_id: this.props.match.params.id,
      assessment: "",
      questions: [],
      assessment_questions: [],
      score: ""
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
        `https://smart-up.herokuapp.com/api/v1/assessments/${
          this.state.assessment_id
        }`,

        {
          headers: {
            Authorization: token
          }
        }
      )
      .then(res => {
        console.log(res);
        this.setState({
          assessment: res.data,
          questions: res.data.questions,
          assessment_questions: res.data.assessment_questions
        });
      });
  };

  renderAnswerOptions = question => {
    if (question.answer_options && question.answer_options.length > 0) {
      return question.answer_options.map(option => (
        <ul className="question_options" key={option.id}>
          <li className="question_content">
            {this.Capitalize(option.content)}
          </li>
        </ul>
      ));
    }
  };

  setScore = id => {
    const { assessment_id, score } = this.state;
    const token = localStorage.getItem("token");
    axios
      .post(
        `https://smart-up.herokuapp.com/api/v1/questions/${id}/set_score`,
        {
          assessment_id,
          score
        },
        {
          headers: {
            Authorization: token
          }
        }
      )
      .then(res => {
      });
  };

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  render() {
    const { assessment, assessment_questions } = this.state;
    const user = JSON.parse(localStorage.getItem("user"));
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
              {user.status === "educator" || user.admin === true ? (
                <Link to={`/edit_assessment/${assessment.id}`}>
                  <Tooltip title="Edit" aria-label="Edit">
                    <Fab color="secondary">
                      <EditIcon />
                    </Fab>
                  </Tooltip>
                </Link>
              ) : (
                ""
              )}
            </span>
            <h3>{assessment.name}</h3>
            <span className="pull-right">
              {assessment_questions.length < 1 ? (
                <span className="topics-span">No questions yet</span>
              ) : (
                <span className="topics-span">
                  Questions :{assessment_questions.length}
                </span>
              )}
            </span>
            <div className="">
              <blockquote>
                <ReactMarkdown source={assessment.description} />
              </blockquote>
              <ul className="assessment_questions">
                {assessment_questions.map(question => (
                  <li key={question.id} className="toggle-question">
                    <Collapsible
                      className="question"
                      trigger={question.question.name}
                      triggerSibling={question.question.question_type}
                    >
                      <blockquote>{question.question.description}</blockquote>
                      <div>{this.renderAnswerOptions(question.question)}</div>
                      {question.question.question_type === "theory" ? (
                        <form className="score_input">
                          <input
                            type="text"
                            onChange={this.handleChange}
                            name="score"
                            value={question.max_score}
                          />
                          <Button
                            color="secondary"
                            variant="contained"
                            component="span"
                            onClick={() => {
                              this.setScore(question.question.id);
                            }}
                          >
                            Max Score
                          </Button>
                        </form>
                      ) : (
                        ""
                      )}
                    </Collapsible>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default showAssessment;
