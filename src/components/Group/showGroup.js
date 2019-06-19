import React, { Component } from "react";
import Navigation from "components/Navigation/Navigation";
import axios from "axios";
import { Link } from "react-router-dom";

import EditIcon from "@material-ui/icons/Edit";
import Fab from "@material-ui/core/Fab";
import Tooltip from "@material-ui/core/Tooltip";

import ReactMde from "react-mde";
import * as Showdown from "showdown";
import "react-mde/lib/styles/css/react-mde-all.css";

import "./style.css";
import Spinner from "components/hoc/spinner";

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

    this.converter = new Showdown.Converter({
      tables: true,
      simplifiedAutoLink: true,
      strikethrough: true,
      tasklists: true
    });
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

  handleTextAreaChange = user_emails => {
    this.setState({ user_emails });
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
              <div className="form-group">
                <label className="col-lg-8 adjust-input control-label">
                  Group Users
                </label>
                <div className="col-lg-12">
                  <ReactMde
                    onChange={this.handleTextAreaChange}
                    value={user_emails}
                    generateMarkdownPreview={markdown =>
                      Promise.resolve(this.converter.makeHtml(markdown))
                    }
                  />
                </div>
              </div>
              <div className="form-group">
                <div className="col-lg-12">
                  <button
                    onClick={this.AddUsers}
                    className="form-control btn-submit"
                  >
                    {loading ? <Spinner /> : "Add Users"}
                  </button>
                </div>
              </div>
            </form>
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
