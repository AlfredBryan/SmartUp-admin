import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import Navigation from "components/Navigation/Navigation";

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
      .get("https://smart-up.herokuapp.com/api/v1/users", {
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
    return (
      <React.Fragment>
        <Navigation />
        <div className="main-content">
          <div className="container">
            <h3>Users</h3>
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
                      <Link to={`/display_user/${user.id}`}>{user.email}</Link>
                    </td>
                    <td>
                      <Link to={`/display_user/${user.id}`}>{this.Capitalize(user.status)}</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Admin;
