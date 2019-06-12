import React, { Component } from "react";
import axios from "axios";
import Navigation from "components/Navigation/Navigation";

import Collapsible from "react-collapsible";
import { Link, Redirect } from "react-router-dom";

class Questions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: [],
      answer_options: []
    };
  }

  componentDidMount() {
    this.fetchQuestions();
  }

  // fetchOptions = question_id => {
  //   const token = localStorage.getItem("token");
  //   axios
  //     .get(
  //       `https://smart-up.herokuapp.com/api/v1/questions/${question_id}/answer_options`,
  //       {
  //         headers: {
  //           Authorization: token
  //         }
  //       }
  //     )
  //     .then(res => {});
  // };

  fetchQuestions = () => {
    const token = localStorage.getItem("token");
    axios
      .get("https://smart-up.herokuapp.com/api/v1/questions", {
        headers: {
          Authorization: token
        }
      })
      .then(res => {
        if (res.data.errors) {
          this.setState({
            questions: null
          });
        } else {
          this.setState({
            questions: res.data
          });
        }
      })
      .catch(error => {});
  };

  deleteOption = (question_id, id) => {
    const token = localStorage.getItem("token");
    axios
      .delete(
        `https://smart-up.herokuapp.com/api/v1/questions/${question_id}/answer_options/${id}`,
        {
          headers: {
            Authorization: token
          }
        }
      )
      .then(res => {
        console.log(res);
        if (res.statusText === "No Content") {
          alert(`Option removed ${id}`);
          this.fetchQuestions();
        }
      })
      .catch(error => {
        if (error) {
          alert(`${error}`);
        }
      });
  };

  render() {
    const { questions } = this.state;
    if (questions === null) {
      localStorage.clear("token");
      localStorage.clear("user");
      this.props.history.push("/login");
    } else {
      return (
        <React.Fragment>
          <Navigation />
          <div className="main-content">
            <div className="container questions">
              {questions.map(question => (
                <div key={question.id} className="toggle-question">
                  <Collapsible className="question" trigger={question.name}>
                    <Link to={`/edit_question/${question.id}`}>
                      <i className="fa fa-edit question-button pull-right" />
                    </Link>

                    <div>
                      {question.answer_options.map(option => (
                        <ul className="quesn_options" key={option.id}>
                          <li className="quesn_content">
                            <Link
                              to={`/edit_option/${option.question_id}/${
                                option.id
                              }`}
                            >
                              {option.content}
                            </Link>
                            <i
                              onClick={() => {
                                this.deleteOption(
                                  option.question_id,
                                  option.id
                                );
                              }}
                              style={{ cursor: "pointer" }}
                              className="fa fa-trash pull-right"
                            />
                          </li>
                        </ul>
                      ))}
                    </div>
                    {/* <i
                        onClick={this.deleteQuestion(question.id)}
                        className="fa fa-trash question-button pull-right"
                      /> */}
                  </Collapsible>
                </div>
              ))}
            </div>
          </div>
        </React.Fragment>
      );
    }
  }
}

export default Questions;
