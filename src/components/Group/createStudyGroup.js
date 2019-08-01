import React, { Component } from "react";
import Navigation from "components/Navigation/Navigation";
import Spinner from "components/hoc/spinner";
import { Helmet } from "react-helmet";
import axios from "axios";

//popup notification
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";

//popup styling
const styles = theme => ({
  root: {
    position: "relative",
    overflow: "hidden"
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  },
  button: {
    marginBottom: theme.spacing.unit
  },
  snackbar: {
    position: "absolute"
  },
  snackbarContent: {
    width: 460,
    fontSize: "1.3em"
  }
});
//ends

const Url = process.env.REACT_APP_BASE_URL;

class createStudyGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      level: "",
      pop_up: "",
      institution_id: this.props.match.params.id,
      loading: false,
      open: false
    };
  }

  // popup notification functions
  handleClick = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };
  //ends

  handleSubmit = e => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const { name, level, institution_id } = this.state;
    axios
      .post(
        `${Url}/api/v1/study_groups`,
        {
          study_group: {
            name,
            level,
            institution_id
          }
        },
        {
          headers: {
            Authorization: token
          }
        },
        this.setState({
          loading: true
        })
      )
      .then(res => {
        if (res.status === 200 && res.data.created_at !== null) {
          this.setState({
            loading: false,
            pop_up: res.data.name
          });
          this.props.history.replace("/study_groups");
        }
      });
  };

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  render() {
    const { loading, name, level, pop_up, open } = this.state;
    const { classes } = this.props;
    const group_level = [
      { id: 1, name: "Primary 1" },
      { id: 2, name: "Primary 2" },
      { id: 3, name: "Primary 3" },
      { id: 4, name: "Primary 4" },
      { id: 5, name: "Primary 5" },
      { id: 6, name: "Primary 6" },
      { id: 7, name: "JSS 1" },
      { id: 8, name: "JSS 2" },
      { id: 9, name: "JSS 3" },
      { id: 10, name: "SS 1" },
      { id: 11, name: "SS 2" },
      { id: 12, name: "SS 3" }
    ];
    return (
      <React.Fragment>
        <Helmet>
          <meta charSet="utf-8" />
          <title>Study Group</title>
        </Helmet>
        <Navigation />
        <Snackbar
          open={open}
          autoHideDuration={4000}
          onClose={this.handleClose}
          ContentProps={{
            "aria-describedby": "snackbar-fab-message-id",
            className: classes.snackbarContent
          }}
          message={
            <span id="snackbar-fab-message-id">
              <span className="user-popup">{pop_up}</span>
              <span className="popup-text"> Study Group Created</span>
            </span>
          }
          action={
            <Button color="inherit" size="small" onClick={this.handleClose}>
              close
            </Button>
          }
          className={classes.snackbar}
        />
        <div className="main-content">
          <div className="container">
            <h2>Study Group</h2>
            <div className="col-md-9" id="institution-settings">
              <form onSubmit={this.handleSubmit} className="form-horizontal">
                <div className="form-group">
                  <label className="col-lg-3 control-label">
                    Study Group name
                  </label>
                  <div className="col-lg-8">
                    <input
                      className="form-control"
                      type="text"
                      name="name"
                      value={name}
                      placeholder="Study Group Name ..."
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-lg-3 control-label">Class</label>
                  <div className="col-lg-8">
                    <select
                      className="form-control"
                      name="level"
                      value={level}
                      onChange={this.handleChange}
                    >
                      <option value="">--Select--</option>
                      {group_level.map(l => (
                        <option key={l.id} value={l.id}>
                          {l.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <div className="col-lg-12">
                    <Button
                      variant="contained"
                      component="span"
                      color="secondary"
                      className="form-control new-btn"
                      onClick={this.handleSubmit}
                    >
                      {loading ? <Spinner /> : "Submit"}
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

createStudyGroup.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(createStudyGroup);
