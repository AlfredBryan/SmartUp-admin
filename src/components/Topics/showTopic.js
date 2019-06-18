import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import Navigation from "components/Navigation/Navigation";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import Fab from "@material-ui/core/Fab";
import Tooltip from "@material-ui/core/Tooltip";


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
        this.setState({
          topic: res.data
        });
      });
  };

  deleteTopic = () => {
    const token = localStorage.getItem("token");
    let { course_slug, topic_id } = this.state;
    axios
      .delete(
        `https://smart-up.herokuapp.com/api/v1/courses/${course_slug}/topics/${topic_id}`,
        {
          headers: {
            Authorization: token
          }
        }
      )
      .then(res => {
        console.log(res);
        if (res.status === 204) {
          alert("Topic Deleted successfully");
          this.props.history.replace("/profile");
        }
      })
      .catch(error => {
        console.log(error.message);
        alert("Course Creator Needed");
      });
  };

  render() {
    const { topic, course_slug, topic_id } = this.state;
    const ReactMarkdown = require('react-markdown')
    return (
      <div>
        <Navigation />
        <div className="main-content">
          <div className="container">
          <span className="pull-right">
                  <Link to={`/new_question/${topic_id}`}>
                    <button className="topics-button">Add Question</button>
                  </Link>
                  <Link to={`/update_topic/${course_slug}/topics/${topic_id}`}>
                  <Tooltip title="Edit Topic" aria-label="Edit Topic">
                      <Fab color="primary">
                        <EditIcon/>
                      </Fab>
                    </Tooltip>
                  </Link>
                  <Tooltip title="Delete Topic" aria-label="Delete Topic">
                      <Fab color="primary">
                        <DeleteIcon onClick={this.deleteTopic}/>
                      </Fab>
                    </Tooltip>
                </span>
                <h3>{topic.name}</h3>
              <div className="topic_content">
                <blockquote>
                <ReactMarkdown source={topic.description} />
                </blockquote>
              </div>
            <div className="align-course">
              
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default showTopic;
