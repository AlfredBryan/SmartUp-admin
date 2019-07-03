import React, { Component } from "react";
import axios from "axios";
import Collapsible from "react-collapsible";
import Button from "@material-ui/core/Button";

import Navigation from "components/Navigation/Navigation";
import "./style.css";

class Answers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      answer_list: [],
      score: ""
    };
  }

  Capitalize = str => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  fetchAnswers = () => {
    const token = localStorage.getItem("token");
    axios
      .get("https://smart-up.herokuapp.com/api/v1/answers/marking", {
        headers: {
          Authorization: token
        }
      })
      .then(res => {
        console.log(res);
        if (res.status === 200) {
          this.setState({
            answer_list: res.data
          });
        }
      });
  };

  markAnswer = id => {
    const token = localStorage.getItem("token");
    const { score } = this.state;
    axios
      .post(
        `https://smart-up.herokuapp.com/api/v1/answers/${id}/score`,
        {
          answer: {
            score
          }
        },
        {
          headers: {
            Authorization: token
          }
        }
      )
      .then(res => {
        console.log(res);
      });
  };

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  componentDidMount() {
    this.fetchAnswers();
  }

  render() {
    const ReactMarkdown = require("react-markdown");
    const { answer_list, score } = this.state;
    return (
      <React.Fragment>
        <Navigation />
        <div className="main-content">
          <div className="container">
            <h3>Answers</h3>
            {answer_list.map(answer => (
              <div key={answer.id} className="toggle-question">
                <Collapsible
                  className="question"
                  trigger={
                    <span>
                      <strong className="diplay_answer">Question</strong>
                      {answer.question.name}
                    </span>
                  }
                  triggerSibling={answer.state}
                >
                  <span className="pull-right" />
                  <blockquote>
                    <ReactMarkdown source={answer.question.description} />
                  </blockquote>
                  <div>
                    <h4>Answer</h4>
                    <blockquote>
                      <ReactMarkdown source={answer.content} />
                    </blockquote>
                    <form onSubmit={this.markAnswer} className="form-group">
                      <div className="col-lg-4">
                        <input
                          className="form-control"
                          type="text"
                          value={score}
                          name="score"
                          onChange={this.handleChange}
                        />
                      </div>
                      <div className="col-lg-2">
                        <Button
                          variant="contained"
                          component="span"
                          color="secondary"
                          className="form-control new-btn"
                          onClick={() => {
                            this.markAnswer(answer.id);
                          }}
                        >
                          Mark
                        </Button>
                      </div>
                    </form>
                  </div>
                </Collapsible>
              </div>
            ))}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Answers;
