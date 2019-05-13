import React, { Component } from "react";
import swal from "sweetalert";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Sidebar from "../Sidebar/Sidebar";
import AdminNavbar from "../Navbars/AdminNavbar";

import routes from "../../routes";

import "./userupdate.css";

class UpdateUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        first_name: "",
        surname: "",
        address: "",
        phone: "",
        state: "",
        image_url: "",
        date_of_birth: new Date(),
        sex: "other",
        level: ""
      }
    };
  }

  getBrandText = path => {
    for (let i = 0; i < routes.length; i++) {
      if (this.props.location.pathname.indexOf(routes[i].path) !== -1) {
        return routes[i].name;
      }
    }
    return "Brand";
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
    } = this.state.user;
    console.log(this.state.user);
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
        }
      )
      .then(res => {
        if (res.status === 200) {
          this.props.history.replace("/profile");
        }
      });
  };

  handleChange = event => {
    const { name, value } = event.target;
    let user = { ...this.state.user, [name]: value };
    this.setState({ user });
  };

  handleImageChange = e => {
    e.preventDefault();
    let imageFile = e.target.files[0];
    this.setState({ [e.target.name]: imageFile });
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
    console.log(this.state.user.date_of_birth);
    return (
      <div>
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
        <div className="container">
          <div className="main-content">
            <h4>Account Settings</h4>
            <div className="col-md-9" id="account-settings">
              <div className="row">
                <div className="col-md-3">
                  <div className="text-center">
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
              <form onSubmit={this.handleSubmit} className="form-horizontal">
                <div className="form-group">
                  <label className="col-lg-3 control-label">First name:</label>
                  <div className="col-lg-8">
                    <input
                      className="form-control"
                      type="text"
                      name="first_name"
                      value={this.state.user.first_name}
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
                      value={this.state.user.surname}
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
                      value={this.state.user.address}
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
                        value={this.state.user.state}
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
                      value={this.state.user.phone}
                      placeholder="Phone Number ..."
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-lg-3 control-label">
                    Date of Birth:
                  </label>
                  <div className="col-lg-8">
                    <DatePicker
                      selected={this.state.user.date_of_birth}
                      onChange={this.handleDateChange}
                      peekNextMonth
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      dateFormat="dd/MM/yyyy"
                      calendarClassName="form-date"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-lg-3 control-label">Level:</label>
                  <div className="col-lg-8">
                    <select className="form-control" name="" id="">
                      {Array.from(new Array(12), (val, index) => index + 1).map(
                        l => (
                          <option value={l}> Grade {l}</option>
                        )
                      )}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-lg-3 control-label">Level:</label>
                  <div className="col-lg-8">
                    <select className="form-control" name="" id="">
                      {["male", "female", "other"].map(sx => (
                        <option value={sx}>{this.Capitalize(sx)}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <div className="col-lg-12">
                    <button
                      onClick={this.handleSubmit}
                      className="form-control btn-submit"
                    >
                      Confirm
                    </button>
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

export default UpdateUser;
