import React, { Component } from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";
import Loader from "./Loader";

class Authenticate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: undefined
    };
  }

  componentDidMount() {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    if (!token) {
      this.props.history.push("/login");
    }
    axios
      .get("https://smart-up.herokuapp.com/api/v1/session", {
        headers: { Authorization: token }
      })
      .then(res => {
        this.setState({
          user: user
        });
      })
      .catch(error => {
        console.log(error);
        this.props.history.push("/login");
      });
  }

  render() {
    if (this.state.user === undefined) {
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
