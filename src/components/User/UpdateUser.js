import React, { Component } from "react";
import axios from "axios";
import { DatePickerInput } from "rc-datepicker";
import "rc-datepicker/lib/style.css";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Helmet } from "react-helmet";
import moment from "moment";

//Alert
import swal from "sweetalert";

//file upload
import FileBase64 from "react-file-base64";

//popup notification
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";

import "./userupdate.css";
import Spinner from "components/hoc/spinner";
import Navigation from "components/Navigation/Navigation";

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
    fontSize: "1.3em"
  }
});

const Url = process.env.REACT_APP_BASE_URL;

class UpdateUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      first_name: "",
      surname: "",
      address: "",
      phone: "",
      state: "select",
      image: "",
      date_of_birth: "",
      sex: "select",
      level: "1",
      open: false,
      loading: false,
      errorMessage: ""
    };
  }

  // popup notification functions
  handleClick = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };
  //pop up ends

  //File upload begins
  uploadImageFile = file => {
    this.setState({ image: file.base64 });
  };
  //Ends here

  Capitalize = str => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  handleSubmit = e => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const {
      first_name,
      surname,
      address,
      phone,
      state,
      date_of_birth,
      level,
      image,
      sex
    } = this.state;
    if (
      first_name.length < 3 ||
      surname.length < 3 ||
      address.length < 5 ||
      phone.length < 10 ||
      sex.length < 4 ||
      level.length < 1 ||
      image.length < 3
    ) {
      swal({
        title: "Fields cannot be empty",
        text: "Please enter all fields",
        icon: "warning",
        dangerMode: true
      });
    } else {
      axios
        .put(
          `${Url}/api/v1/registration`,
          {
            user: {
              first_name,
              surname,
              address,
              phone,
              state,
              date_of_birth,
              sex,
              image,
              level
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
            localStorage.setItem("user", JSON.stringify(res.data));
            this.props.history.replace("/profile");
          }
        });
    }
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleDateChange = dateString => {
    this.setState({
      date_of_birth: dateString + 1
    });
  };

  // populate input fields
  componentDidMount() {
    const user = JSON.parse(localStorage.getItem("user"));
    this.setState({
      first_name: user.first_name,
      surname: user.surname,
      address: user.address,
      phone: user.phone,
      state: user.state,
      sex: user.sex,
      level: user.level,
      image: user.image_url,
      date_of_birth: moment(user.date_of_birth).format("l")
    });
  }

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
  //ends

  render() {
    let states = [
      "Abia",
      "Adamawa",
      "Anambra",
      "Akwa Ibom",
      "Bauchi",
      "Bayelsa",
      "Benue",
      "Borno",
      "Cross River",
      "Delta",
      "Ebonyi",
      "Enugu",
      "Edo",
      "Ekiti",
      "FCT - Abuja",
      "Gombe",
      "Imo",
      "Jigawa",
      "Kaduna",
      "Kano",
      "Katsina",
      "Kebbi",
      "Kogi",
      "Kwara",
      "Lagos",
      "Nasarawa",
      "Niger",
      "Ogun",
      "Ondo",
      "Osun",
      "Oyo",
      "Plateau",
      "Rivers",
      "Sokoto",
      "Taraba",
      "Yobe",
      "Zamfara"
    ];
    const { classes } = this.props;
    const { open, loading, errorMessage, date_of_birth } = this.state;
    const user = JSON.parse(localStorage.getItem("user"));
    return (
      <div>
        <Helmet>
          <meta charSet="utf-8" />
          <title>Profile</title>
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
              Profile Updated Successfully
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
              <div className="col-md-12">
                <div className="text-center form-horizontal-user">
                  {user.image_url !== null ? (
                    <img
                      className="avatar border-gray edit_avatar"
                      src={user.image_url}
                      alt="..."
                    />
                  ) : (
                    <i
                      style={{ fontSize: "50px" }}
                      className="fa fa-user avatar no_avatar"
                    />
                  )}
                  <div className="form-group">
                    <label className="col-lg-3 control-label">
                      Profile Photo:
                    </label>
                    <div className="col-lg-8">
                      <FileBase64
                        multiple={false}
                        onDone={this.uploadImageFile}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <form
              onSubmit={this.handleSubmit}
              className="form-horizontal form-horizontal-info"
            >
              <div className="form-group">
                <label className="col-lg-3 control-label">First name</label>
                <div className="col-lg-8">
                  <input
                    className="form-control"
                    type="text"
                    name="first_name"
                    placeholder="Enter firstname ...."
                    value={this.state.first_name}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="col-lg-3 control-label">Surname</label>
                <div className="col-lg-8">
                  <input
                    className="form-control"
                    name="surname"
                    type="text"
                    value={this.state.surname}
                    placeholder="Enter surname ..."
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="col-lg-3 control-label">Address</label>
                <div className="col-lg-8">
                  <input
                    className="form-control"
                    name="address"
                    type="text"
                    value={this.state.address}
                    placeholder="Enter address ..."
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="col-lg-3 control-label">State</label>
                <div className="col-lg-8">
                  <div className="ui-select">
                    <select
                      id="user_time_zone"
                      name="state"
                      className="form-control"
                      value={this.state.state}
                      onChange={this.handleChange}
                    >
                      <option value="">--Select--</option>
                      {states.map(s => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label className="col-lg-3 control-label">Phone</label>
                <div className="col-lg-8">
                  <input
                    className="form-control"
                    name="phone"
                    type="text"
                    value={this.state.phone}
                    placeholder="Enter phone..."
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="col-lg-3 control-label">Date of Birth</label>
                <div className="col-lg-8">
                  <DatePickerInput
                    onChange={this.handleDateChange}
                    value={moment(date_of_birth)}
                    className="my-custom-datepicker-component"
                  />
                </div>
              </div>
              {user.status !== "guardian" ? (
                <div className="form-group">
                  <label className="col-lg-3 control-label">Class</label>
                  <div className="col-lg-8">
                    <select
                      className="form-control"
                      name="level"
                      value={this.state.level}
                      onChange={this.handleChange}
                      id=""
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(
                        l => (
                          <option key={l} value={l}>
                            {this.map_user_level(l)}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                </div>
              ) : (
                ""
              )}
              <div className="form-group">
                <label className="col-lg-3 control-label">Sex</label>
                <div className="col-lg-8">
                  <select
                    className="form-control"
                    name="sex"
                    id=""
                    value={this.state.sex}
                    onChange={this.handleChange}
                  >
                    <option value="">--Select--</option>
                    {["male", "female"].map(sx => (
                      <option key={sx} value={sx}>
                        {this.Capitalize(sx)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <p
                style={{
                  marginTop: "20px",
                  marginLeft: "200px",
                  color: "red",
                  fontSize: "18px"
                }}
              >
                {errorMessage}
              </p>
              <div className="form-group">
                <div className="col-lg-3" />
                <div className="col-lg-8">
                  <Button
                    variant="contained"
                    component="span"
                    color="secondary"
                    className="form-control new-btn"
                    onClick={this.handleSubmit}
                  >
                    {loading ? <Spinner /> : "Confirm"}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

UpdateUser.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(UpdateUser);
