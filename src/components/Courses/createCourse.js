import React, { Component } from "react";
import CustomNav from "../CustomNav/CustomNav";
import SideBar from "../User/Sidebar";
import Spinner from "../hoc/spinner";
import "./course.css";
import axios from "axios";

class createCourse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      description: "",
      active: false,
      loading: false
    };
  }

  postCourse = e => {
    e.preventDefault();
    const institution = this.props.match.params.id;
    const token = localStorage.getItem("token");
    const { name, description, active } = this.state;

    let Url = "https://smart-up.herokuapp.com/api/v1/courses";

    if (institution) {
      Url += `?institution_id=${institution.id}`;
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
        this.setState({
          loading: false,
          course: res.data
        });

        if (res.data.id !== null) {
          this.props.history.replace(`/courses/${res.data.slug}`);
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

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  toggle = e => {
    this.setState({
      active: !this.state.active
    });
  };

  render() {
    const { loading } = this.state;

    return (
      <div>
        <CustomNav />
        <SideBar />
        <div className="center">
          <div className="container">
            <div className="main-content">
              <h4>Create Course</h4>
              <div className="center-div">
                <form onSubmit={this.handleSubmit} className="form-horizontal">
                  <div className="form-group">
                    <label className="col-lg-12 control-label">
                      Course name:
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
                    <label className="col-lg-12 control-label">
                      Description:
                    </label>
                    <div className="col-lg-12">
                      <textarea
                        rows="6"
                        className="form-control"
                        name="description"
                        type="text"
                        value={this.state.description}
                        placeholder="Description ..."
                        onChange={this.handleChange}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="col-lg-12 control-label">Active:</label>
                    <div className="col-lg-12">
                      <input
                        type="checkbox"
                        name="active"
                        checked={this.state.active}
                        onChange={this.toggle}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="col-lg-12">
                      <button
                        onClick={this.postCourse}
                        className="form-control"
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

export default createCourse;
