import React, { Component } from "react";
import axios from "axios";
import Pagination from "react-paginating";

import Navigation from "components/Navigation/Navigation";
import { RadioGroup, Radio } from "react-radio-group";
import ArrowLeftIcon from "@material-ui/icons/ArrowLeft";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import LastPageIcon from "@material-ui/icons/LastPage";
import Fab from "@material-ui/core/Fab";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";

class takeAssessment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      assessment_id: this.props.match.params.id,
      questions: [],
      currentPage: 1,
      possible_selections: [],
      selections: {}
    };
  }

sendAnswer = (option) => {
    const token = localStorage.getItem("token");
    const { selections, assessment_id } = this.state;
    axios
      .post(
        `https://smart-up.herokuapp.com/api/v1/assessments/${
          this.state.assessment_id}/answer`, {
            answer: { 
                assessment_id: assessment_id,  
                question_id: option.question_id, 
                answer_option_id: option.id 
            }
          },
        {
          headers: {
            Authorization: token
          }
        }
    ).then(res => {
        selections[res.data.question_id] = res.data.answer_option
        this.setState({
            selections: selections
        });
    }
    ).catch(error => {});
}
  Capitalize = str => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };


  fetchAssessment = () => {
    const token = localStorage.getItem("token");
    const { possible_selections } = this.state;
    const ReactMarkdown = require("react-markdown");

    axios
      .get(
        `https://smart-up.herokuapp.com/api/v1/assessments/${
          this.state.assessment_id
        }`,
        {
          headers: {
            Authorization: token
          }
        }
      )
      .then(res => {  
        res.data.questions.map(question => {
            possible_selections.push(question.answer_options);
        })
        this.setState({
            possible_selections: possible_selections.flat()
          });  
        const result = res.data.questions.map(
          ({ id, name, description, answer_options }, index) => (
            <div key={id} className="assessment_question">
              <h3>Question <span>{index + 1}</span> of <span>{res.data.questions.length}</span></h3>  
              <h3>{this.Capitalize(name)}</h3>
              <blockquote>
                <ReactMarkdown source={description} />
              </blockquote>

              <RadioGroup
                key={id}
                name="selected_option"
                selectedValue={this.realSelectedValue(id)}
                onChange={this.handleAnswerSelect}
              >
                {answer_options.map(item => (
                  <div key={item.id} className="col-md-6">
                    <div className="card">
                      <label key={item.id} className="answer_option">
                        <Radio value={item.id} />
                        {item.content}
                      </label>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )
        );
        this.setState({
          questions: result,
        });
      })
      .catch(error => {});
  };

  fetchUserAnswers = () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    const { selections, assessment_id } = this.state;

    axios
      .get(
        `https://smart-up.herokuapp.com/api/v1/assessments/${assessment_id}/answers?user_id=${user.id}`,
        {
          headers: {
            Authorization: token
          }
        }
      ).then(res => { 
        res.data.map(answer => {
            selections[answer.question.id] = (answer.question.question_type === "choice" ? answer.answer_option : answer.content)
        })  
        this.setState({
            selections: selections
        });
       })
      .catch(error => {});
  }

  searchArray(value, array){
    for (var i=0; i < array.length; i++) {
        if (array[i]["id"] === value) {
            return array[i];
        }
    }
}

  getKeyByValue(object, value) {
    return Object.keys(object).find(key => this.searchArray(value, object[key])["id"] === value);
  }

  realSelectedValue = id => {
    const { selections } = this.state;
    if (selections[id]) { 
      return selections[id]["id"]; 
    }
  }

  handlePageChange = page => {
    this.setState({
      currentPage: page
    });
  };

  handleAnswerSelect = (id) => { 
    const { possible_selections } = this.state;
    let answer_option = this.searchArray(id, possible_selections)
    this.sendAnswer(answer_option);
  };

  componentDidMount() {
    this.fetchAssessment();
    this.fetchUserAnswers();
  }

  render() {
    const { questions, currentPage } = this.state;

    const limit = 1;
    const pageCount = questions.length;
    const total = questions.length * limit;

    return (
      <React.Fragment>
        <Navigation />
        <div className="main-content">
          <div className="container" id="take_assessment">
            <ul>{questions[currentPage - 1]}</ul>
            <Pagination
              total={total}
              limit={limit}
              pageCount={pageCount}
              currentPage={currentPage}
            >
              {({
                pages,
                currentPage,
                hasNextPage,
                hasPreviousPage,
                previousPage,
                nextPage,
                totalPages,
                getPageItemProps
              }) => (
                <div className="container nav-buttons">
                  <Tooltip title="First page" aria-label="First page">
                    <Fab
                      color="secondary"
                      {...getPageItemProps({
                        pageValue: 1,
                        onPageChange: this.handlePageChange
                      })}
                    >
                      <FirstPageIcon />
                    </Fab>
                  </Tooltip>

                  {hasPreviousPage && (
                    <Tooltip title="Previous" aria-label="Previous">
                      <Fab
                        color="secondary"
                        {...getPageItemProps({
                          pageValue: previousPage,
                          onPageChange: this.handlePageChange
                        })}
                      >
                        <ArrowLeftIcon />
                      </Fab>
                    </Tooltip>
                  )}

                  {hasNextPage && (
                    <Tooltip title="Next" aria-label="Next">
                      <Fab
                        color="secondary"
                        {...getPageItemProps({
                          pageValue: nextPage,
                          onPageChange: this.handlePageChange
                        })}
                      >
                        <ArrowRightIcon />
                      </Fab>
                    </Tooltip>
                  )}

                  <Tooltip title="Last page" aria-label="Last page">
                    <Fab
                      color="secondary"
                      {...getPageItemProps({
                        pageValue: totalPages,
                        onPageChange: this.handlePageChange
                      })}
                    >
                      <LastPageIcon />
                    </Fab>
                  </Tooltip>

                  {!hasNextPage && (
                    <Button
                      variant="contained"
                      component="span"
                      color="primary"
                      className="finish-button"
                    >
                      Finish
                    </Button>
                  )}
                </div>
              )}
            </Pagination>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default takeAssessment;
