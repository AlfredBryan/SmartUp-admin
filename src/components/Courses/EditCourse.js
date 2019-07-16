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
import { Helmet } from "react-helmet";

const Url = process.env.REACT_APP_BASE_URL;

class EditCourse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      description: "",
      active: false,
      loading: false,
      course_slug: this.props.match.params.slug,
      course: ""
    };

    this.converter = new Showdown.Converter({
      tables: true,
      simplifiedAutoLink: true,
      strikethrough: true,
      tasklists: true
    });
  }

  fetchCourse = () => {
    const token = localStorage.getItem("token");
    axios
      .get(
        `${Url}/api/v1/courses/${this.state.course_slug}`,

        {
          headers: {
            Authorization: token
          }
        }
      )
      .then(res => {
        this.setState({
          name: res.data.name,
          description: res.data.description,
          active: res.data.active
        });
      });
  };

  updateCourse = e => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const { name, description, active, course_slug } = this.state;
    axios
      .put(
        `${Url}/api/v1/courses/${course_slug}`,
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
        if (res.status === 200) {
          this.setState({
            loading: false
          });
          this.props.history.replace(`/courses/${res.data.slug}`);
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

  toggle = e => {
    this.setState({
      active: !this.state.course.active
    });
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleDescriptionChange = description => {
    this.setState({ description });
  };

  componentDidMount() {
    this.fetchCourse();
  }

  render() {
    const { loading, name, description, active } = this.state;
    return (
      <div>
        <Helmet>
          <meta charSet="utf-8" />
          <title>Course</title>
        </Helmet>
        <Navigation />
        <div className="main-content">
          <div className="container">
            <h3>Edit Course</h3>
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
                      value={name}
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
                      value={description}
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
                      checked={active}
                      onChange={this.toggle}
                      value={(active || "").toString()}
                      name="active"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <div className="col-lg-12">
                    <Button
                      variant="contained"
                      component="span"
                      color="secondary"
                      className="form-control new-btn"
                      onClick={this.updateCourse}
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
    );
  }
}

export default EditCourse;
