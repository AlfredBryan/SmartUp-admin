import React, { Component } from "react";
import axios from "axios";

import Navigation from "components/Navigation/Navigation";

class Assessment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: []
    };
  }
  componentDidMount() {
    this.fetchQuestions();
  }

  fetchQuestions = () => {
    const token = localStorage.getItem("token");
    axios
      .get("https://smart-up.herokuapp.com/api/v1/questions", {
        headers: {
          Authorization: token
        }
      })
      .then(res => {
        this.setState({
          questions: res.data
        });
      });
  };
  render() {
    console.log(this.state.questions);
    return (
      <React.Fragment>
        <Navigation />
        <div className="main-content">
          <div className="container" />
        </div>
      </React.Fragment>
    );
  }
}

export default Assessment;
