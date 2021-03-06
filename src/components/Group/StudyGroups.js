import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Helmet } from "react-helmet";

import Navigation from "components/Navigation/Navigation";

const Url = process.env.REACT_APP_BASE_URL;

class StudyGroups extends Component {
  constructor(props) {
    super(props);
    this.state = {
      study_groups: []
    };
  }

  fetchGroups = () => {
    const token = localStorage.getItem("token");
    axios
      .get(`${Url}/api/v1/study_groups`, {
        headers: { Authorization: token }
      })
      .then(res => {
        if (res.status === 200) {
          this.setState({
            study_groups: res.data
          });
        }
      });
  };

  componentDidMount() {
    this.fetchGroups();
  }

  render() {
    const { study_groups } = this.state;
    return (
      <React.Fragment>
        <Helmet>
          <meta charSet="utf-8" />
          <title>Study Groups</title>
        </Helmet>
        <Navigation />
        <div className="main-content">
          <div className="container">
            <div className="row push-down">
              <h3>Study Groups</h3>
              <div className="row" id="assessments_home">
                {study_groups.map(stud => (
                  <div key={stud.id} className="col-md-4">
                    <div className="card">
                      <Link
                        to={`/show_group/${stud.id}`}
                        className="display-uni"
                      >
                        <FontAwesomeIcon icon="users-cog" size="3x" />
                        <h6 className="assessment_name">{stud.name}</h6>
                        <p className="assessment_course_name">
                          <strong>Grade</strong>:{stud.level}
                        </p>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default StudyGroups;
