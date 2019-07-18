import React, { Component } from "react";
import "./course.css";
import axios from "axios";
import { Link } from "react-router-dom";
import EditIcon from "@material-ui/icons/Edit";
import Fab from "@material-ui/core/Fab";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import { Helmet } from "react-helmet";
//file upload
import FileBase64 from "react-file-base64";

import Navigation from "components/Navigation/Navigation";

const Url = process.env.REACT_APP_BASE_URL;

class showCourse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      course: "",
      topics: [],
      course_slug: this.props.match.params.slug,
      course_creator: "",
      image: ""
    };
  }

  componentDidMount() {
    this.fetchCourse();
  }

  fetchCourse = () => {
    const token = localStorage.getItem("token");
    let { course_slug } = this.state;
    axios
      .get(`${Url}/api/v1/courses/${course_slug}/`, {
        headers: {
          Authorization: token
        }
      })
      .then(res => {
        this.setState({
          course: res.data,
          topics: res.data.topics,
          course_creator: res.data.creator
        });
      });
  };

  //File upload begins
  uploadImageFile = file => {
    this.setState({ image: file.base64 });
  };

  render() {
    const { course, topics, course_slug, course_creator } = this.state;
    const user = JSON.parse(localStorage.getItem("user"));
    const ReactMarkdown = require("react-markdown");
    return (
      <div>
        <Helmet>
          <meta charSet="utf-8" />
          <title>Course</title>
        </Helmet>
        <Navigation />
        <div className="main-content">
          <div className="course_n_topics">
            <div className="align-course">
              <span className="pull-right">
                {user.status === "educator" || user.admin === true ? (
                  <Link to={`/new_assessment/${course.id}`}>
                    <Button
                      variant="contained"
                      component="span"
                      color="secondary"
                      className="topics-botton new-btn"
                    >
                      Add Assessment
                    </Button>
                  </Link>
                ) : (
                  ""
                )}
                {user.status === "educator" || user.admin === true ? (
                  <Link to={`/new_topic/${course_slug}`}>
                    <Button
                      variant="contained"
                      component="span"
                      color="secondary"
                      className="topics-botton new-btn"
                    >
                      Add Topic
                    </Button>
                  </Link>
                ) : (
                  ""
                )}
                {user.id === course_creator.id ? (
                  <Link to={`/update_course/${course_slug}`}>
                    <Tooltip title="Edit Course" aria-label="Edit">
                      <Fab color="secondary">
                        <EditIcon />
                      </Fab>
                    </Tooltip>
                  </Link>
                ) : (
                  ""
                )}
              </span>
              <div>
                <h3 className="course-name">{course.name}</h3>
                {user.id === course_creator.id ? (
                  <div class="col-md-12">
                    <label class="file-upload btn btn-danger">
                      Add Files...
                      <FileBase64
                        multiple={true}
                        onDone={this.uploadImageFile}
                      />
                    </label>
                  </div>
                ) : (
                  ""
                )}
              </div>
              <div className="topics-cover container">
                <span className="pull-right">
                  {course.topics < 1 ? (
                    <span className="topics-span">No topics yet</span>
                  ) : (
                    <span className="topics-span">Topics:{topics.length}</span>
                  )}
                </span>
                <h4>Introduction</h4>

                <blockquote>
                  <ReactMarkdown source={course.description} />
                </blockquote>
                <br />
                <h4>Topics</h4>
                <ul className="topic_list">
                  {topics.map(topic => (
                    <Link
                      to={`/courses/${course_slug}/topics/${topic.id}`}
                      key={topic.id}
                    >
                      <li>
                        <div className="topic-card">
                          <span className="topic_name">{topic.name}</span>
                          <span className="pull-right topic-lecture-type">
                            {topic.lecture_type}
                          </span>
                        </div>
                      </li>
                    </Link>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default showCourse;
