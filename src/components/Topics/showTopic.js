import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import Navigation from "components/Navigation/Navigation";
import EditIcon from "@material-ui/icons/Edit";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import Fab from "@material-ui/core/Fab";
import Tooltip from "@material-ui/core/Tooltip";
import ReactPlayer from 'react-player'

import "./style.css"

class showTopic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      topic: "",
      course_slug: this.props.match.params.course_slug,
      topic_id: this.props.match.params.id,
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
        if (res.status === 204) {
          alert("Topic Deleted successfully");
          this.props.history.replace("/profile");
        }
      })
      .catch(error => {
        alert("Course Creator Needed");
      });
  };

  render() {
    const user = JSON.parse(localStorage.getItem("user"));
    const { topic, course_slug, topic_id } = this.state;
    const ReactMarkdown = require("react-markdown");
    let { description_box, iframe_box, action_buttons } = "";

    if(user.status === 'educator') {
      action_buttons = (
        <span className="pull-right">
              <Link to={`/new_question/${topic_id}`}>
                <Button
                  variant="contained"
                  component="span"
                  color="secondary"
                  className="btn_topics"
                >
                  Add Question
                </Button>
              </Link>
              <Link to={`/update_topic/${course_slug}/topics/${topic_id}`}>
                <Tooltip  className="btn_topics" title="Edit Topic" aria-label="Edit Topic">
                  <Fab color="secondary">
                    <EditIcon />
                  </Fab>
                </Tooltip>
              </Link>
              <Tooltip  className="btn_topics" title="Delete Topic" aria-label="Delete Topic">
                <Fab color="secondary">
                  <DeleteIcon onClick={this.deleteTopic} />
                </Fab>
              </Tooltip>
            </span>
      )
    }

    if (topic && topic.description && topic.description.length > 3) {
      description_box = (
        <blockquote><ReactMarkdown source={topic.description}/></blockquote>
      )
    }

    if (topic && topic.video_url && topic.video_url.length > 3) {
      iframe_box = (
        <div className='player-wrapper'>
        <ReactPlayer
          url={topic.video_url}
          width='100%'
          height='100%'
          playing
          controls
          allowFullScreen
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          frameBorder="0"
        /></div>
      )
    }
    return (
      <div>
        <Navigation />
        <div className="main-content">
          <div className="container">
            {action_buttons}
            <h3>{topic.name}</h3>
            <div className="topic_content">
              {description_box}
            </div>
            {iframe_box}
          </div>
        </div>
      </div>
    );
  }
}

export default showTopic;
