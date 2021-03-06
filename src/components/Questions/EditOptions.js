import React, { Component } from "react";
import Navigation from "components/Navigation/Navigation";
// import Spinner from "components/hoc/spinner";
import axios from "axios";
import Checkbox from "@material-ui/core/Checkbox";
import { Helmet } from "react-helmet";
import "./style.css";

const Url = process.env.REACT_APP_BASE_URL;

class EditOptions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      question_id: this.props.match.params.id,
      name: "",
      description: "",
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
      .get(`${Url}/api/v1/questions/${this.state.question_id}`, {
        headers: {
          Authorization: token
        }
      })
      .then(res => {
        this.setState({
          name: this.Capitalize(res.data.name),
          description: this.Capitalize(res.data.description)
        });
      });
  };

  updateAnswerOptions = e => {
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
        .put(
          `${Url}/api/v1/questions/${question_id}/answer_options`,
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
    }
  };

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  toggle = e => {
    this.setState({
      correct: !this.state.correct
    });
  };

  render() {
    const { errorMessage, question, correct, content } = this.state;
    return (
      <React.Fragment>
        <Helmet>
          <meta charSet="utf-8" />
          <title>Question</title>
        </Helmet>
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
                      placeholder={question.description}
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
                <p style={{ color: "red" }}>{errorMessage}</p>
              </form>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default EditOptions;
