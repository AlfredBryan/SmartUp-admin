import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import "./course.css";
import axios from "axios";

import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import PropTypes from "prop-types";
import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";
import Tooltip from "@material-ui/core/Tooltip";
//file upload
import FileBase64 from "react-file-base64";

import Navigation from "components/Navigation/Navigation";
import Spinner from "components/hoc/spinner";

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
      error: false,
      csv_file: ""
    };
  }

  componentDidMount() {
    this.fetchCourses();
  }

  bulkUpload = e => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    let file = document.querySelector("#csv_file").files[0];
    let formData = new FormData();
    formData.append("csv_file", file);
    axios
      .post(
        `${apiUrl}/api/v1/courses/import_data`,
        formData,
        {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data"
          }
        },
        this.setState({
          loading: true
        })
      )
      .then(res => {
        if (res.status === 200) {
          this.fetchCourses();
          this.setState({
            loading: false
          });
        }
      })
      .then(err => {
        this.setState({
          loading: false
        });
      });
  };

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
    const { course_list, error, loading } = this.state;
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
              {user.status === "educator" || user.admin === true ? (
                <div className="pull-right">
                  {/* <label className="file-upload btn">
                    Bulk Upload Courses...
                    <input type="file" id="csv_file" accept=".csv" />
                  </label>
                  <Button
                    variant="contained"
                    component="span"
                    color="secondary"
                    className="bulk-btn"
                    onClick={this.bulkUpload}
                  >
                    {loading ? <Spinner /> : "Submit"}
                  </Button> */}
                  <Link to="/new_course">
                    <Tooltip title="Add Course" aria-label="Add">
                      <Fab color="secondary">
                        <AddIcon />
                      </Fab>
                    </Tooltip>
                  </Link>
                </div>
              ) : (
                ""
              )}
              <div className="container">
                <div className="row">
                  <div className="container">
                    <div className="no-wards">
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
                {user.status === "educator" || user.admin === true ? (
                  <div className="pull-right">
                    {/* <label className="file-upload btn">
                      Bulk Upload Courses...
                      <input type="file" id="csv_file" accept=".csv" />
                    </label>
                    <Button
                      variant="contained"
                      component="span"
                      color="secondary"
                      className="bulk-btn"
                      onClick={this.bulkUpload}
                    >
                      {loading ? <Spinner /> : "Submit"}
                    </Button> */}
                    <Link to="/new_course" className="pull-right">
                      <Tooltip title="Add Course" aria-label="Add">
                        <Fab color="secondary">
                          <AddIcon />
                        </Fab>
                      </Tooltip>
                    </Link>
                  </div>
                ) : (
                  ""
                )}
                <h3 style={{ paddingBottom: "1em" }}>Courses</h3>
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
