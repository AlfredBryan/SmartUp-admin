import React, { Component } from "react";
import axios from "axios";

import Navigation from "components/Navigation/Navigation";
import Spinner from "components/hoc/spinner";
import { Helmet } from "react-helmet";

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
    fontSize: "1.2em"
  }
});
//ends

class EditGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      study_group_id: this.props.match.params.id,
      group: "",
      name: "",
      level: "1",
      pop_up: "",
      loading: false,
      open: false
    };
  }

  fetchGroup = () => {
    const token = localStorage.getItem("token");
    const { study_group_id } = this.state;
    axios
      .get(
        `https://smart-up.herokuapp.com/api/v1/study_groups/${study_group_id}`,
        {
          headers: {
            Authorization: token
          }
        }
      )
      .then(res => {
        console.log(res);
        if (res.status === 200) {
          this.setState({
            name: res.data.name,
            level: res.data.level,
            GroupMembers: res.data.members
          });
        }
      });
  };

  // popup notification functions
  handleClick = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };
  //ends

  EditGroup = e => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const { study_group_id, name, level } = this.state;
    axios
      .put(
        `https://smart-up.herokuapp.com/api/v1/study_groups/${study_group_id}`,
        {
          study_group: {
            name,
            level
          }
        },
        { headers: { Authorization: token } },
        this.setState({
          loading: true
        })
      )
      .then(res => {
        console.log(res);
        if (res.status === 200) {
          this.setState({
            pop_up: res.data.name,
            loading: false
          });
          this.handleClick();
        }
      });
  };

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  componentDidMount() {
    this.fetchGroup();
  }

  render() {
    const { loading, open, level, name, pop_up } = this.state;
    const { classes } = this.props;

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
              <span className="popup-text">Study Group Updated</span>
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
            <h2>Edit Group</h2>
            <div className="col-md-9" id="institution-settings">
              <form onSubmit={this.EditGroup} className="form-horizontal">
                <div className="form-group">
                  <label className="col-lg-3 control-label">
                    Study Group name:
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
                  <label className="col-lg-3 control-label">Grade</label>
                  <div className="col-lg-8">
                    <select
                      className="form-control"
                      name="level"
                      value={level}
                      onChange={this.handleChange}
                    >
                      {Array.from(new Array(12), (val, index) => index + 1).map(
                        lev => (
                          <option key={lev} value={lev}>
                            {" "}
                            Grade {lev}
                          </option>
                        )
                      )}
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
                      onClick={this.EditGroup}
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

EditGroup.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(EditGroup);
