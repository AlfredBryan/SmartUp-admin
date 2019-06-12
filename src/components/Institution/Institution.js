import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";

import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";
import Tooltip from "@material-ui/core/Tooltip";

import "./style.css";
import Navigation from "components/Navigation/Navigation";

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
      institutions: [],
      loading: false,
      error: false
    };
  }

  componentDidMount() {
    this.fetchUniversity();
  }

  fetchUniversity = () => {
    const token = localStorage.getItem("token");
    axios
      .get("https://smart-up.herokuapp.com/api/v1/institutions", {
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
            institutions: res.data
          });
        }
      });
  };

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  render() {
    const { institutions, error } = this.state;
    const { classes } = this.props;
    if (error) {
      localStorage.clear("token");
      localStorage.clear("user");
      this.props.history.push("/login");
    } else {
      return (
        <div>
          <Navigation />
          <div className="main-content">
            <Link to="/new_institution" className="button-area">
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
                      {institutions.map(inst => (
                        <div
                          key={inst.id}
                          className="card family-member-info text-center col-xs-12 col-sm-3 col-md-3"
                          id="family-card"
                        >
                          <Link
                            to={`/institutions/${inst.slug}`}
                            className="display-uni"
                          >
                            <div>
                              {inst.logo_url ? (
                                <img
                                  className="institution_logo"
                                  src={inst.logo_url}
                                />
                              ) : (
                                <i className="fa fa-university" />
                              )}
                              <h5>{inst.name}</h5>
                              <div className="uni-text">
                                <span>
                                  <p>Motto: {inst.motto}</p>
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
}

Institution.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Institution);
