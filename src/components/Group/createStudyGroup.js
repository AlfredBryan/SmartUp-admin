import React, { Component } from "react";
import Navigation from "components/Navigation/Navigation";
import Spinner from "components/hoc/spinner";
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

class createStudyGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      level: "1",
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
        "https://smart-up.herokuapp.com/api/v1/study_groups",
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
        console.log(res);
        if (res.status === 200 && res.data.created_at !== null) {
          this.setState({
            loading: false,
            pop_up: res.data.name
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

  render() {
    const { loading, name, level, pop_up, open } = this.state;
    const { classes } = this.props;
    console.log(pop_up);
    return (
      <React.Fragment>
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
                  <label className="col-lg-3 control-label">Level:</label>
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
                            Level {lev}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <div className="col-lg-12">
                    <button
                      onClick={this.handleSubmit}
                      className="form-control btn-submit"
                    >
                      {loading ? <Spinner /> : "Submit"}
                    </button>
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
