import React, { Component } from "react";
import "./Dashboard.css";
import axios from "axios";

import Sidebar from "../Sidebar/Sidebar";
import routes from "../../routes";
import AdminNavbar from "../Navbars/AdminNavbar";

const token = localStorage.getItem("token");

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: ""
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

  logOut = () => {
    axios
      .delete("https://smart-up.herokuapp.com/api/v1/session", {
        headers: {
          Authorization: token
        }
      })
      .then(res => {
        if (res.statusText === "OK") {
          console.log(res);
          localStorage.clear("token");
          localStorage.clear("user");
          this.props.history.replace("/");
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

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
        <div className="main-content">
          <div className="container">
            <div className="row">
              <div className="col-xs-12 col-sm-8 col-md-8">
                <div className="flex-div">
                  <div style={{ textAlign: "center" }} className="card">
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
                  <div style={{ textAlign: "center" }} className="card left">
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

export default Dashboard;
