import React, { Component } from "react";
import { Helmet } from "react-helmet";

import "./style.css";
import Navigation from "components/Navigation/Navigation";
import Spinner from "components/hoc/spinner";
import axios from "axios";
import Select from "react-select";
import ReactMde from "react-mde";
import * as Showdown from "showdown";
import Button from "@material-ui/core/Button";
import "react-mde/lib/styles/css/react-mde-all.css";

const Url = process.env.REACT_APP_BASE_URL;

class AddQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      errorMessage: "",
      assessment_id: this.props.match.params.id,
      name: "",
      description: "",
      questions: [],
      question: "",
      selectedOption: null,
      assessment_questions: []
    };

    this.converter = new Showdown.Converter({
      tables: true,
      simplifiedAutoLink: true,
      strikethrough: true,
      tasklists: true
    });
  }

  fetchQuestions = () => {
    const token = localStorage.getItem("token");
    axios
      .get(`${Url}/api/v1/questions`, {
        headers: {
          Authorization: token
        }
      })
      .then(res => {
        if (res.data.errors) {
          this.setState({
            error: true
          });
        } else {
          this.setState({
            questions: res.data
          });
        }
      })
      .catch(error => {});
  };

  fetchAssessment = () => {
    const token = localStorage.getItem("token");
    const { assessment_id } = this.state;
    axios
      .get(`${Url}/api/v1/assessments/${assessment_id}`, {
        headers: {
          Authorization: token
        }
      })
      .then(res => {
        if (res.status === 200 && res.statusText === "OK") {
          this.setState({
            name: res.data.name,
            description: res.data.description,
            assessment_questions: res.data.assessment_questions
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleQuestionChange = selectedOption => {
    this.setState({ selectedOption });
  };

  handleDescriptionChange = description => {
    this.setState({ description });
  };

  postQuestion = e => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const { assessment_id, selectedOption } = this.state;
    if (selectedOption === null) {
      alert("Please select a question");
      this.setState({
        errorMessage: "Select a question"
      });
    } else {
      axios
        .post(
          `${Url}/api/v1/assessments/${assessment_id}/assessment_questions`,
          {
            assessment_question: {
              question_id: selectedOption.value.id,
              assessment_id: assessment_id
            }
          },
          {
            headers: {
              Authorization: token
            }
          }
        )
        .then(res => {
          this.fetchAssessment();
        })
        .catch(error => {
          if (error) {
            alert(`${error}`);
          }
        });
    }
  };

  questionOptions = questions => {
    let options = [];
    questions.map(item => options.push({ value: item, label: item.name }));
    return options;
  };

  removeAnswerQuestion = question_id => {
    const token = localStorage.getItem("token");
    const { assessment_id } = this.state;
    axios
      .delete(
        `${Url}/api/v1/assessments/${assessment_id}/assessment_questions/${question_id}`,

        {
          headers: {
            Authorization: token
          }
        }
      )
      .then(res => {
        this.fetchAssessment();
      });
  };

  updateAssessment = e => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const { name, description, assessment_id } = this.state;

    axios
      .put(
        `${Url}/api/v1/assessments/${assessment_id}`,
        {
          assessment: {
            name: name,
            description: description
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
        if (res.status === 200) {
          this.setState({
            loading: false
          });
          this.props.history.replace(`/assessment/${res.data.id}`);
        }
      })
      .catch(error => {
        if (error) {
          alert(`${error}`);
        }
      });
  };

  componentDidMount() {
    this.fetchAssessment();
    this.fetchQuestions();
  }

  render() {
    const {
      loading,
      errorMessage,
      questions,
      assessment_questions,
      selectedOption
    } = this.state;
    return (
      <React.Fragment>
        <Helmet>
          <meta charSet="utf-8" />
          <title>Assessment</title>
        </Helmet>
        <Navigation />
        <div>
          <div className="main-content">
            <div className="container">
              <div className="center-div">
                <h3>Edit Assessment</h3>
                <form
                  onSubmit={this.postAssessment}
                  className="form-horizontal"
                >
                  <div className="form-group">
                    <label className="col-lg-8 adjust-input control-label">
                      Name
                    </label>
                    <div className="col-lg-12">
                      <input
                        className="form-control"
                        type="text"
                        name="name"
                        value={this.state.name}
                        placeholder="Course Name ..."
                        onChange={this.handleChange}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="col-lg-8 adjust-input control-label">
                      Description
                    </label>
                    <div className="col-lg-12">
                      <ReactMde
                        onChange={this.handleDescriptionChange}
                        value={this.state.description}
                        generateMarkdownPreview={markdown =>
                          Promise.resolve(this.converter.makeHtml(markdown))
                        }
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="col-md-12">
                      <Select
                        className="col-md-8"
                        class="form-control m-bot15"
                        value={selectedOption}
                        onChange={this.handleQuestionChange}
                        name="question"
                        options={this.questionOptions(questions)}
                        required
                      />
                      <Button
                        onClick={this.postQuestion}
                        variant="contained"
                        component="span"
                        color="secondary"
                        className="new-btn"
                      >
                        Add Question
                      </Button>
                    </div>
                    <div className="col-md-12">
                      <div className="">
                        <ul className="">
                          {assessment_questions.map(assessment_question => (
                            <li
                              key={assessment_question.id}
                              className="question_options w-100"
                            >
                              <i
                                onClick={() => {
                                  this.removeAnswerQuestion(
                                    assessment_question.id
                                  );
                                }}
                                style={{ cursor: "pointer", color: "red" }}
                                className="fa fa-trash-o pull-right"
                              />
                              {assessment_question.question.name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  <p style={{ color: "red" }}>{errorMessage}</p>
                  <div className="form-group">
                    <div className="col-lg-12">
                      <Button
                        variant="contained"
                        component="span"
                        color="secondary"
                        className="form-control new-btn"
                        onClick={this.updateAssessment}
                      >
                        {loading ? <Spinner /> : "Update"}
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default AddQuestion;
