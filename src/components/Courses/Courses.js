import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import "./course.css";
import axios from "axios";

import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";
import Tooltip from "@material-ui/core/Tooltip";

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

const apiUrl = process.env.REACT_APP_BASE_URL;

class Courses extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      visible: false,
      course_list: [],
      slug: "",
      error: false
    };
  }

  componentDidMount() {
    this.fetchCourses();
  }

  fetchCourses = () => {
    const token = localStorage.getItem("token");

    const institution = this.props.match.params.id;

    let Url = `${apiUrl}/api/v1/courses`;

    if (institution) {
      Url += `?institution_id=${institution.id}`;
    }
    axios
      .get(Url, {
        headers: {
          Authorization: token
        }
      })
      .then(res => {
        if (res.data.errors) {
          this.setState({
            error: true
          });
        } else {
          this.setState({
            course_list: res.data
          });
        }
      });
  };

  render() {
    const { course_list, error } = this.state;
    const user = JSON.parse(localStorage.getItem("user"));
    if (error) {
      return (
        localStorage.clear("token"),
        localStorage.clear("user"),
        this.props.history.push("/login")
      );
    } else {
      if (course_list.length < 0) {
        return (
          <div>
            <Helmet>
              <meta charSet="utf-8" />
              <title>Courses</title>
            </Helmet>
            <Navigation />
            <div className="main-content">
              <div className="container">
                <div className="row">
                  <div className="container">
                    <div className="no-wards">
                      {user.status === "educator" || user.admin === true ? (
                        <Link to="/new_course" className="pull-right">
                          <Tooltip title="Add Course" aria-label="Add">
                            <Fab color="secondary">
                              <AddIcon />
                            </Fab>
                          </Tooltip>
                        </Link>
                      ) : (
                        ""
                      )}

                      <div className="wards-cover text-center">
                        <br />
                        <p>No Courses yet.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      } else {
        return (
          <div>
            <Helmet>
              <meta charSet="utf-8" />
              <title>Courses</title>
            </Helmet>
            <Navigation />
            <div className="main-content">
              <div className="container">
              <div className="action-buttons">
                {user.status === "educator" || user.admin === true ? (
                  <Link to="/new_course" className="pull-right">
                    <Tooltip title="Add Course" aria-label="Add">
                      <Fab color="secondary">
                        <AddIcon />
                      </Fab>
                    </Tooltip>
                  </Link>
                ) : (
                  ""
                )}
              </div>
                <h3>Courses</h3>
                <ul className="course-listed">
                  {course_list.map(course => (
                    <Link key={course.id} to={`/courses/${course.slug}`}>
                      <li>
                        {course.name}
                        <span className="pull-right">
                          <span>Topics</span>({course.topics.length})
                        </span>
                      </li>
                    </Link>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );
      }
    }
  }
}

Courses.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Courses);
