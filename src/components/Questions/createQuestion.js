import React, { Component } from "react";
import Navigation from "components/Navigation/Navigation";
import Spinner from "components/hoc/spinner";
import { Helmet } from "react-helmet";
import axios from "axios";
import "./style.css";
import ReactMde from "react-mde";
import * as Showdown from "showdown";
import "react-mde/lib/styles/css/react-mde-all.css";

//popup notification
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

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

const Url = process.env.REACT_APP_BASE_URL;

class createQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      topic_id: this.props.match.params.id,
      name: "",
      description: "",
      errorMessage: "",
      loading: false,
      correct: false,
      open: false,
      content: "",
      question_type: "",
      options: []
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

  updateOptions = options => {
    this.setState({ ...this.state, options });
  };

  Capitalize = str => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  postQuestion = e => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    let { name, description, topic_id, question_type } = this.state;

    if (name.length < 4 || description.length < 10) {
      alert("Please Enter fields");
      this.setState({
        errorMessage: "Enter all fields"
      });
    } else {
      axios
        .post(
          `${Url}/api/v1/questions`,
          {
            question: {
              name,
              description,
              topic_id,
              question_type
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
          if (res.status === 200) {
            this.setState({
              loading: false
            });
            this.props.history.replace("/questions");
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

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleDescriptionChange = description => {
    this.setState({ description });
  };

  handleCreateOptions = e => {
    e.preventDefault();
    this.updateOptions(
      this.state.options.concat({
        key: Date.now(),
        content: this.state.content,
        correct: false
      })
    );
  };

  render() {
    const { errorMessage, loading, open } = this.state;
    const { classes } = this.props;
    return (
      <React.Fragment>
        <Helmet>
          <meta charSet="utf-8" />
          <title>Question</title>
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
            <span id="snackbar-fab-message-id popup-text">Question Added</span>
          }
          action={
            <Button color="inherit" size="small" onClick={this.handleClose}>
              close
            </Button>
          }
          className={classes.snackbar}
        />
        <div className="main-content">
          <div className="container">
            <h3>Add Question</h3>
            <div className="center-div">
              <form onSubmit={this.postQuestion} className="form-horizontal">
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
                      placeholder="Enter Question ..."
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-lg-8 adjust-input control-label">
                    Content
                  </label>
                  <div className="col-lg-10">
                    <ReactMde
                      onChange={this.handleDescriptionChange}
                      value={this.state.description}
                      generateMarkdownPreview={markdown =>
                        Promise.resolve(this.converter.makeHtml(markdown))
                      }
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-md-2 adjust-input control-label">
                    Question Type
                  </label>
                  <div className="col-md-4">
                    <select
                      className="form-control"
                      name="question_type"
                      value={this.state.question_type}
                      onChange={this.handleChange}
                    >
                      {["choice", "theory"].map(lt => (
                        <option key={lt} value={lt}>
                          {this.Capitalize(lt)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <p style={{ color: "red" }}>{errorMessage}</p>
                <div className="form-group">
                  <div className="col-lg-10">
                    <Button
                      variant="contained"
                      component="span"
                      color="secondary"
                      className="form-control new-btn"
                      onClick={this.postQuestion}
                    >
                      {loading ? <Spinner /> : "Create"}
                    </Button>
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

createQuestion.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(createQuestion);
