import React, { Component } from "react";
import { Helmet } from "react-helmet";
import axios from "axios";

import "./style.css";
import Spinner from "../hoc/spinner";
//popup notification
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
//file upload
import FileBase64 from "react-file-base64";

import Navigation from "components/Navigation/Navigation";
//Alert
import swal from "sweetalert";

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
    width: 360,
    fontSize: "1em"
  }
});

const Url = process.env.REACT_APP_BASE_URL;

class EditInstitution extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      motto: "",
      email: "",
      phone: "",
      logo: "",
      loading: false,
      response: "",
      institution_id: "",
      slug: this.props.match.params.slug
    };
  }

  // popup notification functions
  handleClick = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };
  //Ends

  //File upload begins
  uploadImageFile = file => {
    this.setState({ logo: file.base64 });
  };
  //Ends here

  //populate input fields
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
          institution_id: res.data.id,
          name: res.data.name,
          motto: res.data.motto,
          email: res.data.email,
          phone: res.data.phone
        });
      });
  }
  //ends

  handleSubmit = e => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    let { name, motto, email, phone, logo, institution_id } = this.state;
    if (name.length < 3 && email.length < 8 && phone.length < 10) {
      swal({
        title: "Fields cannot be empty",
        text: "Please enter all fields",
        icon: "warning",
        dangerMode: true
      });
    } else {
      axios
        .put(
          `${Url}/api/v1/institutions/${institution_id}`,
          {
            institution: {
              name,
              motto,
              email,
              phone,
              logo
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
          if (res) {
            this.setState({
              loading: false
            });
            this.props.history.replace(`/institutions/${res.data.slug}`);
          }
        })
        .catch(err => {
          if (err) {
            this.setState({
              loading: false
            });
          }
        });
    }
  };

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  componentDidMount() {
    this.fetchInstitution();
  }

  render() {
    const { loading, open, response } = this.state;
    const { classes } = this.props;
    return (
      <div>
        <Helmet>
          <meta charSet="utf-8" />
          <title>Institution</title>
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
            <span id="snackbar-fab-message-id popup-text">
              <span className="user-popup">{response.name}</span> Updated
              Successfully
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
            <h2>Edit Institution</h2>
            <div className="col-md-9" id="institution-settings">
              <form onSubmit={this.handleSubmit} className="form-horizontal">
                <div className="form-group">
                  <label className="col-lg-3 control-label">
                    Institution name
                  </label>
                  <div className="col-lg-8">
                    <input
                      className="form-control"
                      type="text"
                      name="name"
                      value={this.state.name}
                      placeholder="Institution Name ..."
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-lg-3 control-label">
                    Contact Email
                  </label>
                  <div className="col-lg-8">
                    <input
                      className="form-control"
                      name="email"
                      type="email"
                      value={this.state.email}
                      placeholder="Contact email ..."
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-lg-3 control-label">Motto</label>
                  <div className="col-lg-8">
                    <input
                      className="form-control"
                      type="text"
                      name="motto"
                      value={this.state.motto}
                      placeholder="Motto ..."
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-lg-3 control-label">Phone</label>
                  <div className="col-lg-8">
                    <input
                      className="form-control"
                      name="phone"
                      type="text"
                      value={this.state.phone}
                      placeholder="Phone Number ..."
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-lg-3 control-label">Logo</label>
                  <div className="col-lg-8">
                    <FileBase64
                      multiple={false}
                      onDone={this.uploadImageFile}
                    />
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
      </div>
    );
  }
}

EditInstitution.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(EditInstitution);
