import React, { Component } from "react";
import "./course.css";
import axios from "axios";
import Spinner from "../hoc/spinner";
import Checkbox from "@material-ui/core/Checkbox";
import Navigation from "components/Navigation/Navigation";
import Button from "@material-ui/core/Button";

import ReactMde from "react-mde";
import * as Showdown from "showdown";
import "react-mde/lib/styles/css/react-mde-all.css";

class newCourse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      description: "",
      active: false,
      loading: false,
      institution_id: this.props.match.params.slug,
      errorMessage: ""
    };

    this.converter = new Showdown.Converter({
      tables: true,
      simplifiedAutoLink: true,
      strikethrough: true,
      tasklists: true
    });
  }

  postCourse = e => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const { name, description, active } = this.state;

    if (name.length < 4 || description.length < 10) {
      this.setState({
        errorMessage: "Please Enter all fields"
      });
    } else {
      let Id = this.state.institution_id;

      let Url = "https://smart-up.herokuapp.com/api/v1/courses";

      if (Id) {
        Url += `?institution_id=${Id}`;
      }
      axios
        .post(
          Url,
          {
            course: {
              name,
              description,
              active
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
          this.setState({
            loading: false,
            course: res.data
          });

          if (res.data.id !== null) {
            if (res.data.institution_id) {
              this.props.history.replace(
                `/institution/${Id}/courses/${res.data.slug}`
              );
            } else {
              this.props.history.replace(`/courses/${res.data.slug}`);
            }
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

  toggle = e => {
    this.setState({
      active: !this.state.active
    });
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleDescriptionChange = description => {
    this.setState({ description });
  };

  render() {
    const { loading, errorMessage } = this.state;
    return (
      <div>
        <Navigation />
        <div>
          <div className="main-content">
            <div className="container">
              <h3>Add Course</h3>
              <div className="center-div">
                <form onSubmit={this.handleSubmit} className="form-horizontal">
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
                      Introduction
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
                    <label className="col-lg-8 adjust-input control-label">
                      Active:
                    </label>
                    <div className="col-lg-12">
                      <Checkbox
                        checked={this.state.active}
                        onChange={this.toggle}
                        value={this.state.active}
                        name="active"
                      />
                    </div>
                  </div>
                  <p style={{ color: "red" }}>{errorMessage}</p>
                  <div className="form-group">
                    <div className="col-lg-12">
                      <Button
                        variant="contained"
                        component="span"
                        color="primary"
                        className="form-control new-btn"
                        onClick={this.postCourse}
                      >
                        {loading ? <Spinner /> : "Create"}
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

export default newCourse;
