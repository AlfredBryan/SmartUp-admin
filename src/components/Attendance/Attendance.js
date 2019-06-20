import React, { Component } from "react";
import axios from "axios";

import Navigation from "components/Navigation/Navigation";

class Attendance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      study_group_id: this.props.match.params.id
    };
  }

  postAttendance = e => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    axios
      .post(`/api/v1/attendances`, {}, { headers: { Authorization: token } })
      .then(res => {
        console.log(res);
      });
  };

  render() {
    return (
      <React.Fragment>
        <Navigation />
        <div className="main-content">
          <div className="container" />
        </div>
      </React.Fragment>
    );
  }
}

export default Attendance;
