import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import Navigation from "components/Navigation/Navigation";

class showTopic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      topic: "",
      course_slug: this.props.match.params.course_slug,
      topic_id: this.props.match.params.id
    };
  }

  componentDidMount() {
    this.fetchTopic();
  }

  fetchTopic = () => {
    const token = localStorage.getItem("token");
    let { course_slug, topic_id } = this.state;
    axios
      .get(
        `https://smart-up.herokuapp.com/api/v1/courses/${course_slug}/topics/${topic_id}`,
        {
          headers: {
            Authorization: token
          }
        }
      )
      .then(res => {
        console.log(res);
        this.setState({
          topic: res.data
        });
      });
  };

  render() {
    const { topic, topics, course_slug } = this.state;
    return (
      <div>
        <Navigation />
        <div className="main-content">
          <div className="course_n_topics">
            <div className="align-course">
              <div>
                <h3 className="course-name">{topic.name}</h3>
                <span className="pull-right">
                  <Link to={`#`}>
                    <button className="topics-button">Edit Topic</button>
                  </Link>
                </span>
              </div>
              <div className="topics-cover">
                <ul>
                  <li>
                    <span>Description</span>
                    <span style={{ display: "flex" }}>
                      <hr id="line-colored" /> <hr id="line-gray" />
                    </span>
                  </li>
                  <li>
                    <p style={{ textTransform: "capitalize" }}>
                      {topic.description}
                    </p>
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

export default showTopic;
