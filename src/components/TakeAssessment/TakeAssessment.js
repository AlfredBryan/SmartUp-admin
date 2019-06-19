import React, { Component } from "react";
import axios from "axios";
import Pagination from "react-paginating";

import Navigation from "components/Navigation/Navigation";

class TakeAssessment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: [],
      currentPage: 1
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
          const result = res.data.map(
            ({ name, description, answer_options }) => (
              <div>
                <li>{name}</li>
                <li>{description}</li>
                {answer_options.map(item => (
                  <ul key={item.id}>{item.content}</ul>
                ))}
              </div>
            )
          );
          this.setState({
            questions: result
          });
        }
      })
      .catch(error => {});
  };

  handlePageChange = (page, e) => {
    this.setState({
      currentPage: page
    });
  };

  componentDidMount() {
    this.fetchQuestions();
  }

  render() {
    const { questions, currentPage } = this.state;

    console.log(questions);
    const limit = 2;
    const pageCount = 3;
    const total = questions.length * limit;

    return (
      <React.Fragment>
        <Navigation />
        <div className="main-content">
          <div className="container">
            <ul>{questions[currentPage - 1]}</ul>
            <Pagination
              total={total}
              limit={limit}
              pageCount={pageCount}
              currentPage={currentPage}
            >
              {({
                pages,
                currentPage,
                hasNextPage,
                hasPreviousPage,
                previousPage,
                nextPage,
                totalPages,
                getPageItemProps
              }) => (
                <div>
                  <button
                    {...getPageItemProps({
                      pageValue: 1,
                      onPageChange: this.handlePageChange
                    })}
                  >
                    first
                  </button>

                  {hasPreviousPage && (
                    <button
                      {...getPageItemProps({
                        pageValue: previousPage,
                        onPageChange: this.handlePageChange
                      })}
                    >
                      {"<"}
                    </button>
                  )}

                  {pages.map(page => {
                    let activePage = null;
                    if (currentPage === page) {
                      activePage = { backgroundColor: "#fdce09" };
                    }
                    return (
                      <button
                        {...getPageItemProps({
                          pageValue: page,
                          key: page,
                          style: activePage,
                          onPageChange: this.handlePageChange
                        })}
                      >
                        {page}
                      </button>
                    );
                  })}

                  {hasNextPage && (
                    <button
                      {...getPageItemProps({
                        pageValue: nextPage,
                        onPageChange: this.handlePageChange
                      })}
                    >
                      {">"}
                    </button>
                  )}

                  <button
                    {...getPageItemProps({
                      pageValue: totalPages,
                      onPageChange: this.handlePageChange
                    })}
                  >
                    last
                  </button>
                </div>
              )}
            </Pagination>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default TakeAssessment;
