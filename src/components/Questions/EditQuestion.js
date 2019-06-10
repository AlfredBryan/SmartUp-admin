import React, { Component } from "react";
import Navigation from "components/Navigation/Navigation";
import Spinner from "components/hoc/spinner";
import axios from "axios";
import AnswerOptions from "./AnswerOptions";

import "./style.css";

class EditQuestion extends Component {
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
      options: [],
      question: "",
      answer_options: []
    };
  }

  updateOptions = options => {
    this.setState({ ...this.state, options });
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
          name: this.Capitalize(res.data.name),
          description: this.Capitalize(res.data.description)
        });
      });
  };

  postQuestion = e => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    let { name, description, question_id } = this.state;

    const answer_options_attributes = this.state.options.reduce(
      (objAccumulator, option, index) => {
        objAccumulator[index] = option;
        return objAccumulator;
      },
      {}
    );

    if (name.length < 4 || description.length < 10) {
      alert("Please Enter fields");
      this.setState({
        errorMessage: "Enter all fields"
      });
    } else {
      axios
        .put(
          `https://smart-up.herokuapp.com/api/v1/questions/${question_id}`,
          {
            question: {
              name,
              description,
              answer_options_attributes
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

  handleCreateOptions = e => {
    e.preventDefault();
    this.updateOptions(
      this.state.options.concat({
        key: Date.now(),
        content: this.state.content,
        correct: false
      })
    );
  };

  render() {
    const { errorMessage, loading, options, question } = this.state;
    return (
      <React.Fragment>
        <Navigation />
        <div className="main-content">
          <div className="container">
            <div className="center-div">
              <form onSubmit={this.postQuestion} className="form-horizontal">
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
                    <input
                      value={this.state.content}
                      onChange={this.handleChange}
                      type="text"
                      name="content"
                      className="form-options"
                    />
                    <button
                      className="option_btn"
                      onClick={this.handleCreateOptions}
                    >
                      Create Options
                    </button>
                    {options.map(option => (
                      <AnswerOptions
                        key={option.key}
                        optionKey={option.key}
                        options={this.state.options}
                        content={option.content}
                        correct={option.correct}
                        updateOptions={this.updateOptions}
                      />
                    ))}
                  </div>
                </div>
                <p style={{ color: "red" }}>{errorMessage}</p>
                <div className="form-group">
                  <div className="col-lg-10">
                    <button
                      onClick={this.postQuestion}
                      className="form-control btn-submit"
                    >
                      {loading ? <Spinner /> : "Create"}
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
