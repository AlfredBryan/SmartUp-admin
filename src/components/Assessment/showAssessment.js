import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import "./style.css";
import Navigation from "components/Navigation/Navigation";
import Collapsible from "react-collapsible";
import EditIcon from "@material-ui/icons/Edit";
import Fab from "@material-ui/core/Fab";
import Tooltip from "@material-ui/core/Tooltip";

class showAssessment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      assessment_id: this.props.match.params.id,  
      assessment: "",
      questions: []
    };
  }
  componentDidMount() {
    this.fetchAssessment();
  }

  Capitalize = str => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  fetchAssessment = () => {
    const token = localStorage.getItem("token");
    axios
      .get(`https://smart-up.herokuapp.com/api/v1/assessments/${this.state.assessment_id}`, 
      
      {
        headers: {
          Authorization: token
        }
      })
      .then(res => {
        this.setState({
          assessment: res.data,
          questions: res.data.questions
        });
      });
  };

  renderAnswerOptions = question => {
     if (question.answer_options && question.answer_options.length > 0) {
        return (
            question.answer_options.map(option => (
                <ul className="question_options" key={option.id}>
                  <li className="question_content">
                  {this.Capitalize(option.content)}
                  </li>
                </ul>
              ))
        );
     } 
  }

  render() {
    const { assessment, questions } = this.state;
    const ReactMarkdown = require('react-markdown')
    return (
        <div>
        <Navigation />
        <div className="main-content">
          <div className="container questions">
          <Link to={`/edit_assessment/${assessment.id}`} className="button-area">
              <Tooltip title="Edit" aria-label="Edit">
                <Fab color="primary">
                  <EditIcon />
                </Fab>
              </Tooltip>
            </Link>
          <h3>{assessment.name}</h3>
          <span className="pull-right">
                      {questions.length < 1 ? (
                        <span className="topics-span">No questions yet</span>
                      ) : (
                        <span className="topics-span">
                          Questions :{questions.length}
                        </span>
                      )}
                    </span>
              <div className="">
                <blockquote>
                <ReactMarkdown source={assessment.description} />
                </blockquote>  
                <ul className="assessment_questions">
                  {questions.map(question => (
                    <li key={question.id} className="toggle-question">
                    <Collapsible className="question" trigger={question.name}>
                    <blockquote>{question.description}</blockquote>
                      <div>
                        {this.renderAnswerOptions(question)}
                      </div>
                    </Collapsible>
                  </li>
                  ))}  
                </ul>
              </div>
          </div>
        </div>
      </div>
    );
  }
}

export default showAssessment;
