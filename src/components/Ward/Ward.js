import React, { Component } from "react";

import "./style.css";
import axios from "axios";
import Spinner from "../hoc/spinner";
import { Helmet } from "react-helmet";
//popup notification
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";

import Navigation from "components/Navigation/Navigation";

const styles = theme => ({
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
    fontSize: "1em"
  }
});

const Url = process.env.REACT_APP_BASE_URL;

class AddWard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ward_request: {
        email: ""
      },
      details: [],
      family_details: [],
      loading: false,
      visible: false,
      errMessage: "",
      open: false
    };
  }

  // popup notification functions
  handleClick = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  componentDidMount() {
    this.getList();
    this.getFamily();
    this.handleClick();
  }

  getList = e => {
    const token = localStorage.getItem("token");
    axios
      .get(`${Url}/api/v1/ward_requests`, {
        headers: {
          Authorization: token
        }
      })
      .then(res => {
        this.setState({
          details: res.data
        });
      });
  };

  getFamily = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(`${Url}/api/v1/registration/family`, {
        headers: {
          Authorization: token
        }
      });
      this.setState({
        family_details: res.data
      });
      return res;
    } catch (e) {
      return e.message;
    }
  };

  acceptGuardian = id => {
    const token = localStorage.getItem("token");
    axios
      .get(`${Url}/api/v1/ward_requests/${id}/approve`, {
        headers: {
          Authorization: token
        }
      })
      .then(res => {
        if (res) {
          this.setState({
            visible: true
          });
          this.getFamily();
        }
      })
      .catch(err => {});
  };

  cancelRequest = id => {
    const token = localStorage.getItem("token");
    axios
      .delete(`${Url}/api/v1/ward_requests/${id}`, {
        headers: {
          Authorization: token
        }
      })
      .then(res => {
        if (res) {
          this.setState({
            visible: true
          });
        }
      })
      .catch(err => {});
  };

  addWard = e => {
    const token = localStorage.getItem("token");
    e.preventDefault();
    const { email } = this.state.ward_request;
    if (email.length < 3) {
      this.setState({
        errMessage: "Valid email required"
      });
    } else {
      axios
        .post(
          `${Url}/api/v1/ward_requests`,
          { ward_request: { email } },
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
          if (res) {
            this.setState({
              loading: false
            });
            this.getList();
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

  handleChange = event => {
    const { name, value } = event.target;
    let ward_request = { ...this.state.ward_request, [name]: value };
    this.setState({ ward_request });
  };

  declineReqButton = (user, id) => {
    if (user.status !== "educator") {
      return (
        <Button
          onClick={() => this.cancelRequest(id)}
          className="cancel-btn"
          variant="contained"
          component="span"
          color="secondary"
        >
          {this.state.loading ? (
            <Spinner />
          ) : user.status === "guardian" ? (
            "Cancel"
          ) : (
            "Decline"
          )}
        </Button>
      );
    }
  };

  acceptReqButton = (user, id) => {
    if (user.status === "student") {
      return (
        <Button
          onClick={() => this.acceptGuardian(id)}
          variant="contained"
          component="span"
          color="primary"
        >
          {this.state.loading ? <Spinner /> : "Accept"}
        </Button>
      );
    }
  };

  render() {
    const user = JSON.parse(localStorage.getItem("user"));
    const { loading, details, family_details, visible, open } = this.state;
    const { classes } = this.props;

    return (
      <div>
        <Helmet>
          <meta charSet="utf-8" />
          <title>Family</title>
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
              No family yet
              <span className="user-popup">{user.status}</span>
            </span>
          }
          action={
            <Button color="inherit" size="small" onClick={this.handleClose}>
              close
            </Button>
          }
          className={classes.snackbar}
        />
        {family_details < 1 ? (
          <div className="main-content">
            <div className="container">
              <div className="row">
                <div className="container">
                  <div className="no-wards">
                    <h5>
                      No {user.status === "guardian" ? "Ward" : "Guardian"}s yet
                    </h5>
                    <div className="wards-cover">
                      <h5>What is this section for? </h5>
                      <br />
                      <p>
                        Everyone needs encouragement. This section allows you to
                        invite a student or guardian to be part of your progress
                        or view your progress as you learn
                      </p>
                    </div>
                  </div>
                </div>
                <div className="user-list" id={visible ? "fadeOut" : ""}>
                  {details.map(d => (
                    <li key={d.id}>
                      <div className="user-names">
                        {d.user.full_name}
                        {d.user.email}
                      </div>
                      <div className="ward_actions">
                        {this.declineReqButton(user, d.id)}
                        {this.acceptReqButton(user, d.id)}
                      </div>
                    </li>
                  ))}
                </div>
                {user.status !== "student" ? (
                  <form className="ward-form" onSubmit={this.addWard}>
                    <div className="d-flex">
                      <input
                        className="ward-input"
                        type="text"
                        name="email"
                        value={this.state.ward_request.email}
                        placeholder="Email ..."
                        onChange={this.handleChange}
                      />
                      <Button
                        onClick={this.addWard}
                        className="ward-button btn-submit"
                        className="cancel-btn"
                        variant="contained"
                        component="span"
                        color="secondary"
                      >
                        {loading ? <Spinner /> : "Confirm"}
                      </Button>
                    </div>
                  </form>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        ) : (
          <div>
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
                  Welcome to family section
                  <span className="user-popup">{user.status}</span>
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
              <div className="container">
                <div className="row">
                  <div className="container">
                    <div className="row">
                      <div>
                        <div className="row" id="assessments_home">
                          {family_details.map(d => (
                            <div key={d.id} className="col-md-4">
                              <div className="card">
                                <i
                                  style={{ fontSize: "30px", color: "blue" }}
                                  className="fa fa-vcard-o"
                                />
                                <h6 className="assessment_name">
                                  {d.full_name}
                                </h6>
                                <p className="assessment_course_name">
                                  {d.email}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="user-list" id={visible ? "fadeOut" : ""}>
                    {details.map(d => (
                      <li key={d.id}>
                        <div className="user-names">
                          {d.user.full_name}
                          {d.user.email}
                        </div>
                        <div className="actions">
                          {this.declineReqButton(user, d.id)}
                          {this.acceptReqButton(user, d.id)}
                        </div>
                      </li>
                    ))}
                  </div>
                  {user.status !== "student" ? (
                    <form className="ward-form" onSubmit={this.addWard}>
                      <div className="d-flex">
                        <input
                          className="ward-input"
                          type="text"
                          name="email"
                          value={this.state.ward_request.email}
                          placeholder="Email ..."
                          onChange={this.handleChange}
                        />
                        <Button
                          variant="contained"
                          component="span"
                          color="secondary"
                          className="ward-button"
                          onClick={this.addWard}
                        >
                          {loading ? <Spinner /> : "Confirm"}
                        </Button>
                      </div>
                    </form>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

AddWard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(AddWard);
