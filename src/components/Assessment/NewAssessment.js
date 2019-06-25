import React, { Component } from "react";
import axios from "axios";
import Spinner from "../hoc/spinner";
import Navigation from "components/Navigation/Navigation";
import ReactMde from "react-mde";
import * as Showdown from "showdown";
import "react-mde/lib/styles/css/react-mde-all.css";
import Button from "@material-ui/core/Button";
import {Helmet} from "react-helmet";


class NewAssessment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      description: "",
      loading: false,
      course_id: this.props.match.params.id,
      errorMessage: ""
    };

    this.converter = new Showdown.Converter({
      tables: true,
      simplifiedAutoLink: true,
      strikethrough: true,
      tasklists: true
    });
  }

  postAssessment = e => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const { name, description, course_id } = this.state;
    if (name.length < 3 || description.length < 10) {
      this.setState({
        errorMessage: "Enter all fields"
      });
    } else {
      axios
        .post(
          "https://smart-up.herokuapp.com/api/v1/assessments",
          {
            assessment: {
              name,
              description,
              course_id
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
          if (res.status === 200 && res.statusText === "OK") {
            this.setState({
              loading: false
            });
            alert(`Assessment Added`);
          }
        });
    }
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleDescriptionChange = (description) => {
    this.setState({ description });
  };

  render() {
    const { loading, errorMessage } = this.state;
    return (
      <div>
      <Helmet>
          <meta charSet="utf-8" />
          <title>Assessment</title>
        </Helmet>
        <Navigation />
        <div>
          <div className="main-content">
            <div className="container">
              <div className="center-div">
                <form
                  onSubmit={this.postAssessment}
                  className="form-horizontal"
                >
                  <h3>New Assessment</h3>
                  <hr></hr>
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
                    <ReactMde onChange={this.handleDescriptionChange} value={this.state.description} 
                    generateMarkdownPreview={markdown =>
                    Promise.resolve(this.converter.makeHtml(markdown))} />
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
                        onClick={this.postAssessment}
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
      </div>
    );
  }
}

export default NewAssessment;
