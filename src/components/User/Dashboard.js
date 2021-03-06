import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import "./Dashboard.css";

//popup notification
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Navigation from "components/Navigation/Navigation";
import { Helmet } from "react-helmet";

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

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      scores: [],
      open: false,
      wards: [],
      attendance: [],
      assessment: []
    };
  }

  // popup notification functions
  handleClick = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };
  //ends

  //capitalize function
  Capitalize = str => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  //Age function
  getAge = dateString => {
    let today = new Date();
    let birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    let m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };
  //ends

  fetchAssessments = () => {
    const token = localStorage.getItem("token");
    axios
      .get(`${Url}/api/v1/assessments`, {
        headers: {
          Authorization: token
        }
      })
      .then(res => {
        this.setState({
          assessment: res.data
        });
      });
  };

  fetchTest = e => {
    const token = localStorage.getItem("token");
    axios
      .get(`${Url}/api/v1/assessment_results`, {
        headers: {
          Authorization: token
        }
      })
      .then(res => {
        this.setState({
          scores: res.data
        });
      });
  };

  fetchAttendance = () => {
    const token = localStorage.getItem("token");
    axios
      .get(`${Url}/api/v1/attendances`, {
        headers: {
          Authorization: token
        }
      })
      .then(res => {
        if (res.status === 200) {
          this.setState({
            attendance: res.data
          });
        }
      });
  };

  fetchWards = () => {
    const token = localStorage.getItem("token");
    axios
      .get(`${Url}/api/v1/users`, {
        headers: {
          Authorization: token
        }
      })
      .then(res => {
        this.setState({
          wards: res.data
        });
      });
  };

  map_user_level = level => {
    switch (true) {
      case level <= 6:
        return `Primary ${level}`;
      case level > 6 && level <= 9:
        return `JSS ${level - 6}`;
      case level > 9 && level <= 12:
        return `SS ${level - 9}`;
      case level > 12 && level <= 13:
        return "A Level";
      case level > 13 && level <= 14:
        return "100 Level";
      case level > 14 && level <= 15:
        return "200 Level";
      default:
        return level;
    }
  };

  componentDidMount() {
    this.handleClick();
    this.fetchTest();
    this.fetchWards();
    this.fetchAttendance();
    this.fetchAssessments();
  }

  render() {
    const { scores, wards, attendance, assessment } = this.state;
    const user = JSON.parse(localStorage.getItem("user"));
    return (
      <React.Fragment>
        <Helmet>
          <meta charSet="utf-8" />
          <title>SmartUp</title>
        </Helmet>
        <Navigation />
        <div className="main-content">
          <div className="container">
            <div className="row">
              <div className="col-xs-12 col-sm-4 col-md-4">
                <div className="newcard card-user">
                  <div className="image">
                    <img src={require("../../images/bgimg.jpg")} alt="..." />
                  </div>
                  <div className="content">
                    <div className="author">
                      {user.image_url !== null ? (
                        <img
                          className="avatar border-gray"
                          src={user.image_url}
                          alt="..."
                        />
                      ) : (
                        <i className="fa fa-user avatar no_pics" />
                      )}

                      <h4 className="title">
                        <strong>Hi,</strong>
                        <strong style={{ padding: "0.5em" }}>
                          {user.first_name}
                        </strong>
                        <br />
                      </h4>
                    </div>
                    <p className="profile_data">
                      <small>{this.Capitalize(user.sex || "")}</small>
                      <span className="p-divder-1">|</span>

                      <small>{this.map_user_level(user.level)}</small>

                      <span className="p-divder-2">|</span>
                      <small>{this.getAge(user.date_of_birth)}YRS</small>
                    </p>
                    <hr className="profile_hr" />
                    <div className="description">
                      <div id="user_details">{user.address}</div>
                      <div id="user_details">{user.email}</div>
                    </div>
                  </div>
                  <hr />
                  <div className="text-center footer-social">
                    <i className="fa fa-facebook footer-user" />
                    <i className="fa fa-google footer-user" />
                    <i className="fa fa-twitter footer-user" />
                    <i className="fa fa-instagram footer-user" />
                  </div>
                </div>
              </div>
              <div className="col-xs-12 col-sm-8 col-md-8">
                <div className="ward-section">
                  {(() => {
                    if (user.status === "student") {
                      return (
                        <div>
                          <h3>Assessments</h3>
                          {assessment.length < 1 ? (
                            <div id="no-assessment">
                              <h3>No Assessment yet</h3>
                            </div>
                          ) : (
                            <div className="row" id="assessments_home">
                              {assessment.map(ass => (
                                <div key={ass.id} className="col-md-6">
                                  <div className="card">
                                    <Link
                                      to={`/assessment/${ass.id}`}
                                      className="display-uni"
                                    >
                                      <i className="fa fa-vcard-o assessment_logo" />
                                      <h6 className="assessment_name">
                                        {ass.name}
                                      </h6>
                                      <p className="assessment_course_name">
                                        Course: {ass.course.name}
                                      </p>
                                    </Link>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                          <h4 style={{ marginBottom: "20px" }}>Test Scores</h4>
                          {scores.length < 1 ? (
                            <div id="no-scores">
                              <h3>No Test Scores Yet</h3>
                            </div>
                          ) : (
                            <div className="test-scores">
                              {scores.map(score => (
                                <Link
                                  key={score.id}
                                  to={`/test_display/${score.id}`}
                                >
                                  <div className="flex-container">
                                    <h5 className="test-name">
                                      {score.assessment.name}
                                    </h5>
                                    <span>
                                      <div>
                                        {score.grade}
                                        <CircularProgressbar
                                          value={score.score}
                                          text={`${score.score}%`}
                                          className="test-progress"
                                        />
                                      </div>
                                    </span>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          )}
                          <div className="ward-section">
                            <h4 style={{ marginBottom: "20px" }}>Attendance</h4>
                            {attendance.length < 1 ? (
                              <div id="no-attendance">
                                <h3>No Attendance Yet</h3>
                              </div>
                            ) : (
                              <div className="attendance-list">
                                {attendance.map(attend => (
                                  <div
                                    className="show-attendance"
                                    key={attend.id}
                                  >
                                    {attend.name}
                                    <span className="pull-right">
                                      {attend.attendees.map(att => (
                                        <div key={att.id}>
                                          {user.id === att.id ? (
                                            <i
                                              className="fa fa-check fa-2x"
                                              id="correct-answer"
                                            />
                                          ) : (
                                            ""
                                          )}
                                        </div>
                                      ))}
                                    </span>
                                    <span className="pull-right">
                                      <b>
                                        <Moment format="Do MMMM YYYY">
                                          {attendance.marked_on}
                                        </Moment>
                                      </b>
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    }
                  })()}
                  {(() => {
                    if (user.status === "educator") {
                      return (
                        <div>
                          <div className="ward-section">
                            <h4 style={{ marginBottom: "20px" }}>Attendance</h4>
                            {attendance.length < 1 ? (
                              <div id="no-attendance">
                                <h3>No Attendance Yet</h3>
                              </div>
                            ) : (
                              <div className="attendance-list">
                                {attendance.map(attend => (
                                  <div
                                    className="show-attendance"
                                    key={attend.id}
                                  >
                                    {attend.name}
                                    <span className="pull-right">
                                      {attend.attendees.map(att => (
                                        <div key={att.id}>
                                          {user.id === att.id ? (
                                            <i
                                              className="fa fa-check fa-2x"
                                              id="correct-answer"
                                            />
                                          ) : (
                                            ""
                                          )}
                                        </div>
                                      ))}
                                    </span>
                                    <span className="pull-right">
                                      <b>
                                        <Moment format="Do MMMM YYYY">
                                          {attendance.marked_on}
                                        </Moment>
                                      </b>
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    }
                  })()}
                  {(() => {
                    if (user.status === "guardian") {
                      return (
                        <div>
                          <h3>Wards</h3>
                          <div className="row ward-list" id="assessments_home">
                            {wards.map(stud => (
                              <div key={stud.id} className="col-md-6">
                                <div className="card">
                                  <Link
                                    to={`/display_user/${stud.id}`}
                                    className="display-uni"
                                  >
                                    <i
                                      style={{ fontSize: "4em" }}
                                      className="fa fa-user"
                                    />
                                    <h6 className="assessment_name">
                                      <span style={{ padding: "0.3em" }}>
                                        {stud.surname}
                                      </span>
                                      {stud.first_name}
                                    </h6>
                                    <p className="assessment_course_name">
                                      <strong>Grade</strong>:{stud.level}
                                    </p>
                                  </Link>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Dashboard);
