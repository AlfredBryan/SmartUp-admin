import React, { Component } from "react";
import Navigation from "components/Navigation/Navigation";
import Spinner from "components/hoc/spinner";
import DatePicker from "react-datepicker";
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

class newAttendance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      marked_on: new Date(),
      study_group_id: this.props.match.params.id,
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
    const user = JSON.parse(localStorage.getItem("user"));
    const { name, marked_on, study_group_id } = this.state;
    axios
      .post(
        "https://smart-up.herokuapp.com/api/v1/attendances",
        {
          attendance: {
            study_group_id,
            name,
            marked_on,
            user_id: user.id
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
          this.props.history.replace(`/show_group/${study_group_id}`);
        }
      });
  };

  handleDateChange = date => {
    this.setState({
      marked_on: date
    });
  };

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  render() {
    const { loading, name, marked_on, pop_up, open } = this.state;
    const { classes } = this.props;
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
            <h3>New attendance log</h3>
            <div className="col-md-9" id="institution-settings">
              <form onSubmit={this.handleSubmit} className="form-horizontal">
              <div className="form-group">
                  <label className="col-lg-3 control-label">
                    Title
                  </label>
                  <div className="col-lg-8">
                    <input
                      className="form-control"
                      type="text"
                      name="name"
                      value={name}
                      placeholder="Log title ..."
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
              <div className="form-group">
                <label className="col-lg-3 control-label">Date</label>
                <div className="col-lg-8">
                  <DatePicker
                    selected={this.state.marked_on}
                    onChange={this.handleDateChange}
                    peekNextMonth
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    dateFormat="dd/MM/yyyy"
                  />
                </div>
              </div>
                
                <div className="form-group">
                  <div className="col-md-12">
                  <Button
                    variant="contained"
                    component="span"
                    color="secondary"
                    className="form-control new-btn"
                    onClick={this.handleSubmit}
                    >
                    {loading ? <Spinner /> : "Create"}
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

newAttendance.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(newAttendance);
