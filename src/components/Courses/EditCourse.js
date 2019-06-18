import React, { Component } from "react";
import "./course.css";
import axios from "axios";
import Spinner from "../hoc/spinner";
import Checkbox from "@material-ui/core/Checkbox";
import Navigation from "components/Navigation/Navigation";

class EditCourse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      description: "",
      active: false,
      loading: false,
      course_slug: this.props.match.params.slug,
      institution_id: this.props.match.params.slug,
      course: ""
    };
  }

  fetchCourse = () => {
    const token = localStorage.getItem("token");
    axios
      .get(`https://smart-up.herokuapp.com/api/v1/courses/${this.state.course_slug}`, 
      
      {
        headers: {
          Authorization: token
        }
      })
      .then(res => {
        this.setState({
          name: res.data.name, description: res.data.description, active: res.data.active
        });
      });
  };

  postCourse = e => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const { name, description, active } = this.state;

    let Id = this.state.institution_id;

    let Url = "https://smart-up.herokuapp.com/api/v1/courses";

    if (Id) {
      Url += `?institution_id=${Id}`;
    }
    axios
      .put(
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
  };

  toggle = e => {
    this.setState({
      active: !this.state.course.active
    });
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  componentDidMount() {
    this.fetchCourse();
  }

  render() {
    const { loading, name, description, active } = this.state;
    return (
      <div>
        <Navigation />
        <div className="main-content">
          <div className="container">
            <h3>Edit Course</h3>
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
                      value={name}
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
                      value={description}
                      placeholder="Introduction..."
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
                      checked={active}
                      onChange={this.toggle}
                      value={(active || "").toString()}
                      name="active"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <div className="col-lg-12">
                    <button
                      onClick={this.postCourse}
                      className="form-control btn-submit"
                    >
                      {loading ? <Spinner /> : "Update"}
                    </button>
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

export default EditCourse;
