import React, { Component } from "react";
import Navigation from "components/Navigation/Navigation";
import axios from "axios";
import { Link } from "react-router-dom";

import EditIcon from "@material-ui/icons/Edit";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import Fab from "@material-ui/core/Fab";
import Tooltip from "@material-ui/core/Tooltip";

//popup notification
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";

import "./style.css";

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

class showGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      study_group_id: this.props.match.params.id,
      group: "",
      memberships: [],
      user_emails: "",
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

  fetchGroup = () => {
    const token = localStorage.getItem("token");
    const { study_group_id } = this.state;
    axios
      .get(
        `https://smart-up.herokuapp.com/api/v1/study_groups/${study_group_id}`,
        {
          headers: {
            Authorization: token
          }
        }
      )
      .then(res => {
        if (res.status === 200) {
          this.setState({
            group: res.data,
            memberships: res.data.memberships
          });
        }
      });
  };

  AddUsers = e => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const { study_group_id, user_emails } = this.state;
    axios
      .post(
        "https://smart-up.herokuapp.com/api/v1/group_memberships",
        {
          group_membership: {
            study_group_id,
            user_emails
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
          this.fetchGroup();
          alert("Users Added Successfully");
        }
      });
  };

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  deleteGroupUser = id => {
    const token = localStorage.getItem("token");

    axios
      .delete(`https://smart-up.herokuapp.com/api/v1/group_memberships/${id}`, {
        headers: {
          Authorization: token
        }
      })
      .then(res => {
        if (res.status === 204) {
          this.handleClick();
          this.fetchGroup();
        }
      });
  };

  componentDidMount() {
    this.fetchGroup();
  }

  render() {
    const { classes } = this.props;
    const { memberships, group, user_emails, loading, open } = this.state;
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
            <span id="snackbar-fab-message-id popup-text">
              Member
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
          <div className="container" id="show_group">
            <div>
              <Link to={`/attendance/${group.id}`}>
                <Button variant="contained" component="span" color="primary">
                  Attendance
                </Button>
              </Link>
              <Link to={`/update_group/${group.id}`} className="button-area">
                <Tooltip title="Edit Group" aria-label="Edit">
                  <Fab color="primary">
                    <EditIcon />
                  </Fab>
                </Tooltip>
              </Link>
            </div>
            <h2>{group.name}</h2>
            <form onSubmit={this.AddUsers} className="form-horizontal">
              <h4>
                <strong>Add Users</strong>
              </h4>
              <div className="form-group">
                <div className="col-md-12">
                  <span onClick={this.AddUsers} className="pull-right">
                    <Tooltip title="Add Users" aria-label="Edit">
                      <Fab color="primary">
                        <GroupAddIcon />
                      </Fab>
                    </Tooltip>
                  </span>
                  <textarea
                    name="user_emails"
                    value={user_emails}
                    onChange={this.handleChange}
                    rows="4"
                  />
                </div>
              </div>
            </form>
            <div>
              {memberships.length > 0 ? (
                <table className="table-striped">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {memberships.map(mem => (
                      <tr key={mem.id}>
                        <td>
                          <span style={{ padding: "1.3em" }}>
                            {mem.user.surname ? (
                              <span>{mem.user.surname}</span>
                            ) : (
                              <span>Not available</span>
                            )}
                          </span>
                          <span>
                            {mem.user.first_name ? (
                              <span>{mem.user.first_name}</span>
                            ) : (
                              <span>Not available</span>
                            )}
                          </span>
                        </td>
                        <td>{mem.user.email}</td>
                        <td>
                          <i
                            onClick={() => {
                              this.deleteGroupUser(mem.id);
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
                  <h3 className="group-card">No members Yet</h3>
                </span>
              )}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

showGroup.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(showGroup);
