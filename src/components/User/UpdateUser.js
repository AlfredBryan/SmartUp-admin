import React, { Component } from "react";
import swal from "sweetalert";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

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
    fontSize: "1em"
  }
});

class UpdateUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      first_name: "",
      surname: "",
      address: "",
      phone: "",
      state: "",
      image_url: "",
      date_of_birth: new Date(),
      sex: "male",
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
      sex
    } = this.state;
    if (first_name.length < 3 || surname.length < 3) {
      this.setState({
        errorMessage: "Fields Can't be Empty"
      });
    } else {
      axios
        .put(
          "https://smart-up.herokuapp.com/api/v1/registration",
          {
            user: {
              first_name,
              surname,
              address,
              phone,
              state,
              date_of_birth,
              sex,
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
          console.log(res);
          if (res.status === 200) {
            this.setState({
              loading: false
            });
            localStorage.setItem("user", JSON.stringify(res.data));
            this.handleClick();
          }
        });
    }
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleDateChange = date => {
    this.setState({
      date_of_birth: date
    });
  };

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
    const { open, loading, errorMessage } = this.state;
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
                  <img
                    src="//placehold.it/100"
                    className="avatar img-circle"
                    alt="avatar"
                  />

                  <input
                    type="file"
                    name="image_url"
                    onChange={this.handleImageChange}
                    className="form-control"
                  />
                </div>
              </div>
            </div>
            <form
              onSubmit={this.handleSubmit}
              className="form-horizontal form-horizontal-info"
            >
              <div className="form-group">
                <label className="col-lg-3 control-label">First name:</label>
                <div className="col-lg-8">
                  <input
                    className="form-control"
                    type="text"
                    name="first_name"
                    value={this.state.first_name}
                    placeholder="First Name ..."
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="col-lg-3 control-label">Surname:</label>
                <div className="col-lg-8">
                  <input
                    className="form-control"
                    name="surname"
                    type="text"
                    value={this.state.surname}
                    placeholder="Surname ..."
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="col-lg-3 control-label">Address:</label>
                <div className="col-lg-8">
                  <input
                    className="form-control"
                    name="address"
                    type="text"
                    value={this.state.address}
                    placeholder="Address ..."
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="col-lg-3 control-label">State:</label>
                <div className="col-lg-8">
                  <div className="ui-select">
                    <select
                      id="user_time_zone"
                      name="state"
                      className="form-control"
                      value={this.state.state}
                      onChange={this.handleChange}
                    >
                      <option value="" disabled selected>
                        --Select--
                      </option>
                      {states.map(s => (
                        <option value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
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
                <label className="col-lg-3 control-label">Date of Birth:</label>
                <div className="col-lg-8">
                  <DatePicker
                    selected={this.state.date_of_birth}
                    onChange={this.handleDateChange}
                    peekNextMonth
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    dateFormat="dd/MM/yyyy"
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="col-lg-3 control-label">Level:</label>
                <div className="col-lg-8">
                  <select
                    className="form-control"
                    name="level"
                    value={this.state.level}
                    onChange={this.handleChange}
                    id=""
                  >
                    {Array.from(new Array(12), (val, index) => index + 1).map(
                      l => (
                        <option value={l}> Grade {l}</option>
                      )
                    )}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="col-lg-3 control-label">Sex:</label>
                <div className="col-lg-8">
                  <select className="form-control" name="" id="">
                    {["male", "female"].map(sx => (
                      <option value={sx}>{this.Capitalize(sx)}</option>
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
                  <button
                    onClick={this.handleSubmit}
                    className="form-control btn-submit"
                  >
                    {loading ? <Spinner /> : "Confirm"}
                  </button>
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
