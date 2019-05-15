import React, { Component } from "react";
import AdminNavbar from "../Navbars/AdminNavbar";

import routes from "../../routes";
import Sidebar from "components/Sidebar/Sidebar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import axios from "axios";

const styles = theme => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
    position: "relative",
    overflow: "auto",
    maxHeight: 300
  },
  listSection: {
    backgroundColor: "inherit"
  },
  ul: {
    backgroundColor: "inherit",
    padding: 0
  },
  fab: {
    margin: theme.spacing.unit * 2,
    background:
      "linear-gradient(174.78deg, #3394AB -8.91%, #64DAF6 99.52%) !important"
  },
  absolute: {
    position: "absolute",
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 3
  }
});

class showInstitution extends Component {
  constructor(props) {
    super(props);
    this.state = {
      slug: this.props.match.params.slug,
      course_list: [],
      university: ""
    };
  }

  fetchCourses = () => {
    const token = localStorage.getItem("token");
    axios
      .get(
        `https://smart-up.herokuapp.com/api/v1/courses/?institution_id=${
          this.state.slug
        }`,
        {
          headers: {
            Authorization: token
          }
        }
      )
      .then(res => {
        console.log(res);
        this.setState({
          course_list: res.data
        });
      });
  };

  componentDidMount() {
    this.fetchInstitution();
    this.fetchCourses();
  }

  fetchInstitution() {
    const token = localStorage.getItem("token");
    let id = this.state.slug;
    axios
      .get(`https://smart-up.herokuapp.com/api/v1/institutions/${id}`, {
        headers: {
          Authorization: token
        }
      })
      .then(res => {
        this.setState({
          university: res.data
        });
      });
  }

  getBrandText = path => {
    for (let i = 0; i < routes.length; i++) {
      if (this.props.location.pathname.indexOf(routes[i].path) !== -1) {
        return routes[i].name;
      }
    }
    return "Brand";
  };
  render() {
    console.log(this.state.slug);
    const { classes } = this.props;
    const { course_list, university } = this.state;
    return (
      <div>
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
            <div className="row margin-top">
              <div className="col-sm-12 col-md-4">
                <div className="newcard card-user">
                  <div className="image">
                    <img src={require("../../images/bgimg.jpg")} alt="..." />
                  </div>
                  <div className="content">
                    <div className="author">
                      <a href="#pablo">
                        <img
                          className="avatar border-gray"
                          src={require("../../images/dfimg.png")}
                          alt="..."
                        />
                        <h4 className="title">
                          {university.name}
                          <br />
                          <small>{university.motto}</small>
                        </h4>
                      </a>
                    </div>
                    <p className="description text-center">
                      <br />
                    </p>
                  </div>
                  <hr />
                  <div className="text-center footer-social">
                    <i className="fa fa-facebook footer-user" />
                    <i className="fa fa-google footer-user" />
                    <i className="fa fa-twitter footer-user" />
                    <i className="fa fa-instagram footer-user" />
                  </div>
                </div>
              </div>
              {course_list.length < 1 ? (
                <div>
                  <div className="no-wards">
                    <h5>No Courses Yet</h5>
                    <div className="wards-cover">
                      <h5>What is this section for? </h5>
                      <br />
                      <p>
                        This section allows you to add courses to this
                        institution or view your courses
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="col-sm-12 col-md-8">
                  <h4>Courses</h4>
                  <div className="row">
                    <ul className="course-listed pr-20">
                      {course_list.map(course => (
                        <li className="">
                          {course.name}
                          <span className="pull-right">
                            {course.topics.length}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

showInstitution.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(showInstitution);
