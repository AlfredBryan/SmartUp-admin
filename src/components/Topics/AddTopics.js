import React, { Component } from "react";
import axios from "axios";
import Spinner from "../hoc/spinner";
import Checkbox from "@material-ui/core/Checkbox";
import AdminNavbar from "../Navbars/AdminNavbar";
import Sidebar from "components/Sidebar/Sidebar";
import routes from "../../routes";

class AddTopic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      description: "",
      rank: "",
      active: false,
      loading: false,
      course_id: this.props.match.params.slug
    };
  }

  getBrandText = path => {
    for (let i = 0; i < routes.length; i++) {
      if (this.props.location.pathname.indexOf(routes[i].path) !== -1) {
        return routes[i].name;
      }
    }
    return "Create Course";
  };

  postTopic = e => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const { name, description, rank, active } = this.state;

    const course_slug = this.state.course_id;

    axios
      .post(
        `https://smart-up.herokuapp.com/api/v1/courses/${course_slug}/topics`,
        {
          course: {
            name,
            description,
            rank,
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
            this.props.history.replace(`/topic/${res.data.slug}`);
          } else {
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
      active: !this.state.active
    });
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { loading } = this.state;
    return (
      <div>
        <Sidebar
          {...this.props}
          routes={routes}
          hasImage={this.state.hasImage}
        />
        <div id="main-panel" className="main-panel" ref="mainPanel">
          <AdminNavbar
            {...this.props}
            brandText={this.getBrandText(this.props.location.pathname)}
          />
        </div>
        <div>
          <div className="main-content">
            <div className="container">
              <div className="center-div">
                <form onSubmit={this.handleSubmit} className="form-horizontal">
                  <div className="form-group">
                    <label className="col-lg-8 adjust-input control-label">
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
                    <label className="col-lg-8 adjust-input control-label">
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
                  <div className="form-group">
                    <label className="col-lg-8 adjust-input control-label">
                      Rank:
                    </label>
                    <div className="col-lg-12">
                      <select
                        className="form-control"
                        name="level"
                        value={this.state.rank}
                        onChange={this.handleChange}
                        id=""
                      >
                        {Array.from(
                          new Array(12),
                          (val, index) => index + 1
                        ).map(rank => (
                          <option value={rank}> Rank {rank}</option>
                        ))}
                      </select>
                    </div>
                  </div>
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

export default AddTopic;
