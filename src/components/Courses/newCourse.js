import React, { Component } from "react";
import "./course.css";
import axios from "axios";
import Spinner from "../hoc/spinner";
import Checkbox from "@material-ui/core/Checkbox";
import Navigation from "components/Navigation/Navigation";

class newCourse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      description: "",
      active: false,
      loading: false,
      institution_id: this.props.match.params.slug,
      errorMessage: ""
    };
  }

  postCourse = e => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const { name, description, active } = this.state;

    if (name.length < 4 || description.length < 10) {
      this.setState({
        errorMessage: "Please Enter all fields"
      });
    } else {
      let Id = this.state.institution_id;

      let Url = "https://smart-up.herokuapp.com/api/v1/courses";

      if (Id) {
        Url += `?institution_id=${Id}`;
      }
      axios
        .post(
          Url,
          {
            course: {
              name,
              description,
              active
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
          this.setState({
            loading: false,
            course: res.data
          });

          if (res.data.id !== null) {
            if (res.data.institution_id) {
              this.props.history.replace(
                `/institution/${Id}/courses/${res.data.slug}`
              );
            } else {
              this.props.history.replace(`/courses/${res.data.slug}`);
            }
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

  toggle = e => {
    this.setState({
      active: !this.state.active
    });
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { loading, errorMessage } = this.state;
    return (
      <div>
        <Navigation />
        <div>
          <div className="main-content">
            <div className="container">
              <div className="center-div">
                <form onSubmit={this.handleSubmit} className="form-horizontal">
                  <div className="form-group">
                    <label className="col-lg-8 adjust-input control-label">
                      Name
                    </label>
                    <div className="col-lg-12">
                      <input
                        className="form-control"
                        type="text"
                        name="name"
                        value={this.state.name}
                        placeholder="Course Name ..."
                        onChange={this.handleChange}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="col-lg-8 adjust-input control-label">
                      Introduction
                    </label>
                    <div className="col-lg-12">
                      <textarea
                        rows="6"
                        className="form-control"
                        name="description"
                        type="text"
                        value={this.state.description}
                        placeholder="Introduction ..."
                        onChange={this.handleChange}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="col-lg-8 adjust-input control-label">
                      Active:
                    </label>
                    <div className="col-lg-12">
                      <Checkbox
                        checked={this.state.active}
                        onChange={this.toggle}
                        value={this.state.active}
                        name="active"
                      />
                    </div>
                  </div>
                  <p style={{ color: "red" }}>{errorMessage}</p>
                  <div className="form-group">
                    <div className="col-lg-12">
                      <button
                        onClick={this.postCourse}
                        className="form-control btn-submit"
                      >
                        {loading ? <Spinner /> : "Create"}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default newCourse;
