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
                <blockquote>
                  <div>
                    {ans.answer_option.content}
                    <span>
                      {ans.answer_option.correct === true ? (
                        <i
                          className="fa fa-check"
                          style={{ fontSize: "36px", color: "green" }}
                        />
                      ) : (
                        <i
                          className="fa fa-close"
                          style={{ fontSize: "36px", color: "red" }}
                        />
                      )}
                    </span>
                  </div>
                </blockquote>
              </div>
            ))}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default ShowTest;
