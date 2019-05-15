import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./course.css";
import axios from "axios";

import Sidebar from "../Sidebar/Sidebar";
import AdminNavbar from "../Navbars/AdminNavbar";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";
import Tooltip from "@material-ui/core/Tooltip";


import routes from "../../routes";

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

class Courses extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      visible: false,
      course_list: [],
      topics: []
    };
  }

  getBrandText = path => {
    for (let i = 0; i < routes.length; i++) {
      if (this.props.location.pathname.indexOf(routes[i].path) !== -1) {
        return routes[i].name;
      }
    }
    return "Brand";
  };

  componentDidMount() {
    this.fetchCourses();
  }

  fetchCourses = () => {
    const token = localStorage.getItem("token");

    const institution = this.props.match.params.id;

    let Url = "https://smart-up.herokuapp.com/api/v1/courses";

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
        console.log(res);
        this.setState({
          course_list: res.data,
          topics: res.data.topics,
          visible: res.data.length > 0
        });
      });
  };

  render() {
    const { course_list, topics } = this.state;
    const { classes } = this.props;

    if (course_list.length < 0) {
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
              <div className="row">
                <div className="container">
                  <div className="no-wards">
                    <Link to="/courses/new" className="pull-right">
                      <Tooltip title="Add" aria-label="Add">
                        <Fab color="primary" className={classes.fab}>
                          <AddIcon />
                        </Fab>
                      </Tooltip>
                    </Link>
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
          <Link to="/new_course" className="button-area">
                <Tooltip title="Add" aria-label="Add">
                  <Fab color="primary" className={classes.fab}>
                    <AddIcon />
                  </Fab>
                </Tooltip>
              </Link>
            <div className="container">
              <ul className="course-listed">
                {course_list.map(course => (
                  <li className="">
                    {course.name}
                    <span className="pull-right">{course.topics.length}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      );
    }
  }
}

Courses.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Courses);
