import React, { Component } from "react";
import axios from "axios";

import Navigation from "components/Navigation/Navigation";
import Pagination from "components/hoc/Pagination";

class TakeAssessment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: [],
      pageOfItems: []
    };
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
        if (res.status === 200) {
          this.setState({
            questions: res.data
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  // handlePageChange = (page, e) => {
  //   this.setState({
  //     questions: page
  //   });
  // };

  onChangePage = pageOfItems => {
    // update state with new page of items
    this.setState({ pageOfItems: pageOfItems });
  };

  componentDidMount() {
    this.fetchQuestions();
  }

  render() {
    const { questions, currentPage } = this.state;
    return (
      <React.Fragment>
        <Navigation />
        <div className="main-content">
          <div className="container">
            {this.state.pageOfItems.map(item => (
              <div key={item.id}>{item.name}</div>
            ))}
            <Pagination  items={this.state.exampleItems} onChangePage={this.onChangePage} />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default TakeAssessment;
