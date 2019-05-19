import React, { Component } from "react";
import AdminNavbar from "../Navbars/AdminNavbar";
import { Link } from "react-router-dom";

import routes from "../../routes";
import Sidebar from "components/Sidebar/Sidebar";
import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";
import Tooltip from "@material-ui/core/Tooltip";
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
    let { slug } = this.state;
    axios
      .get(
        `https://smart-up.herokuapp.com/api/v1/courses/?institution_id=${slug}`,
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
  render() {
    console.log(this.state.slug);
    const { classes } = this.props;
    const { course_list, university, slug } = this.state;

    return (
      <div>
        <Sidebar
        />
        <div id="main-panel" className="main-panel" ref="mainPanel">
          <AdminNavbar
          
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
                      <Link
                        to={`/update_institution/${slug}`}
                        className="edit-area"
                      >
                        <i
                          class="fa fa-edit edit-fa"
                          style={{
                            color: "#3394AB"
                          }}
                        />
                        <p className="edit-button">Edit</p>
                      </Link>
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
                    <Link
                      to={`/institutions/${slug}/new_course`}
                      className="button-area"
                    >
                      <Tooltip title="Add" aria-label="Add">
                        <Fab color="primary" className={classes.fab}>
                          <AddIcon />
                        </Fab>
                      </Tooltip>
                    </Link>
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
