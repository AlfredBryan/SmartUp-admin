import React, { Component } from "react";
import axios from "axios";

import "./style.css";
import Spinner from "../hoc/spinner";

import Sidebar from "../Sidebar/Sidebar";
import AdminNavbar from "../Navbars/AdminNavbar";

import routes from "../../routes";

class AddInstitution extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      motto: "",
      email: "",
      phone: "",
      loading: false
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

  handleSubmit = e => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    let { name, motto, email, phone } = this.state;
    axios
      .post(
        "https://smart-up.herokuapp.com/api/v1/institutions",
        {
          institution: {
            name,
            motto,
            email,
            phone
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
            loading: false
          });
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
  };

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  render() {
    const { loading } = this.state;
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
                  <div className="col-lg-12">
                    <button
                      onClick={this.handleSubmit}
                      className="form-control btn-submit"
                    >
                      {loading ? <Spinner /> : "Submit"}
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

export default AddInstitution;
