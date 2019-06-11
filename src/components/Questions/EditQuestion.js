import React, { Component } from "react";
import Navigation from "components/Navigation/Navigation";
import Spinner from "components/hoc/spinner";
import axios from "axios";
import Checkbox from "@material-ui/core/Checkbox";
import { Link } from "react-router-dom";

import "./style.css";

class EditQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      question_id: this.props.match.params.id,
      name: "",
      description: "",
      answer_options: [],
      errorMessage: "",
      loading: false,
      correct: false,
      content: "",
      question: ""
    };
  }

  updateOptions = answer_options => {
    this.setState({ ...this.state, answer_options });
  };

  componentDidMount() {
    this.fetchQuestion();
  }

  Capitalize = str => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  fetchQuestion = () => {
    const token = localStorage.getItem("token");
    axios
      .get(
        `https://smart-up.herokuapp.com/api/v1/questions/${
          this.state.question_id
        }`,
        {
          headers: {
            Authorization: token
          }
        }
      )
      .then(res => {
        console.log(res);
        // populate fields
        this.setState({
          answer_options: res.data.answer_options,
          name: this.Capitalize(res.data.name),
          description: this.Capitalize(res.data.description)
        });
      });
  };

  updateQuestion = e => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    let { name, description, question_id } = this.state;
    axios
      .put(
        `https://smart-up.herokuapp.com/api/v1/questions/${question_id}`,
        {
          question: {
            name,
            description
          }
        },
        {
          headers: {
            Authorization: token
          }
        },
        this.setState({
          loading: true
        })
      )
      .then(res => {
        console.log(res);
        if (res.status === 200) {
          this.setState({
            loading: false
          });
          alert("Successful");
        }
      })
      .catch(err => {
        if (err) {
          this.setState({
            loading: false
          });
        }
      });
  };

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  toggle = () => {
    this.setState({
      correct: !this.state.correct
    });
  };

  postAnswerOptions = e => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    let { question_id } = this.state;

    const { correct, content } = this.state;

    if (content.length < 3 || correct === null) {
      alert("Please Enter options");
      this.setState({
        errorMessage: "Enter options"
      });
    } else {
      axios
        .post(
          `https://smart-up.herokuapp.com/api/v1/questions/${question_id}/answer_options`,
          {
            answer_option: {
              question_id,
              correct,
              content
            }
          },
          {
            headers: {
              Authorization: token
            }
          },
          this.setState({
            loading: true
          })
        )
        .then(res => {
          console.log(res);
          if (res.status === 200) {
            this.setState({
              loading: false
            });
            alert("Successful");
            this.fetchQuestion();
          }
        })
        .catch(err => {
          if (err) {
            this.setState({
              loading: false
            });
          }
        });
    }
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
          this.fetchQuestion();
        }
      })
      .catch(error => {
        if (error) {
          alert(`${error}`);
        }
      });
  };

  render() {
    const { loading, correct, content, answer_options } = this.state;
    console.log(answer_options);
    return (
      <React.Fragment>
        <Navigation />
        <div className="main-content">
          <div className="container">
            <div className="center-div">
              <form className="form-horizontal">
                <div className="form-group">
                  <label className="col-lg-8 adjust-input control-label">
                    Question:
                  </label>
                  <div className="col-lg-10">
                    <input
                      className="form-control"
                      type="text"
                      name="name"
                      value={this.state.name}
                      placeholder="Enter question..."
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-lg-8 adjust-input control-label">
                    Description:
                  </label>
                  <div className="col-lg-10">
                    <textarea
                      className="form-control"
                      type="text"
                      name="description"
                      value={this.state.description}
                      placeholder="Enter description..."
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <div className="col-lg-10">
                    <label className="col-lg-2 adjust-input control-label">
                      Correct:
                    </label>
                    <span>
                      <Checkbox
                        checked={correct}
                        onChange={this.toggle}
                        value={correct}
                        name="correct"
                      />
                      <input
                        type="text"
                        name="content"
                        onChange={this.handleChange}
                        value={content}
                      />
                      {/* <i className="fa fa-trash" /> */}
                    </span>
                    <button
                      className="option_btn"
                      onClick={this.postAnswerOptions}
                    >
                      Create Options
                    </button>
                  </div>
                </div>
                <div className="form-group">
                  <div className="col-lg-10">
                    {answer_options.map(option => (
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
                              this.deleteOption(option.question_id, option.id);
                            }}
                            style={{ cursor: "pointer" }}
                            className="fa fa-trash pull-right"
                          />
                        </li>
                      </ul>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <div className="col-lg-10">
                    <button
                      className="option_btn form-control"
                      onClick={this.updateQuestion}
                    >
                      {loading ? <Spinner /> : "Submit"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default EditQuestion;
