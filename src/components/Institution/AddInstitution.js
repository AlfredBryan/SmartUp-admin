import React, { Component } from "react";
import axios from "axios";

import "./style.css";
import Spinner from "../hoc/spinner";
//popup notification
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
//file upload
import FileBase64 from "react-file-base64";

//Navigation
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

class AddInstitution extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      motto: "",
      email: "",
      phone: "",
      logo: "",
      loading: false,
      response: ""
    };
  }

  // popup notification functions
  handleClick = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };
  //Ends

  //File upload begins
  uploadImageFile = file => {
    this.setState({ logo: file.base64 });
  };
  //Ends here

  handleSubmit = e => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    let { name, motto, email, phone, logo } = this.state;
    if (name.length < 3 && email.length < 8 && phone.length < 10) {
      alert("Please Enter all fields");
    } else {
      axios
        .post(
          "https://smart-up.herokuapp.com/api/v1/institutions",
          {
            institution: {
              name,
              motto,
              email,
              phone,
              logo
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
          if (res) {
            this.setState({
              loading: false,
              response: res.data
            });
            this.handleClick();
          }
        })
        .catch(err => {
          console.log(err);
          if (err) {
            this.setState({
              loading: false
            });
          }
        });
    }
  };

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  render() {
    const { loading, open, response } = this.state;
    const { classes } = this.props;
    return (
      <div>
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
              <span className="user-popup">{response.name}</span> Added
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
          <div className="container">
            <h2>Create Institution</h2>
            <div className="col-md-9" id="institution-settings">
              <form onSubmit={this.handleSubmit} className="form-horizontal">
                <div className="form-group">
                  <label className="col-lg-3 control-label">
                    Institution name:
                  </label>
                  <div className="col-lg-8">
                    <input
                      className="form-control"
                      type="text"
                      name="name"
                      value={this.state.name}
                      placeholder="Institution Name ..."
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-lg-3 control-label">
                    Contact Email:
                  </label>
                  <div className="col-lg-8">
                    <input
                      className="form-control"
                      name="email"
                      type="email"
                      value={this.state.email}
                      placeholder="Contact email ..."
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-lg-3 control-label">Motto:</label>
                  <div className="col-lg-8">
                    <input
                      className="form-control"
                      type="text"
                      name="motto"
                      value={this.state.motto}
                      placeholder="Motto ..."
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-lg-3 control-label">Phone:</label>
                  <div className="col-lg-8">
                    <input
                      className="form-control"
                      name="phone"
                      type="text"
                      value={this.state.phone}
                      placeholder="Phone Number ..."
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-lg-3 control-label">Logo:</label>
                  <div className="col-lg-8">
                    <FileBase64
                      multiple={false}
                      onDone={this.uploadImageFile}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <div className="col-lg-12">
                    <Button
                      variant="contained"
                      component="span"
                      color="primary"
                      className="form-control new-btn"
                      onClick={this.handleSubmit}
                    >
                      {loading ? <Spinner /> : "Submit"}
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

AddInstitution.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(AddInstitution);
