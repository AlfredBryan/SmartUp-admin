import React, { Component } from "react";
import axios from "axios";
import Navigation from "components/Navigation/Navigation";

import "./ShowTest.css";

const Url = process.env.REACT_APP_BASE_URL;

class ShowTest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      test_id: this.props.match.params.id,
      assessment: "",
      answers: []
    };
  }

  fetchTest = () => {
    const token = localStorage.getItem("token");
    const { test_id } = this.state;
    axios
      .get(`${Url}/api/v1/assessment_results/${test_id}`, {
        headers: {
          Authorization: token
        }
      })
      .then(res => {
        this.setState({
          assessment: res.data.assessment,
          answers: res.data.answers
        });
      });
  };

  componentDidMount() {
    this.fetchTest();
  }

  render() {
    const { assessment, answers } = this.state;
    const ReactMarkdown = require("react-markdown");
    if (answers) {
    }
    return (
      <React.Fragment>
        <Navigation />
        <div className="main-content">
          <div className="container">
            <h4>{assessment.name}</h4>
            <blockquote>
              <ReactMarkdown source={assessment.description} />
            </blockquote>
            {answers.map(ans => (
              <div key={ans.id}>
                <strong>{ans.question.name}</strong>
                <blockquote>
                  <ReactMarkdown source={ans.question.description} />
                </blockquote>
                <div className="answer-card">
                  <div id="answer-content">{ans.answer_option.content}</div>
                  <div id="answer-tick">
                    {ans.answer_option.correct === true ? (
                      <i className="fa fa-check fa-3x" id="correct-answer" />
                    ) : (
                      <i className="fa fa-close fa-3x" id="wrong-answer" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default ShowTest;
