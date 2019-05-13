import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import Sidebar from "../Sidebar/Sidebar";
import AdminNavbar from "../Navbars/AdminNavbar";

import routes from "../../routes";

import "./style.css";

class Institution extends Component {
  constructor(props) {
    super(props);
    this.state = {
      universities: "",
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

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  render() {
    const user = JSON.parse(localStorage.getItem("user"));
    const { universities } = this.state;
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
              <div className="col-xs-12 col-sm-8 col-md-8">
                <div className="row">
                  <div
                    className="card family-member-info text-center col-xs-12 col-sm-3 col-md-3"
                    id="family-card"
                  >
                    <i className="fa fa-vcard-o" />
                    <h6>test</h6>
                    <p>email</p>
                  </div>
                </div>
              </div>
            </div>
            <Link to="/institutions/new">
              <button className="btn btn-success btn-circle">
                <i className="fa fa-plus" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default Institution;
