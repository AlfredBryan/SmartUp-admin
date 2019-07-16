import React, { Component } from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";
import Loader from "./Loader";

const Url = process.env.REACT_APP_BASE_URL;

class Authenticate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      user_status: null
    };
  }

  isEmpty = obj => {
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        return false;
      }
    }

    return JSON.stringify(obj) === JSON.stringify({});
  };

  componentDidMount() {
    const token = localStorage.getItem("token");
    if (!token) {
      localStorage.clear("token");
      localStorage.clear("user");
      this.props.history.push("/login");
      window.location.reload();
    }
    axios
      .get(`${Url}/api/v1/session`, {
        headers: { Authorization: token }
      })
      .then(res => {
        if (Object.keys(res.data.errors).length > 0) {
          localStorage.clear("token");
          localStorage.clear("user");
          this.props.history.push("/login");
          window.location.reload();
        } else {
          this.setState({
            user: res.data,
            user_status: res.data.status
          });
        }
      })
      .catch(error => {
        if (error) {
          localStorage.clear("token");
          localStorage.clear("user");
          this.props.history.push("/login");
          window.location.reload();
        }
      });
  }

  render() {
    if (this.state.user === null && this.state.user_status === null) {
      return (
        <div>
          <Loader />
        </div>
      );
    }
    return <div>{this.props.children}</div>;
  }
}

export default withRouter(Authenticate);
