import React, { Component } from "react";
import "./attendance.css";
import Navigation from "components/Navigation/Navigation";
import axios from "axios";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import Select from "react-select";

import EditIcon from "@material-ui/icons/Edit";
import DoneAllIcon from "@material-ui/icons/DoneAll";
import Fab from "@material-ui/core/Fab";
import Tooltip from "@material-ui/core/Tooltip";

//popup notification
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";

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

class showAttendance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      study_group_id: this.props.match.params.study_group_id,
      attendance_id: this.props.match.params.id,
      group: "",
      attendance: "",
      members: [],
      attendance_users: [],
      selectedOption: null,
      loading: false,
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
  //ends

  fetchAttendance = () => {
    const token = localStorage.getItem("token");
    const { attendance_id } = this.state;
    axios
      .get(`${Url}/api/v1/attendances/${attendance_id}`, {
        headers: {
          Authorization: token
        }
      })
      .then(res => {
        if (res.status === 200) {
          this.setState({
            attendance: res.data,
            attendance_users: res.data.attendance_users
          });
        }
      });
  };

  AddUsers = e => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const { attendance_id, selectedOption } = this.state;
    if (selectedOption === null) {
      alert("Please select a user");
      this.setState({
        errorMessage: "Select a user"
      });
    } else {
      axios
        .post(
          `${Url}/api/v1/attendance_users`,
          {
            attendance_user: {
              attendance_id: attendance_id,
              user_id: selectedOption.value
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
              loading: false,
              selectedOption: null
            });
            this.fetchAttendance();
            this.fetchGroup();
          }
        });
    }
  };

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  fetchGroup = () => {
    const token = localStorage.getItem("token");
    axios
      .get(`${Url}/api/v1/study_groups/${this.state.study_group_id}`, {
        headers: {
          Authorization: token
        }
      })
      .then(res => {
        this.setState({
          members: res.data.members
        });
      });
  };

  deleteAttendanceUser = id => {
    const token = localStorage.getItem("token");
    axios
      .delete(`${Url}/api/v1/attendance_users/${id}`, {
        headers: {
          Authorization: token
        }
      })
      .then(res => {
        if (res.status === 204) {
          this.handleClick();
          this.fetchAttendance();
          this.fetchGroup();
        }
      });
  };

  handleMemberChange = selectedOption => {
    this.setState({ selectedOption });
  };

  memberOptions = members => {
    let options = [];
    members.map(item =>
      options.push({
        value: item.id,
        label: `${item.first_name} - ${item.email}`
      })
    );
    return options;
  };

  componentDidMount() {
    this.fetchAttendance();
    this.fetchGroup();
  }

  render() {
    const { classes } = this.props;
    const user = JSON.parse(localStorage.getItem("user"));
    const {
      attendance_users,
      members,
      attendance,
      selectedOption,
      study_group_id,
      loading,
      open
    } = this.state;
    return (
      <React.Fragment>
        <Helmet>
          <meta charSet="utf-8" />
          <title>Attendance</title>
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
              User
              <span className="user-popup">Removed </span>
              Successfully
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
          <div id="show_attendance">
            <div>
              {user.status === "educator" || user.admin === true ? (
                <Link
                  to={`/study_groups/${study_group_id}/edit_attendance/${
                    attendance.id
                  }`}
                  className="button-area"
                >
                  <Tooltip title="Edit Group" aria-label="Edit">
                    <Fab color="secondary">
                      <EditIcon />
                    </Fab>
                  </Tooltip>
                </Link>
              ) : (
                ""
              )}
            </div>
            <div className="col-md-6">
              <h3>{attendance.name}</h3>
              {attendance_users.length > 0 ? (
                <table className="table-striped">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendance_users.map(att => (
                      <tr key={att.id}>
                        <td>
                          <span style={{ padding: "0.5em" }}>
                            {att.user.surname ? (
                              <span>{att.user.surname}</span>
                            ) : (
                              <span>Not available</span>
                            )}
                          </span>
                          <span>
                            {att.user.first_name ? (
                              <span>{att.user.first_name}</span>
                            ) : (
                              <span>Not available</span>
                            )}
                          </span>
                        </td>
                        <td>{att.user.email}</td>
                        <td>
                          <i
                            onClick={() => {
                              this.deleteAttendanceUser(att.id);
                            }}
                            className="fa fa-trash group_delete"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <span>
                  <h3 className="group-card">No present users yet</h3>
                </span>
              )}
            </div>
            <div className="col-md-6">
              <form
                onSubmit={this.AddUsers}
                className="form-horizontal mark-attendance"
              >
                <h4>
                  <strong>Mark user as present</strong>
                </h4>
                <div className="form-group">
                  <div className="col-md-12">
                    {user.status === "educator" || user.admin === true ? (
                      <span onClick={this.AddUsers} className="pull-right">
                        <Tooltip title="Mark user" aria-label="Mark">
                          <Fab color="secondary">
                            <DoneAllIcon />
                          </Fab>
                        </Tooltip>
                      </span>
                    ) : (
                      ""
                    )}
                    <Select
                      className="col-md-8"
                      class="form-control m-bot15"
                      value={selectedOption}
                      onChange={this.handleMemberChange}
                      name="question"
                      options={this.memberOptions(members)}
                      required
                    />
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

showAttendance.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(showAttendance);
