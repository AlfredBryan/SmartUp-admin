import React, { Component } from "react";
import "./Dashboard.css";
import axios from "axios";

import Sidebar from "../Sidebar/Sidebar";
import routes from "../../routes";
import AdminNavbar from "../Navbars/AdminNavbar";
import classNames from "classnames";

//popup notification
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";

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
    width: 360
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

  componentDidMount() {
    this.handleClick();
  }

  // Getting path name from location
  getBrandText = path => {
    for (let i = 0; i < routes.length; i++) {
      if (this.props.location.pathname.indexOf(routes[i].path) !== -1) {
        return routes[i].name;
      }
    }
    return "Brand";
  };

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

  render() {
    const { classes } = this.props;
    const { open } = this.state;
    return (
      <React.Fragment>
        <Sidebar
          {...this.props}
          routes={routes}
          hasImage={this.state.hasImage}
        />
        <div id="main-panel" className="main-panel" ref="mainPanel">
          <AdminNavbar
            {...this.props}
            brandText={this.getBrandText(this.props.location.pathname)}
          />
        </div>
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
              Welcome to SmartUp
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
              <div className="col-xs-12 col-sm-8 col-md-8">
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
              <div className="col-xs-12 col-sm-4 col-md-4">
                <div className="card-length" />
                <div className="card-below" />
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
