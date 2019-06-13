import React, { Component } from "react";

import "./style.css";
import Navigation from "components/Navigation/Navigation";
import Spinner from "components/hoc/spinner";
import axios from "axios";

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
      question: ""
    };
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
      .get(
        `https://smart-up.herokuapp.com/api/v1/assessments/${assessment_id}`,
        {
          headers: {
            Authorization: token
          }
        }
      )
      .then(res => {
        console.log(res);
        if (res.status === 200 && res.statusText === "OK") {
          this.setState({
            name: res.data.name,
            description: res.data.description
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

  componentDidMount() {
    this.fetchAssessment();
    this.fetchQuestions();
  }

  render() {
    const { loading, errorMessage, questions, question } = this.state;
    console.log(question);
    return (
      <React.Fragment>
        <Navigation />
        <div>
          <div className="main-content">
            <div className="container">
              <div className="center-div">
                <form
                  onSubmit={this.postAssessment}
                  className="form-horizontal"
                >
                  <div className="form-group">
                    <label className="col-lg-8 adjust-input control-label">
                      Assessment name:
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
                      Description:
                    </label>
                    <div className="col-lg-12">
                      <textarea
                        rows="6"
                        className="form-control"
                        name="description"
                        type="text"
                        value={this.state.description}
                        placeholder="Description ..."
                        onChange={this.handleChange}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="col-lg-8 adjust-input control-label">
                      Questions:
                    </label>
                    <div className="col-lg-12">
                      <select
                        value={question}
                        class="form-control m-bot15"
                        onChange={this.handleChange}
                        name="question"
                        required
                      >
                        <option value="" disabled selected>
                          --Select--
                        </option>
                        {questions.map(q => (
                          <option key={q.id} value={q.name}>
                            {q.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <p style={{ color: "red" }}>{errorMessage}</p>
                  <div className="form-group">
                    <div className="col-lg-12">
                      <button
                        onClick={this.postAssessment}
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
        </div>
      </React.Fragment>
    );
  }
}

export default AddQuestion;
