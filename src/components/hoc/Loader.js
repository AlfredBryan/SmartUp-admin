import React from "react";

import "./loader.css";

export default function Loader() {
  return (
    <div className="text-center">
      <img
        className="preloader-logo"
        src={require("../../images/logo_black.png")}
        alt="spinner"
      />
      <div className="wrap">
        <div className="lds-grid">
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
        </div>
      </div>
    </div>
  );
}
