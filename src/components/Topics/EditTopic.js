import React, { Component } from "react";
import axios from "axios";
import Spinner from "../hoc/spinner";
import Checkbox from "@material-ui/core/Checkbox";
import Navigation from "components/Navigation/Navigation";
import ReactMde from "react-mde";
import * as Showdown from "showdown";
import { Helmet } from "react-helmet";
import Button from "@material-ui/core/Button";
import "react-mde/lib/styles/css/react-mde-all.css";

const Url = process.env.REACT_APP_BASE_URL;

class EditTopic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      description: "",
      active: false,
      loading: false,
      course_slug: this.props.match.params.course_slug,
      topic_id: this.props.match.params.id,
      lecture_type: "text",
      video_url: "",
      errorMessage: ""
    };

    this.converter = new Showdown.Converter({
      tables: true,
      simplifiedAutoLink: true,
      strikethrough: true,
      tasklists: true
    });
  }

  fetchTopic = () => {
    const token = localStorage.getItem("token");
    const { topic_id, course_slug } = this.state;
    axios
      .get(
        `${Url}/api/v1/courses/${course_slug}/topics/${topic_id}`,

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
          active: res.data.active,
          lecture_type: res.data.lecture_type,
          video_url: res.data.video_url
        });
      });
  };

  Capitalize = str => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  editTopic = e => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const {
      name,
      description,
      active,
      lecture_type,
      course_slug,
      topic_id,
      video_url
    } = this.state;

    if (name.length < 3 || (description.length < 3 && video_url.length < 10)) {
      this.setState({
        errorMessage: "Please Enter required fields"
      });
    } else {
      axios
        .put(
          `${Url}/api/v1/courses/${course_slug}/topics/${topic_id}`,
          {
            topic: {
              name,
              description,
              active,
              lecture_type,
              video_url
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
            this.props.history.replace(
              `/courses/${course_slug}/topics/${topic_id}`
            );
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

  componentDidMount() {
    this.fetchTopic();
  }

  render() {
    const {
      loading,
      errorMessage,
      name,
      description,
      active,
      lecture_type,
      video_url
    } = this.state;
    return (
      <div>
        <Helmet>
          <meta charSet="utf-8" />
          <title>Topic</title>
        </Helmet>
        <Navigation />
        <div>
          <div className="main-content">
            <div className="container">
              <h3>Edit Topic</h3>
              <div className="center-div">
                <form onSubmit={this.editTopic} className="form-horizontal">
                  <div className="form-group">
                    <label className="col-lg-8 adjust-input control-label">
                      Topic
                    </label>
                    <div className="col-lg-12">
                      <input
                        className="form-control"
                        type="text"
                        name="name"
                        value={name}
                        placeholder="Topic..."
                        onChange={this.handleChange}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="col-lg-8 adjust-input control-label">
                      Content
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
                      Active
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
                    <label className="col-lg-8 adjust-input control-label">
                      Lecture Type
                    </label>
                    <div className="col-lg-12">
                      <select
                        className="form-control"
                        name=""
                        id=""
                        value={lecture_type}
                        onChange={this.handleChange}
                      >
                        {["text", "video"].map(lt => (
                          <option key={lt} value={lt}>
                            {this.Capitalize(lt)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="col-lg-8 adjust-input control-label">
                      Video url
                    </label>
                    <div className="col-lg-12">
                      <input
                        className="form-control"
                        type="text"
                        name="video_url"
                        value={video_url}
                        placeholder="Url..."
                        onChange={this.handleChange}
                      />
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
                        onClick={this.editTopic}
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

export default EditTopic;
