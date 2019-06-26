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
      selections: {}
    };
  }

sendAnswer = (question_id, option_id) => {
    const token = localStorage.getItem("token");
    const { selections, assessment_id } = this.state;
    axios
      .post(
        `https://smart-up.herokuapp.com/api/v1/assessments/${
          this.state.assessment_id}/answer`, {
            answer: { 
                assessment_id: assessment_id,  
                question_id: question_id, 
                answer_option_id: option_id 
            }
          },
        {
          headers: {
            Authorization: token
          }
        }
    ).then(res => {
        selections[res.data.question_id] = res.data.answer_option_id
        this.setState({
            selections: selections
        });    
    }
    ).catch(error => {});
}


  fetchAssessment = () => {
    const token = localStorage.getItem("token");
    const { selections } = this.state;
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
        const result = res.data.questions.map(
          ({ id, name, description, answer_options }) => (
            <div key={id} className="assessment_question">
              <h3>{name}</h3>
              <blockquote>
                <ReactMarkdown source={description} />
              </blockquote>

              <RadioGroup
                name="selected_option"
                selectedValue={selections[id]}
                onChange={this.handleAnswerSelect}
              >
                {answer_options.map(item => (
                  <div key={item.id} className="col-md-6">
                    <div className="card">
                      <label key={item.id} className="answer_option">
                        <Radio value={[item.question_id, item.id]} />
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
          questions: result
        });
      })
      .catch(error => {});
  };

  fetchUserAnswers = () => {
    const token = localStorage.getItem("token");
    const { selections } = this.state;
  }

  handlePageChange = page => {
    this.setState({
      currentPage: page
    });
  };

  handleAnswerSelect = (value) => {
    this.sendAnswer(value[0], value[1]);
  };

  componentDidMount() {
    this.fetchAssessment();
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
