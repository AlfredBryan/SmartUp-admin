import React, { Component } from "react";
import "./spinner.css";

class Spinner extends Component {
  render() {
    return (
      <div className="wrap">
        <div className="lds-ring">
          <div />
          <div />
          <div />
          <div />
        </div>
      </div>
    );
  }
}

export default Spinner;
