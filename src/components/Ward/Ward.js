import React, { Component } from "react";

import "./style.css";
import axios from "axios";
import Spinner from "../hoc/spinner";

import Sidebar from "../Sidebar/Sidebar";
import AdminNavbar from "../Navbars/AdminNavbar";

import routes from "../../routes";

class AddWard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ward_request: {
        email: ""
      },
      details: [],
      family_details: [],
      loading: false,
      visible: false,
      errMessage: ""
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

  componentDidMount() {
    this.getList();
    this.getFamily();
  }

  getList = e => {
    const token = localStorage.getItem("token");
    axios
      .get("https://smart-up.herokuapp.com/api/v1/ward_requests", {
        headers: {
          Authorization: token
        }
      })
      .then(res => {
        this.setState({
          details: res.data
        });
      });
  };

  getFamily = e => {
    const token = localStorage.getItem("token");
    axios
      .get("https://smart-up.herokuapp.com/api/v1/registration/family", {
        headers: {
          Authorization: token
        }
      })
      .then(res => {
        this.setState({
          family_details: res.data
        });
      });
  };

  acceptGuardian = id => {
    const token = localStorage.getItem("token");
    axios
      .get(
        `https://smart-up.herokuapp.com/api/v1/ward_requests/${id}/approve`,
        {
          headers: {
            Authorization: token
          }
        }
      )
      .then(res => {
        if (res) {
          this.setState({
            visible: true
          });
          this.getFamily();
        }
      })
      .catch(err => {});
  };

  cancelRequest = id => {
    const token = localStorage.getItem("token");
    axios
      .delete(`https://smart-up.herokuapp.com/api/v1/ward_requests/${id}`, {
        headers: {
          Authorization: token
        }
      })
      .then(res => {
        if (res) {
          this.setState({
            visible: true
          });
        }
      })
      .catch(err => {});
  };

  addWard = e => {
    const token = localStorage.getItem("token");
    e.preventDefault();
    const { email } = this.state.ward_request;
    if (email.length < 3) {
      this.setState({
        errMessage: "Valid email required"
      });
    } else {
      axios
        .post(
          "https://smart-up.herokuapp.com/api/v1/ward_requests",
          { ward_request: { email } },
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
          if (res) {
            this.setState({
              loading: false
            });
            this.getList();
          }
        })
        .catch(err => {
          if (err) {
            this.setState({
              loading: false
            });
          }
        });
    }
  };

  handleChange = event => {
    const { name, value } = event.target;
    let ward_request = { ...this.state.ward_request, [name]: value };
    this.setState({ ward_request });
  };

  declineReqButton = (user, id) => {
    if (user.status !== "educator") {
      return (
        <button
          onClick={() => this.cancelRequest(id)}
          className="btn btn-danger"
        >
          {this.state.loading ? (
            <Spinner />
          ) : user.status === "guardian" ? (
            "Cancel"
          ) : (
            "Decline"
          )}
        </button>
      );
    }
  };

  acceptReqButton = (user, id) => {
    if (user.status === "student") {
      return (
        <button
          onClick={() => this.acceptGuardian(id)}
          className="btn btn-success"
        >
          {this.state.loading ? <Spinner /> : "Accept"}
        </button>
      );
    }
  };

  render() {
    const user = JSON.parse(localStorage.getItem("user"));
    let { loading, details, family_details, visible } = this.state;

    if (family_details.length === 0) {
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
          <div className="main-content">
            <div className="container">
              <div className="row">
                <div className="container">
                  <div className="no-wards">
                    <h5>
                      No {user.status === "guardian" ? "Ward" : "Guardian"}s yet
                    </h5>
                    <div className="wards-cover">
                      <h5>What is this section for? </h5>
                      <br />
                      <p>
                        Everyone needs encouragement. This section allows you to
                        invite a student or guardian to be part of your progress
                        or view your progress as you learn
                      </p>
                    </div>
                  </div>
                </div>
                <div className="user-list" id={visible ? "fadeOut" : ""}>
                  {details.map(d => (
                    <li key={d.id}>
                      <div className="user-names">
                        {d.user.full_name}
                        {d.user.email}
                      </div>
                      <div className="actions">
                        {this.declineReqButton(user, d.id)}
                        {this.acceptReqButton(user, d.id)}
                      </div>
                    </li>
                  ))}
                </div>
                <form className="ward-form form-none" onSubmit={this.addWard}>
                  <div className="d-flex">
                    <input
                      className="ward-input"
                      type="text"
                      name="email"
                      value={this.state.ward_request.email}
                      placeholder="Email ..."
                      onChange={this.handleChange}
                    />
                    <button onClick={this.addWard} className="ward-button">
                      {loading ? <Spinner /> : "Confirm"}
                    </button>
                  </div>
                </form>{" "}
              </div>
            </div>
          </div>
        </div>
      );
    } else {
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
          <div className="main-content">
            <div className="container">
              <div className="row">
                <div className="container">
                  <div className="row">
                    <div className="col-xs-12 col-sm-8 col-md-8">
                      <div className="row">
                        {family_details.map(d => (
                          <div
                            key={d.id}
                            className="card family-member-info text-center col-xs-12 col-sm-3 col-md-3"
                            id="family-card"
                          >
                            <i className="fa fa-vcard-o" />
                            <h6>{d.full_name}</h6>
                            <p>{d.email}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="user-list" id={visible ? "fadeOut" : ""}>
                  {details.map(d => (
                    <li key={d.id}>
                      <div className="user-names">
                        {d.user.full_name}
                        {d.user.email}
                      </div>
                      <div className="actions">
                        {this.declineReqButton(user, d.id)}
                        {this.acceptReqButton(user, d.id)}
                      </div>
                    </li>
                  ))}
                </div>
                <form className="ward-form" onSubmit={this.addWard}>
                  <div className="d-flex">
                    <input
                      className="ward-input"
                      type="text"
                      name="email"
                      value={this.state.ward_request.email}
                      placeholder="Email ..."
                      onChange={this.handleChange}
                    />
                    <button onClick={this.addWard} className="ward-button">
                      {loading ? <Spinner /> : "Confirm"}
                    </button>
                  </div>
                </form>{" "}
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default AddWard;
