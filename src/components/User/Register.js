import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./style.css";
import axios from "axios";
import Spinner from "../hoc/spinner";
import { Helmet } from "react-helmet";

const Url = process.env.REACT_APP_BASE_URL;

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        email: "",
        password: "",
        status: "student"
      },
      loading: false,
      errorMessage: ""
    };
  }

  Capitalize = str => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  isEmpty = obj => {
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) return false;
    }
    return true;
  };

  handleChange = event => {
    const { name, value } = event.target;
    let user = { ...this.state.user, [name]: value };
    this.setState({ user });
  };

  submitHandler = e => {
    e.preventDefault();
    const { email, password, status } = this.state.user;
    if (email.length < 3 || status.length < 3) {
      this.setState({
        errorMessage: "Please Enter all fields"
      });
    } else {
      axios
        .post(
          `${Url}/api/v1/registration`,
          {
            user: { email, password, status }
          },
          this.setState({ loading: true })
        )
        .then(res => {
          if (res.data.authentication_token === null) {
            this.setState({
              errorMessage: "There's a failure",
              loading: false
            });
          } else if (
            !res.data.authentication_token === null &&
            res.data.completed_at === null
          ) {
            this.props.history.replace("/profile");
          } else {
            localStorage.setItem("token", res.data.authentication_token);
            localStorage.setItem("user", JSON.stringify(res.data));
            this.props.history.replace("/update_profile");
          }
          localStorage.setItem("token", res.data.authentication_token);
          localStorage.setItem("user", JSON.stringify(res.data));
        })
        .catch(err => {
          if (err) {
            this.setState({
              errorMessage: err.message,
              loading: false
            });
          }
        });
    }
  };

  render() {
    const { loading, errorMessage } = this.state;

    const token = localStorage.getItem("token");

    if (token) {
      this.props.history.replace("/profile");
    }

    return (
      <React.Fragment>
        <Helmet>
          <meta charSet="utf-8" />
          <title>SignUp</title>
        </Helmet>
        <div className="cover-all">
          <Link to="/">
            <img
              className="login-img"
              src={require("../../images/logo_white.png")}
              alt=""
            />
          </Link>
          <div className="container login-auth">
            <div className="login-form">
              <ul class="nav nav-tabs">
                <li>
                  <Link to="/login" data-toggle="tab">
                    Login
                  </Link>
                </li>
                <li class="active">
                  <Link to="/register" data-toggle="tab">
                    Register
                  </Link>
                </li>
              </ul>
              <form
                onSubmit={this.submitHandler}
                className="login-space center-block"
              >
                <input
                  type="email"
                  className="form-control input-css"
                  value={this.state.user.email}
                  placeholder="Email"
                  name="email"
                  onChange={this.handleChange}
                />
                <input
                  type="password"
                  className="form-control input-css"
                  id="pwd"
                  value={this.state.user.password}
                  placeholder="Password"
                  name="password"
                  onChange={this.handleChange}
                />
                <select
                  value={this.state.user.status}
                  onChange={this.handleChange}
                  name="status"
                  className="form-control input-css"
                >
                  {["student", "guardian", "educator"].map(st => (
                    <option value={st}>{this.Capitalize(st)}</option>
                  ))}
                </select>
                <p
                  style={{
                    marginTop: "20px",
                    color: "red",
                    fontSize: "18px"
                  }}
                >
                  {errorMessage}
                </p>
                <button
                  onClick={this.submitHandler}
                  type="submit"
                  className="login-button btn-block"
                  disabled={loading}
                >
                  {loading ? <Spinner /> : "Register"}
                </button>
              </form>
              <p className="alt-login-text">You can also register via</p>
              <div className="login-footer">
                <div className="login-footer1 social-icon">
                  <i className="fa fa-facebook-square" />
                  <span>Facebook</span>
                </div>
                <div className="login-footer2 social-icon">
                  <i className="fa fa-google" />
                  <span>Google</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Register;
