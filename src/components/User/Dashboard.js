import React, { Component } from "react";
import "./Dashboard.css";
import axios from "axios";

//popup notification
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import Navigation from "components/Navigation/Navigation";

const token = localStorage.getItem("token");

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

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
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

  componentDidMount() {
    this.handleClick();
  }

  //capitalize function
  Capitalize = str => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  //Age function
  getAge = dateString => {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };
  //ends

  //Add ward function
  addWard = e => {
    e.preventDefault();
    const { email } = this.state;
    axios
      .post(
        "https://smart-up.herokuapp.com/api/v1/ward_requests",
        { email },
        {
          headers: {
            Authorization: token
          }
        }
      )
      .then(res => {});
  };
  //Ends

  render() {
    const { classes } = this.props;
    const { open } = this.state;
    const user = JSON.parse(localStorage.getItem("user"));
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
              Welcome to your profile{" "}
              <span className="user-popup">{user.first_name}</span>
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
                      <small>
                        {user.sex !== null ? (
                          this.Capitalize(user.sex)
                        ) : (
                          <p>Unauthorized User</p>
                        )}
                      </small>{" "}
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
                <div className="card-length">
                  <div className="flex-div">
                    <div className="card">
                      <i
                        style={{
                          marginTop: "30px",
                          fontSize: "40px",
                          color: "#0a306d"
                        }}
                        className="fa fa-vcard-o"
                      />
                      <h6 style={{ marginTop: "10px" }}>Get live help</h6>
                      <p style={{ fontSize: "12px", color: "grey" }}>
                        1:1 mentorship session
                      </p>
                    </div>
                    <div className="card left">
                      <i
                        style={{
                          marginTop: "30px",
                          fontSize: "40px",
                          color: "#0a306d"
                        }}
                        className="fa fa-empire"
                      />
                      <h6 style={{ marginTop: "10px" }}>Get freelance help</h6>
                      <p style={{ fontSize: "12px", color: "grey" }}>
                        Pay with escrow
                      </p>
                    </div>
                    <div style={{ textAlign: "center" }} className="card left">
                      <i
                        style={{
                          marginTop: "30px",
                          fontSize: "40px",
                          color: "#0a306d"
                        }}
                        className="fa fa-gg"
                      />
                      <h6 style={{ marginTop: "10px" }}>Get code reviewed</h6>
                      <p style={{ fontSize: "12px", color: "grey" }}>
                        Pay with escrow
                      </p>
                    </div>
                  </div>
                </div>
                <div className="ward-section">
                  <h5 style={{ marginBottom: "20px" }}>My Wards</h5>
                  <div className="wards">
                    <h6 style={{ marginLeft: "20px", paddingTop: "10px" }}>
                      Wards
                    </h6>
                    <hr />
                    <h6 style={{ marginLeft: "20px" }}>Educator</h6>
                    <hr />
                    <h6 style={{ marginLeft: "20px" }}>Educator</h6>
                    <hr />
                    <h6 style={{ marginLeft: "20px" }}>Educator</h6>
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

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Dashboard);
