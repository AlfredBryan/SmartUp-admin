import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
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
    margin: theme.spacing.unit * 2
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
    const user = JSON.parse(localStorage.getItem("user"));
    if (error) {
      return (
        localStorage.clear("token"),
        localStorage.clear("user"),
        this.props.history.push("/login")
      );
    } else {
      return (
        <div>
          <Helmet>
            <meta charSet="utf-8" />
            <title>Institutions</title>
          </Helmet>
          <Navigation />
          <div className="main-content">
            {user.status === "educator" || user.admin === true ? (
              <Link to="/new_institution" className="button-area">
                <Tooltip title="Add Institution" aria-label="Add">
                  <Fab color="secondary" className={classes.fab}>
                    <AddIcon />
                  </Fab>
                </Tooltip>
              </Link>
            ) : (
              ""
            )}

            <div className="container">
              <div>
                <div className="row push-down">
                  <h3>Institutions</h3>
                  <div className="row" id="institutions_home">
                    {institutions.map(inst => (
                      <div key={inst.id} className="col-md-4">
                        <div className="card text-center">
                          <Link
                            to={`/institutions/${inst.slug}`}
                            className="display-uni"
                          >
                            <div>
                              {inst.logo_url ? (
                                <img
                                  className="institution_logo"
                                  alt="institution_logo"
                                  src={inst.logo_url}
                                />
                              ) : (
                                <i className="fa fa-university" />
                              )}
                              <h5 className="institution_name">{inst.name}</h5>
                              <div className="uni-text">
                                <span>
                                  <p>Motto: {inst.motto}</p>
                                </span>
                              </div>
                            </div>
                          </Link>
                        </div>
                      </div>
                    ))}
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
