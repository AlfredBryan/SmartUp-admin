import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import Navigation from "components/Navigation/Navigation";
import "./style.css";

const Url = process.env.REACT_APP_BASE_URL;

class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_list: []
    };
  }

  Capitalize = str => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  getUsers = () => {
    const token = localStorage.getItem("token");
    axios
      .get(`${Url}/api/v1/users`, {
        headers: {
          Authorization: token
        }
      })
      .then(res => {
        console.log(res);
        this.setState({
          user_list: res.data
        });
      });
  };

  componentDidMount() {
    this.getUsers();
  }

  render() {
    const { user_list } = this.state;
    const user = JSON.parse(localStorage.getItem("user"));
    return (
      <React.Fragment>
        <Navigation />
        <div className="main-content">
          <div className="container">
            <h3>Users</h3>
            {(() => {
              if (user_list.length < 1 && user.status === "educator") {
                return (
                  <div id="no_users">
                    <h3>No Student in Your group yet</h3>
                  </div>
                );
              } else if (user_list.length > 0 && user.status === "educator") {
                return (
                  <table className="table-striped">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {user_list.map(user => (
                        <tr key={user.id}>
                          <td>
                            <Link to={`/display_user/${user.id}`}>
                              {user.first_name}
                            </Link>
                          </td>
                          <td>
                            <Link to={`/display_user/${user.id}`}>
                              {user.email}
                            </Link>
                          </td>
                          <td>
                            <Link to={`/display_user/${user.id}`}>
                              {this.Capitalize(user.status)}
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                );
              } else if (user_list.length < 1 && user.admin === true) {
                return (
                  <div id="no_users">
                    <h3>No Users yet</h3>
                  </div>
                );
              } else if (user_list.length > 0 && user.admin === true) {
                return (
                  <table className="table-striped">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {user_list.map(user => (
                        <tr key={user.id}>
                          <td>
                            <Link to={`/display_user/${user.id}`}>
                              {user.first_name}
                            </Link>
                          </td>
                          <td>
                            <Link to={`/display_user/${user.id}`}>
                              {user.email}
                            </Link>
                          </td>
                          <td>
                            <Link to={`/display_user/${user.id}`}>
                              {this.Capitalize(user.status)}
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                );
              } else {
                return "";
              }
            })()}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Admin;
