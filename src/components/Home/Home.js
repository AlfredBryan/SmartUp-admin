import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink
} from "reactstrap";
import React, { Component } from "react";
import { Helmet } from "react-helmet";
import Typed from "react-typed";

import "./style.css";
import Footer from "../Footer/Footer";

class Home extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  render() {
    return (
      <div>
        <Helmet>
          <meta charSet="utf-8" />
          <title>Home</title>
        </Helmet>
        <div id="home-section">
          <Navbar dark expand="md" fixed="top" className="nav-home nav-change">
            <NavbarBrand className="nav-header" href="/">
              <img
                className="logo-header"
                src={require("../../images/logo_white.png")}
                alt="SmartUp Logo"
              />
            </NavbarBrand>
            <NavbarToggler onClick={this.toggle} />
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav className="ml-5" navbar>
                <NavItem>
                  <NavLink href="/login" className="continue">
                    <div className="goto-page">Continue</div>
                  </NavLink>
                </NavItem>
              </Nav>
            </Collapse>
          </Navbar>{" "}
          <section className="main-header main-2">
            <h1 className="intro">Learn anything, anywhere....</h1>
            <div className="container">
              <div className="row text-center">
                <div>
                  <Typed
                    strings={[
                      "Revolutionize the way you study...",
                      // 'Test yourself on topics you struggle with the most...',
                      "Become confident in yourself...",
                      "Understand how you study best..."
                    ]}
                    typeSpeed={40}
                    backSpeed={50}
                    className="typed-info text-center"
                    loop
                  />
                </div>
              </div>
            </div>
            <img
              className="main-image"
              src={require("../../images/devices.png")}
              alt="Mobile devices"
            />
          </section>
          <section className="features">
            <div className="container">
              <div className="section-header text-center">
                <h4 className="section-text">
                  Some Of Our
                  <br />
                  Amazing features
                </h4>
              </div>

              <div className="row">
                <div className="col-12 col-sm-12 col-md-6 col-lg-4">
                  <div className="item">
                    <img
                      className="img-fluid"
                      src={require("../../img/source/feature-1.png")}
                      alt="BedTime Stories"
                    />

                    <h4 className="title">Amazing Stories</h4>

                    <p className="text">
                      Read amazing stories from different categories all over
                      the world
                    </p>
                  </div>
                </div>

                <div className="col-12 col-sm-12 col-md-6 col-lg-4">
                  <div className="item">
                    <img
                      className="img-fluid"
                      src={require("../../img/source/feature-2.png")}
                      alt="BedTime Stories"
                    />

                    <h4 className="title">Create your own stories</h4>

                    <p className="text">
                      Contribute to stories read by millions of people
                    </p>
                  </div>
                </div>

                <div className="col-12 col-sm-12 col-md-6 col-lg-4">
                  <div className="item">
                    <img
                      className="img-fluid"
                      src={require("../../img/source/feature-1.png")}
                      alt="BedTime Stories"
                    />

                    <h4 className="title">Modern And Creative</h4>

                    <p className="text">
                      Easily access stories for your kids wherever you are.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <Footer />
        </div>
      </div>
    );
  }
}

export default Home;
