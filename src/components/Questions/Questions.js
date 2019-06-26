import React, { Component } from "react";
import axios from "axios";
import Navigation from "components/Navigation/Navigation";

import Collapsible from "react-collapsible";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

//popup notification
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import EditIcon from "@material-ui/icons/Edit";
import Fab from "@material-ui/core/Fab";
import Tooltip from "@material-ui/core/Tooltip";

const styles = theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  formControl: {
    margin: theme.spacing.unit
  },
  root: {
    position: "relative",
    overflow: "hidden"
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  },
  button: {
    marginBottom: theme.spacing.unit
  },
  snackbar: {
    position: "absolute"
  },
  snackbarContent: {
    width: 360,
    fontSize: "1.2em"
  }
});

class Questions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: [],
      answer_options: [],
      question_type: "",
      open: false,
      error: false
    };
  }

  // popup notification functions
  handleClick = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  Capitalize = str => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  //ends

  componentDidMount() {
    this.fetchQuestions();
  }

  fetchQuestions = () => {
    const token = localStorage.getItem("token");
    axios
      .get("https://smart-up.herokuapp.com/api/v1/questions", {
        headers: {
          Authorization: token
        }
      })
      .then(res => {
        if (res.data.errors) {
          this.setState({
            error: true
          });
        } else {
          this.setState({
            questions: res.data
          });
        }
      })
      .catch(error => {});
  };

  deleteOption = (question_id, id) => {
    const token = localStorage.getItem("token");
    axios
      .delete(
        `https://smart-up.herokuapp.com/api/v1/questions/${question_id}/answer_options/${id}`,
        {
          headers: {
            Authorization: token
          }
        }
      )
      .then(res => {
        if (res.statusText === "No Content") {
          this.fetchQuestions();
          this.handleClick();
        }
      })
      .catch(error => {
        if (error) {
          alert(`${error}`);
        }
      });
  };

  render() {
    const { questions, error, open } = this.state;
    const { classes } = this.props;
    const user = JSON.parse(localStorage.getItem("user"));
    const ReactMarkdown = require("react-markdown");
    if (error) {
      return (
        localStorage.clear("token"),
        localStorage.clear("user"),
        this.props.history.push("/login")
      );
    } else {
      return (
        <React.Fragment>
          <Helmet>
            <meta charSet="utf-8" />
            <title>Questions</title>
          </Helmet>
          <Navigation />
          <Snackbar
            open={open}
            autoHideDuration={4000}
            onClose={this.handleClose}
            ContentProps={{
              "aria-describedby": "snackbar-fab-message-id",
              className: classes.snackbarContent
            }}
            message={
              <span id="snackbar-fab-message-id popup-text">
                Removed Successfully
              </span>
            }
            action={
              <Button color="inherit" size="small" onClick={this.handleClose}>
                close
              </Button>
            }
            className={classes.snackbar}
          />
          <div className="main-content">
            <div className="container questions">
              <h3>Questions</h3>
              {questions.map(question => (
                <div key={question.id} className="toggle-question">
                  <Collapsible
                    className="question"
                    trigger={this.Capitalize(question.name)}
                    triggerSibling={this.Capitalize(question.question_type)}
                  >
                    {user.status === "educator" || user.admin === true ? (
                      <span className="pull-right">
                        <Link to={`/edit_question/${question.id}`}>
                          <Tooltip title="Edit" aria-label="Edit">
                            <Fab color="secondary">
                              <EditIcon />
                            </Fab>
                          </Tooltip>
                        </Link>
                      </span>
                    ) : (
                      ""
                    )}

                    <blockquote>
                      <ReactMarkdown source={question.description} />
                    </blockquote>
                    <div>
                      {question.answer_options.map(option => (
                        <ul className="question_options" key={option.id}>
                          <li className="question_content">
                            {user.status === "educator" ||
                            user.admin === true ? (
                              <Link
                                to={`/edit_option/${option.question_id}/${
                                  option.id
                                }`}
                              >
                                {this.Capitalize(option.content)}
                              </Link>
                            ) : (
                              <span>{this.Capitalize(option.content)}</span>
                            )}

                            {user.status === "educator" ||
                            user.admin === true ? (
                              <i
                                onClick={() => {
                                  this.deleteOption(
                                    option.question_id,
                                    option.id
                                  );
                                }}
                                style={{ cursor: "pointer", color: "red" }}
                                className="fa fa-trash-o pull-right"
                              />
                            ) : (
                              ""
                            )}
                          </li>
                        </ul>
                      ))}
                    </div>
                  </Collapsible>
                </div>
              ))}
            </div>
          </div>
        </React.Fragment>
      );
    }
  }
}

Questions.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Questions);
