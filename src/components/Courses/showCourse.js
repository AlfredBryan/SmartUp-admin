import React, { Component } from "react";
import "./course.css";
import axios from "axios";
import { Link } from "react-router-dom";

import Navigation from "components/Navigation/Navigation";

class showCourse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      course: "",
      topics: [],
      course_slug: this.props.match.params.slug
    };
  }

  componentDidMount() {
    this.fetchCourse();
  }

  fetchCourse = () => {
    const token = localStorage.getItem("token");
    let { course_slug } = this.state;
    axios
      .get(`https://smart-up.herokuapp.com/api/v1/courses/${course_slug}/`, {
        headers: {
          Authorization: token
        }
      })
      .then(res => {
        console.log(res);
        this.setState({
          course: res.data,
          topics: res.data.topics
        });
      });
  };

  render() {
    const { course, topics, course_slug } = this.state;
    return (
      <div>
        <Navigation />
        <div className="main-content">
          <div className="course_n_topics">
            <div className="align-course">
              <div>
                <h3 className="course-name">{course.name}</h3>
                <span className="pull-right">
                  <Link to={`/new_topic/${course_slug}`}>
                    <button className="topics-button">Add Topic</button>
                  </Link>
                  <Link to={`/update_course/${course_slug}`}>
                    <button className="topics-button">Edit Course</button>
                  </Link>
                </span>
              </div>
              <div className="topics-cover">
                <ul>
                  <li>
                    <span>
                      {course.topics < 1 ? (
                        <span className="topics-span">No topics yet</span>
                      ) : (
                        <span className="topics-span">
                          Topics:{topics.length}
                        </span>
                      )}
                    </span>
                  </li>
                  <li>
                    <span>Description</span>
                    <span style={{ display: "flex" }}>
                      <hr id="line-colored" /> <hr id="line-gray" />
                    </span>
                  </li>
                  <li>
                    <p style={{ textTransform: "capitalize" }}>
                      {course.description}
                    </p>
                  </li>
                  <span className="topic-head">Topics</span>
                  <span style={{ display: "flex" }}>
                    <hr id="line-colored" /> <hr id="line-gray" />
                  </span>
                  <li className="topic-listed">
                    {topics.map(topic => (
                      <Link
                        to={`/courses/${course_slug}/topics/${topic.id}`}
                        key={topic.id}
                      >
                        <div className="topic-card">
                          <span className="topic_name">{topic.name}</span>
                        </div>
                      </Link>
                    ))}
                  </li>
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
