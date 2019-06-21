import React, { Component } from "react";
import "./Footer.css";

class Footer extends Component {
  render() {
    return (
      <React.Fragment>
        <section id="footer">
          <div className="container">
            <div className="row text-center text-xs-center text-sm-left text-md-left">
              <div className="col-xs-12 col-sm-4 col-md-4">
                <h4>Social</h4>
                <ul className="list-unstyled list-inline social-icons">
                  <li className="list-inline-item">
                    <a href="javascript:void();" target="_blank" rel="noopener noreferrer">
                      <i style={{ fontSize: "20px" }} className="fa fa-linkedin" />
                    </a>
                  </li>
                  <li className="list-inline-item">
                    <a href="javascript:void();" target="_blank" rel="noopener noreferrer">
                      <i style={{ fontSize: "20px" }} className="fa fa-youtube" />
                    </a>
                  </li>
                  <li className="list-inline-item">
                    <a href="javascript:void();" target="_blank" rel="noopener noreferrer">
                      <i style={{ fontSize: "20px" }} className="fa fa-instagram" />
                    </a>
                  </li>
                  <li className="list-inline-item">
                    <a href="javascript:void();" target="_blank" rel="noopener noreferrer">
                      <i style={{ fontSize: "20px" }} className="fa fa-facebook" />
                    </a>
                  </li>
                  <li className="list-inline-item">
                    <a href="javascript:void();" target="_blank" rel="noopener noreferrer">
                      <i style={{ fontSize: "20px" }} className="fa fa-twitter" />
                    </a>
                  </li>
                </ul>
              </div>
              <div className="col-xs-12 col-sm-4 col-md-4" />
              <div className="col-xs-12 col-sm-4 col-md-4 store-badges">
                <h4 className="">Download the app</h4>
                <ul className="list-unstyled list-inline">
                  <li className="list-inline-item">
                    <img
                      className="apple-store-badge"
                      src={require("../../images/apple-store-badge.svg")}
                      alt="GooglePlay Badge"
                    />
                  </li>
                  <li className="list-inline-item">
                    <img
                      className="google-store-badge"
                      src={require("../../images/google-play-badge.png")}
                      alt="GooglePlay Badge"
                    />
                  </li>
                </ul>
              </div>
            </div>

            <hr className="line-break" />
            <div className="row lower-footer">
              <div className="col-xs-12 col-sm-4 col-md-4 copyright">
                <p className="text-white list-inline">
                  &copy;{" "}
                  <img
                    className="logo-header"
                    src={require("../../images/logo_white.png")}
                    alt="SmartUp Logo"
                  />{" "}
                  | {new Date().getFullYear()}
                </p>
              </div>
              <div className="col-xs-12 col-sm-4 col-md-4" />
              <div className="col-xs-12 col-sm-4 col-md-4">
                <ul className="list-unstyled list-inline terms  ">
                  <li className="list-inline-item">
                    <a href="#">Terms</a>
                  </li>
                  <li className="list-inline-item">
                    <a href="#">Privacy</a>
                  </li>
                  <li className="list-inline-item">
                    <a href="#">Support</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </React.Fragment>
    );
  }
}

export default Footer;
