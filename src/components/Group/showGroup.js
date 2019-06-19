import React, { Component } from "react";
import Navigation from "components/Navigation/Navigation";
import axios from "axios";
import { Link } from "react-router-dom";

import EditIcon from "@material-ui/icons/Edit";
import Fab from "@material-ui/core/Fab";
import Tooltip from "@material-ui/core/Tooltip";

import "./style.css";

class showGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      study_group_id: this.props.match.params.id,
      group: "",
      GroupMembers: []
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

  joinGroup = e => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    const { study_group_id } = this.state;
    const user_id = user.id;
    const user_emails = user.email;
    axios
      .post(
        "https://smart-up.herokuapp.com/api/v1/group_memberships",
        {
          group_membership: {
            study_group_id,
            user_id,
            user_emails
          }
        },
        {
          headers: {
            Authorization: token
          }
        }
      )
      .then(res => {
        console.log(res);
      });
  };

  componentDidMount() {
    this.fetchGroup();
  }

  render() {
    const { GroupMembers, group } = this.state;
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
              <button onClick={this.joinGroup} className="btn-join">
                Join
              </button>
            </div>
            <h2>{group.name}</h2>
            <div>
              {GroupMembers > 0 ? (
                <div>
                  <p>{GroupMembers.name}</p>
                </div>
              ) : (
                <span className="group-card">No members Yet</span>
              )}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default showGroup;
