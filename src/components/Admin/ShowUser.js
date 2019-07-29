import React, { Component } from "react";
import axios from "axios";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Moment from "react-moment";
import { Link } from "react-router-dom";

import Navigation from "components/Navigation/Navigation";

const Url = process.env.REACT_APP_BASE_URL;

class ShowUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: "",
      user_id: this.props.match.params.id,
      scores: "",
      attendance: []
    };
  }

  getUser = () => {
    const token = localStorage.getItem("token");
    const { user_id } = this.state;
    axios
      .get(`${Url}/api/v1/users/${user_id}`, {
        headers: {
          Authorization: token
        }
      })
      .then(res => {
        if (res.status === 200) {
          this.setState({
            user: res.data
          });
        }
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
        console.log(res.data);
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

  componentDidMount() {
    this.getUser();
    this.fetchAttendance();
    this.fetchTest();
  }

  render() {
    const { user, scores, attendance } = this.state;
    return (
      <React.Fragment>
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
                          {user.surname}
                        </strong>
                        <br />
                      </h4>
                    </div>
                    <p className="profile_data">
                      <small>{this.Capitalize(user.sex || "")}</small>{" "}
                      <small className="profile_divider" />
                      <small>{user.level}</small>
                      <small className="profile_divider" />
                      <small>{this.getAge(user.date_of_birth)}YRS</small>
                    </p>
                    <hr className="profile_hr" />
                    <p className="description text-center">
                      {user.address}
                      <br />
                      {user.email}
                    </p>
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
                  <h4 style={{ marginBottom: "20px" }}>Test Scores</h4>
                  {scores.length < 1 ? (
                    <div id="no-scores">
                      <h3>No Test Scores Yet</h3>
                    </div>
                  ) : (
                    <div className="test-scores">
                      {scores.map(score => (
                        <div key={score.id} className="flex-container">
                          <h5 className="test-name">{score.assessment.name}</h5>
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
                          <div className="show-attendance" key={attend.id}>
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
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default ShowUser;
