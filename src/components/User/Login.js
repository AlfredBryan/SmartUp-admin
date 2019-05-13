import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./style.css";
import Spinner from "../hoc/spinner";
import { Tab, Tabs, TabList } from "react-tabs";
import "react-tabs/style/react-tabs.css";

class UserAuth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      loading: false,
      errorMessage: "",
      value: 0
    };
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  submitHandler = e => {
    e.preventDefault();
    const { email, password } = this.state;
    if (email.length < 1 || password.length < 1) {
      this.setState({
        errorMessage: "Please Enter login details"
      });
    } else {
      axios
        .post(
          "https://smart-up.herokuapp.com/api/v1/session",
          {
            email,
            password
          },
          this.setState({ loading: true })
        )
        .then(res => {
          console.log(res);
          if (res.status === 201) {
            localStorage.setItem("token", res.data.authentication_token);
            localStorage.setItem("user", JSON.stringify(res.data));
            this.props.history.replace("/profile");
          }
          this.setState({
            errorMessage: res.data.message,
            loading: false
          });
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

  handleTabChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    let { loading, errorMessage, value } = this.state;
    const token = localStorage.getItem("token");

    if (token) {
      this.props.history.replace("/profile");
    }

    return (
      <React.Fragment>
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
              <Tabs>
                <TabList>
                  <Link to="/login">
                    <Tab aria-selected="true">Login</Tab>
                  </Link>
                  <Link selected to="/register">
                    <Tab>Register</Tab>
                  </Link>{" "}
                </TabList>
              </Tabs>
              <form
                onSubmit={this.submitHandler}
                className="login-space center-block"
              >
                <input
                  type="email"
                  className="form-control input-css"
                  id="email"
                  placeholder="Email"
                  name="email"
                  value={this.state.email}
                  onChange={this.handleChange}
                  required
                />
                <input
                  type="password"
                  className="form-control input-css"
                  placeholder="Password"
                  value={this.state.password}
                  name="password"
                  onChange={this.handleChange}
                  required
                />
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
                  type="submit"
                  disabled={loading}
                  onClick={this.submitHandler}
                  className="login-button btn-block"
                  id="login-button"
                >
                  {loading ? <Spinner /> : "Login"}
                </button>
              </form>
              <p className="alt-login-text">You can also sign in via</p>
              <div className="login-footer">
                <div className="login-footer1 social-icon">
                  <i className="fa fa-facebook-square icon">
                    <span>Facebook</span>
                  </i>
                </div>
                <div className="login-footer2 social-icon">
                  <i className="fa fa-google icon">
                    <span>Google</span>
                  </i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default UserAuth;
