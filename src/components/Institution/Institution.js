import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import Sidebar from "../Sidebar/Sidebar";
import AdminNavbar from "../Navbars/AdminNavbar";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";
import Tooltip from "@material-ui/core/Tooltip";

import routes from "../../routes";

import "./style.css";

const styles = theme => ({
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

class Institution extends Component {
  constructor(props) {
    super(props);
    this.state = {
      universities: [],
      loading: false
    };
  }

  componentDidMount() {
    this.fetchUniversity();
  }

  getBrandText = path => {
    for (let i = 0; i < routes.length; i++) {
      if (this.props.location.pathname.indexOf(routes[i].path) !== -1) {
        return routes[i].name;
      }
    }
    return "Brand";
  };

  fetchUniversity = () => {
    const token = localStorage.getItem("token");
    axios
      .get("https://smart-up.herokuapp.com/api/v1/institutions", {
        headers: {
          Authorization: token
        }
      })
      .then(res => {
        console.log(res);
        this.setState({
          universities: res.data
        });
      });
  };

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  render() {
    const user = JSON.parse(localStorage.getItem("user"));
    const { universities } = this.state;

    const { classes } = this.props;
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
          <Link to="/institutions/new" className="button-area">
            <Tooltip title="Add" aria-label="Add">
              <Fab color="primary" className={classes.fab}>
                <AddIcon />
              </Fab>
            </Tooltip>
          </Link>
          <div className="container">
            <div>
              <div className="row push-down">
                <div className="col-xs-12 col-sm-8 col-md-8">
                  <div className="row">
                    {universities.map(uni => (
                      <div
                        key={uni.id}
                        className="card family-member-info text-center col-xs-12 col-sm-3 col-md-3"
                        id="family-card"
                      >
                        <Link
                          to={`/institutions/${uni.slug}`}
                          className="display-uni"
                        >
                          <div>
                            <i className="fa fa-university" />
                            <h5>{uni.name}</h5>
                            <div className="uni-text">
                              <span>
                                <p>Motto: {uni.motto}</p>
                              </span>
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Institution.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Institution);
