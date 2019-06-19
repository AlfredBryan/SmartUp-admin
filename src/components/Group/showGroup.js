import React, { Component } from "react";
import Navigation from "components/Navigation/Navigation";
import axios from "axios";
import { Link } from "react-router-dom";

import EditIcon from "@material-ui/icons/Edit";
import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";
import Tooltip from "@material-ui/core/Tooltip";

import "./style.css";

class showGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      study_group_id: this.props.match.params.id,
      group: "",
      GroupMembers: [],
      user_emails: "",
      loading: false
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
            group: res.data,
            GroupMembers: res.data.members
          });
        }
      });
  };

  AddUsers = e => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const { study_group_id, user_emails } = this.state;
    axios
      .post(
        "https://smart-up.herokuapp.com/api/v1/group_memberships",
        {
          group_membership: {
            study_group_id,
            user_emails
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
          this.fetchGroup();
          alert("Users Added Successfully");
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
    const { GroupMembers, group, user_emails, loading } = this.state;
    return (
      <React.Fragment>
        <Navigation />
        <div className="main-content">
          <div className="container">
            <div>
              <Link to={`/update_group/${group.id}`} className="button-area">
                <Tooltip title="Edit Group" aria-label="Edit">
                  <Fab color="primary">
                    <EditIcon />
                  </Fab>
                </Tooltip>
              </Link>
            </div>
            <h2>{group.name}</h2>
            <form onSubmit={this.AddUsers} className="form-horizontal">
              <h4>
                <strong>Add Users</strong>
              </h4>
              <div className="form-group">
                <div className="col-lg-8">
                  <span onClick={this.AddUsers} className="pull-right">
                    <Tooltip title="Add Users" aria-label="Edit">
                      <Fab color="primary">
                        <AddIcon />
                      </Fab>
                    </Tooltip>
                  </span>
                  <textarea
                    name="user_emails"
                    value={user_emails}
                    onChange={this.handleChange}
                    cols="40"
                    rows="4"
                  />
                </div>
              </div>
            </form>
            {/* <div>
              {GroupMembers > 0 ? (
                <div>
                  <p>
                    {GroupMembers.map(mem => (
                      <div>{mem.email}</div>
                    ))}
                  </p>
                </div>
              ) : (
                <span className="group-card">No members Yet</span>
              )}
            </div> */}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default showGroup;
