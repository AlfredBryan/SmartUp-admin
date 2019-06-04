import React, { Component } from "react";
import axios from "axios";
import Spinner from "../hoc/spinner";
import Checkbox from "@material-ui/core/Checkbox";
import Navigation from "components/Navigation/Navigation";

class EditTopic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      description: "",
      rank: "",
      active: false,
      loading: false,
      course_slug: this.props.match.params.course_slug,
      topic_id: this.props.match.params.id,
      lecture_type: "text",
      errorMessage: ""
    };
  }

  Capitalize = str => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  editTopic = e => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const {
      name,
      description,
      rank,
      active,
      lecture_type,
      course_slug,
      topic_id
    } = this.state;

    if (name.length < 4 || description.length < 10) {
      this.setState({
        errorMessage: "Please Enter all fields"
      });
    } else {
      axios
        .put(
          `https://smart-up.herokuapp.com/api/v1/courses/${course_slug}/topics/${topic_id}`,
          {
            topic: {
              name,
              description,
              rank,
              active,
              lecture_type
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
          if (res.status === 200) {
            this.setState({
              loading: false
            });
            alert("Topic Edited Successfully");
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
                <form onSubmit={this.editTopic} className="form-horizontal">
                  <div className="form-group">
                    <label className="col-lg-8 adjust-input control-label">
                      Topic name:
                    </label>
                    <div className="col-lg-12">
                      <input
                        className="form-control"
                        type="text"
                        name="name"
                        value={this.state.name}
                        placeholder="Topic Name ..."
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
                      Lecture Type:
                    </label>
                    <div className="col-lg-12">
                      <select className="form-control" name="" id="">
                        {["text", "video"].map(lt => (
                          <option value={lt}>{this.Capitalize(lt)}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="col-lg-8 adjust-input control-label">
                      Rank:
                    </label>
                    <div className="col-lg-12">
                      <select
                        className="form-control"
                        name="rank"
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
                  <p style={{ color: "red" }}>{errorMessage}</p>
                  <div className="form-group">
                    <div className="col-lg-12">
                      <button
                        onClick={this.editTopic}
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

export default EditTopic;
