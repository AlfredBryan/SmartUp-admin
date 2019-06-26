import React, { Component } from "react";
import axios from "axios";
import Pagination from "react-paginating";
import ReactMde from "react-mde";
import * as Showdown from "showdown";

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
      answer: ""
    };

    this.converter = new Showdown.Converter({
      tables: true,
      simplifiedAutoLink: true,
      strikethrough: true,
      tasklists: true
    });
  }

  handleAnswerChange = answer => {
    this.setState({ answer });
  };

  getInitialAnswerState = question => {
    return { selectedValue: "apple" };
  };

  fetchAssessment = () => {
    const token = localStorage.getItem("token");
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
        const { answer } = this.state;
        const result = res.data.questions.map(
          ({ id, name, description, answer_options, question_type }) => (
            <div key={id} className="assessment_question">
              <h3>{name}</h3>
              <blockquote>
                <ReactMarkdown source={description} />
              </blockquote>
              {question_type === "choice" ? (
                <RadioGroup
                  name="selected_option"
                  selectedValue={this.state.selectedValue}
                  onChange={this.handleAnswerSelect}
                >
                  {answer_options.map(item => (
                    <div key={item.id} className="col-md-6">
                      <div className="card">
                        <label key={item.id} className="answer_option">
                          <Radio value={item.content} />
                          {item.content}
                        </label>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              ) : (
                <div className="col-lg-8">
                  <ReactMde
                    onChange={this.handleAnswerChange}
                    value={answer}
                    generateMarkdownPreview={markdown =>
                      Promise.resolve(this.converter.makeHtml(markdown))
                    }
                  />
                </div>
              )}
            </div>
          )
        );
        this.setState({
          questions: result
        });
      })
      .catch(error => {});
  };

  handlePageChange = page => {
    this.setState({
      currentPage: page
    });
  };

  handleAnswerSelect = () => {};

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
