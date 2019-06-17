import React, { Component } from "react";
import "./course.css";
import axios from "axios";
import { Link } from "react-router-dom";
import EditIcon from "@material-ui/icons/Edit";
import Fab from "@material-ui/core/Fab";
import Tooltip from "@material-ui/core/Tooltip";

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
            <span className="pull-right">
                <Link to={`/new_assessment/${course.id}`}>
                    <button className="topics-button">Add Assessment</button>
                  </Link>
                  <Link to={`/new_topic/${course_slug}`}>
                    <button className="topics-button">Add Topic</button>
                  </Link>
                  <Link to={`/update_course/${course_slug}`}>
                  <Tooltip title="Edit Course" aria-label="Edit Course">
                      <Fab color="primary">
                        <EditIcon />
                      </Fab>
                    </Tooltip>
                  </Link>
                </span>
              <div>
                <h3 className="course-name">{course.name}</h3>
              </div>
              <div className="topics-cover container">
              <span className="pull-right">
                      {course.topics < 1 ? (
                        <span className="topics-span">No topics yet</span>
                      ) : (
                        <span className="topics-span">
                          Topics:{topics.length}
                        </span>
                      )}
                    </span>
                <h4>Description</h4>

                <blockquote>{course.description}</blockquote>
                 <br/>     
                <h4>Topics</h4>
                <ul className="topic_list">
                {topics.map(topic => (
                      <Link to={`/courses/${course_slug}/topics/${topic.id}`} key={topic.id}>
                        <li>
                        <div className="topic-card">
                          <span className="topic_name">{topic.name}</span>
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
