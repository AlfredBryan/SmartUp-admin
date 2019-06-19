import React, { Component } from "react";
import Navigation from "components/Navigation/Navigation";
import Spinner from "components/hoc/spinner";
import axios from "axios";
import Checkbox from "@material-ui/core/Checkbox";
import { Link } from "react-router-dom";
import ReactMde from "react-mde";
import * as Showdown from "showdown";
import "react-mde/lib/styles/css/react-mde-all.css";

//popup notification
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import "./style.css";

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

class EditQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      question_id: this.props.match.params.id,
      name: "",
      description: "",
      answer_options: [],
      errorMessage: "",
      loading: false,
      correct: false,
      open: false,
      content: "",
      question: ""
    };

    this.converter = new Showdown.Converter({
      tables: true,
      simplifiedAutoLink: true,
      strikethrough: true,
      tasklists: true
    });
  }

  // popup notification functions
  handleClick = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };
  //ends

  componentDidMount() {
    this.fetchQuestion();
  }

  Capitalize = str => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  fetchQuestion = () => {
    const token = localStorage.getItem("token");
    axios
      .get(
        `https://smart-up.herokuapp.com/api/v1/questions/${
          this.state.question_id
        }`,
        {
          headers: {
            Authorization: token
          }
        }
      )
      .then(res => {
        console.log(res);
        // populate fields
        this.setState({
          answer_options: res.data.answer_options,
          name: this.Capitalize(res.data.name),
          description: this.Capitalize(res.data.description)
        });
      });
  };

  updateQuestion = e => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    let { name, description, question_id } = this.state;
    axios
      .put(
        `https://smart-up.herokuapp.com/api/v1/questions/${question_id}`,
        {
          question: {
            name,
            description
          }
        },
        {
          headers: {
            Authorization: token
          }
        },
        this.setState({
          loading: true
        })
      )
      .then(res => {
        console.log(res);
        if (res.status === 200) {
          this.setState({
            loading: false
          });
          this.handleClick();
        }
      })
      .catch(err => {
        if (err) {
          this.setState({
            loading: false
          });
        }
      });
  };

  handleChange = e => {
    this.setState({[e.target.name]: e.target.value});
  };

  handleDescriptionChange = (description) => {
    this.setState({ description });
  };

  toggleOption = () => {
    this.setState({
      correct: !this.state.correct
    });
  };

  postAnswerOptions = e => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    let { question_id } = this.state;

    const { correct, content } = this.state;

    if (content.length < 3 || correct === null) {
      alert("Please Enter options");
      this.setState({
        errorMessage: "Enter options"
      });
    } else {
      axios
        .post(
          `https://smart-up.herokuapp.com/api/v1/questions/${question_id}/answer_options`,
          {
            answer_option: {
              question_id,
              correct,
              content
            }
          },
          {
            headers: {
              Authorization: token
            }
          }
        )
        .then(res => {
          console.log(res);
          if (res.status === 200) {
            this.setState({
              content: ""
            });
            this.fetchQuestion();
            this.handleClick();
          }
        })
        .catch(err => {
          if (err) {
            this.setState({
              loading: false
            });
          }
        });
    }
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
          this.fetchQuestion();
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
    const { classes } = this.props;
    const { loading, correct, content, open, answer_options } = this.state;
    return (
      <React.Fragment>
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
            <span id="snackbar-fab-message-id popup-text">Successful</span>
          }
          action={
            <Button color="inherit" size="small" onClick={this.handleClose}>
              close
            </Button>
          }
          className={classes.snackbar}
        />
        <div className="main-content">
          <div className="container question">
            <h3>Edit Question</h3>
            <div className="center-div">
              <form className="form-horizontal">
                <div className="form-group">
                  <label className="col-lg-8 adjust-input control-label">
                    Question
                  </label>
                  <div className="col-lg-10">
                    <input
                      className="form-control"
                      type="text"
                      name="name"
                      value={this.state.name}
                      placeholder="Enter question..."
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-lg-8 adjust-input control-label">
                    Content
                  </label>
                  <div className="col-lg-10">
                  <ReactMde onChange={this.handleDescriptionChange} value={this.state.description} 
                    generateMarkdownPreview={markdown =>
                    Promise.resolve(this.converter.makeHtml(markdown))} />
                  </div>
                </div>
                <div className="form-group">
                <span>
                    <label className="adjust-input control-label">
                      Correct:
                    </label>
                      <Checkbox
                        checked={correct}
                        onChange={this.toggleOption}
                        value={correct}
                        name="correct"
                      />
                      <input
                        type="text"
                        name="content"
                        onChange={this.handleChange}
                        value={content}
                      />
                      <button
                      className="option_btn"
                      onClick={this.postAnswerOptions}
                    >
                      Add Option
                    </button>
                    </span>
                </div>
                <div className="form-group">
                {answer_options.map(option => (
                      <ul className="question_options" key={option.id}>
                        <li className="question_content">
                          <Link
                            to={`/edit_option/${option.question_id}/${
                              option.id
                            }`}
                          >
                            {this.Capitalize(option.content)}({option.correct ? "Correct" : "Incorrect"})
                          </Link>
                          <i
                            onClick={() => {
                              this.deleteOption(option.question_id, option.id);
                            }}
                            style={{ cursor: "pointer", color: "red" }}
                            className="fa fa-trash-o pull-right"
                          />
                        </li>
                      </ul>
                    ))}
                </div>

                <div className="form-group">
                  <div className="col-lg-10">
                    <button
                      className="option_btn form-control"
                      onClick={this.updateQuestion}
                    >
                      {loading ? <Spinner /> : "Update"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

EditQuestion.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(EditQuestion);
