import React, { Component } from "react";
import { Link } from "react-router-dom";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import Fab from "@material-ui/core/Fab";
import Tooltip from "@material-ui/core/Tooltip";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

import PropTypes from "prop-types";
import axios from "axios";

import Navigation from "components/Navigation/Navigation";

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
    margin: theme.spacing.unit * 2
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
      institution: ""
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
          institution: res.data
        });
      });
  }
  render() {
    const { classes } = this.props;
    const { course_list, institution, slug } = this.state;
    return (
      <div>
        <Navigation />
        <div className="main-content">
          <div className="container" id="institution_show">
            <div className="row margin-top">
              <div className="col-sm-12 col-md-4">
                <div className="newcard card-user">
                  <div className="image">
                    <img
                      src={require("../../images/institutebg.jpg")}
                      alt="..."
                    />
                  </div>
                  <div className="content">
                    <div className="author">
                      {institution.logo_url !== null ? (
                        <img
                          className="avatar border-gray"
                          src={institution.logo_url}
                          alt="..."
                        />
                      ) : (
                        <i className="fa fa-university avatar no_pics" />
                      )}
                      <h4 className="title">
                        {institution.name}
                        <br />
                        <small>{institution.motto}</small>
                      </h4>
                    </div>
                    <p className="description text-center">
                      <Link
                        className="pull-left"
                        to={`/create_study_group/${institution.id}`}
                      >
                        <Button
                          variant="contained"
                          component="span"
                          color="secondary"
                        >
                          Add Study Group
                        </Button>
                      </Link>
                      <Link
                        to={`/update_institution/${slug}`}
                        className="pull-right"
                      >
                        <Tooltip
                          title="Edit Institutioon"
                          aria-label="Edit Institution"
                        >
                          <Fab color="secondary">
                            <EditIcon />
                          </Fab>
                        </Tooltip>
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
                        <Fab color="secondary" className={classes.fab}>
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
                    <Link
                      to={`/institutions/${slug}/new_course`}
                      className="button-area"
                    >
                      <Tooltip title="Add new Course" aria-label="Add">
                        <Fab color="secondary" className={classes.fab}>
                          <AddIcon />
                        </Fab>
                      </Tooltip>
                    </Link>
                    <ul className="course-listed pr-20">
                      {course_list.map(course => (
                        <Link key={course.id} to={`/courses/${course.slug}`}>
                          <li>
                            {course.name}
                            <span className="pull-right">
                              {course.topics.length}
                            </span>
                          </li>
                        </Link>
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
