import React, { Component } from "react";
import { Link } from "react-router-dom";
import EditIcon from "@material-ui/icons/Edit";
import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";
import Tooltip from "@material-ui/core/Tooltip";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { Helmet } from "react-helmet";

import PropTypes from "prop-types";
//file upload
import FileBase64 from "react-file-base64";
import axios from "axios";

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

const Url = process.env.REACT_APP_BASE_URL;

class showInstitution extends Component {
  constructor(props) {
    super(props);
    this.state = {
      slug: this.props.match.params.slug,
      course_list: [],
      owner_id: "",
      institution: "",
      csv_file: {},
      loading: false
    };
  }

  fetchCourses = () => {
    const token = localStorage.getItem("token");
    let { slug } = this.state;
    axios
      .get(`${Url}/api/v1/courses/?institution_id=${slug}`, {
        headers: {
          Authorization: token
        }
      })
      .then(res => {
        this.setState({
          course_list: res.data
        });
      });
  };

  bulkUpload = e => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const { slug } = this.state;
    let file = document.querySelector("#csv_file").files[0];

    let formData = new FormData();
    formData.append("csv_file", file);
    formData.append("institution_id", slug);
    axios
      .post(`${Url}/api/v1/courses/import_data`, formData, {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data"
        }
      })
      .then(res => {
        console.log(res);
      });
  };

  fetchInstitution() {
    const token = localStorage.getItem("token");
    let id = this.state.slug;
    axios
      .get(`${Url}/api/v1/institutions/${id}`, {
        headers: {
          Authorization: token
        }
      })
      .then(res => {
        this.setState({
          institution: res.data,
          owner_id: res.data.owner_id
        });
      });
  }

  componentDidMount() {
    this.fetchInstitution();
    this.fetchCourses();
  }

  render() {
    const { course_list, institution, slug, owner_id, loading } = this.state;
    const user = JSON.parse(localStorage.getItem("user"));
    return (
      <div>
        <Helmet>
          <meta charSet="utf-8" />
          <title>Institution</title>
        </Helmet>
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
                      {user.id === owner_id ? (
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
                      ) : (
                        ""
                      )}
                      {user.id === owner_id ? (
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
                      ) : (
                        ""
                      )}
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
                    {user.status === "educator" || user.admin === true ? (
                      <div className="pull-right">
                        <label className="file-upload btn">
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
                        </Button>
                        <Link to={`/institutions/${slug}/new_course`}>
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
                  <div class="col-md-12">
                    {user.status === "educator" || user.admin === true ? (
                      <label className="file-upload btn">
                        Bulk Upload...
                        <input
                          type="file"
                          accept=".csv"
                          name="csv_file"
                          id="csv_file"
                        />
                      </label>
                    ) : (
                      ""
                    )}
                    <Button
                      variant="contained"
                      component="span"
                      color="secondary"
                      className="bulk-btn"
                    >
                      {loading ? <Spinner /> : "Submit"}
                    </Button>
                  </div>
                  <h4>Courses</h4>
                  <div className="row">
                    {user.status === "educator" || user.admin === true ? (
                      <Link
                        to={`/institutions/${slug}/new_course`}
                        className="button-area"
                      >
                        <Button
                          variant="contained"
                          component="span"
                          color="secondary"
                          className="inst_btn"
                        >
                          Add Course
                        </Button>
                      </Link>
                    ) : (
                      ""
                    )}
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
