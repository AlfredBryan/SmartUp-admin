import React, { Component } from "react";
import axios from "axios";
import Navigation from "components/Navigation/Navigation";

import Collapsible from "react-collapsible";
import { Link } from "react-router-dom";

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
            questions: []
          });
        } else {
          this.setState({
            questions: res.data
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  // deleteQuestion = id => {
  //   const token = localStorage.getItem("token");
  //   axios
  //     .delete(`https://smart-up.herokuapp.com/api/v1/questions/${id}`, {
  //       headers: {
  //         Authorization: token
  //       }
  //     })
  //     .then(res => {
  //       if (res.statusText === "OK") {
  //         alert("Question removed");
  //         this.props.history.replace("/questions");
  //       }
  //     });
  // };

  render() {
    const { questions } = this.state;
    if (questions.length < 1) {
      return (
        <div>
          <Navigation />
          <div className="main-content text-center">
            <span className="center_wrong">
              <h1>UnAuthorized User</h1>
              <p style={{ color: "red" }}>please login</p>
            </span>
          </div>
        </div>
      );
    } else {
      return (
        <React.Fragment>
          <Navigation />
          <div className="main-content">
            <div className="container questions">
              {questions.map(question => (
                <div key={question.id} className="toggle-question">
                  <Collapsible className="question" trigger={question.name}>
                    <div>
                      {question.answer_options.map(option => (
                        <p className="quesn_options" key={option.id}>
                          {option.content}
                        </p>
                      ))}
                    </div>
                    <Link
                      to={`/edit_question/${question.id}`}
                      className="pull-right"
                    >
                      <i className="fa fa-edit question-button" />
                    </Link>
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
