import React, { Component } from "react";
import Navigation from "components/Navigation/Navigation";
import Spinner from "components/hoc/spinner";
import axios from "axios";
import AnswerOptions from "./AnswerOptions";

import "./style.css";

class createQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      topic_id: this.props.match.params.id,
      name: "",
      description: "",
      errorMessage: "",
      loading: false,
      items: [],
      correct: false
    };
  }

  postQuestion = e => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    let { name, description, topic_id } = this.state;

    const answer_options_attributes = this.state.items;

    if (name.length < 4 || description.length < 10) {
      this.setState({
        errorMessage: "Enter all fields"
      });
    } else {
      axios
        .post(
          `https://smart-up.herokuapp.com/api/v1/questions`,
          {
            question: {
              name,
              description,
              topic_id,
              answer_options_attributes
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
            alert("Successful");
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

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  addItem = event => {
    if (this._inputElement.value !== "") {
      let newOption = {
        content: this._inputElement.value,
        correct: false,
        key: Date.now()
      };
      this.setState(prevState => {
        return {
          items: prevState.items.concat(newOption)
        };
      });
    }
    this._inputElement.value = "";

    event.preventDefault();
  };

  deleteItem = key => {
    var filteredItems = this.state.items.filter(function(item) {
      return item.key !== key;
    });
    this.setState({
      items: filteredItems
    });
  };

  toggle = e => {
    this.setState({
      correct: !this.state.correct
    });
  };

  render() {
    const { errorMessage, loading, correct, items } = this.state;
    console.log(items);
    console.log(correct);
    return (
      <React.Fragment>
        <Navigation />
        <div className="main-content">
          <div className="container">
            <div className="center-div">
              <form onSubmit={this.postQuestion} className="form-horizontal">
                <div className="form-group">
                  <label className="col-lg-8 adjust-input control-label">
                    Question:
                  </label>
                  <div className="col-lg-10">
                    <input
                      className="form-control"
                      type="text"
                      name="name"
                      value={this.state.name}
                      placeholder="Enter Question ..."
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-lg-8 adjust-input control-label">
                    Description:
                  </label>
                  <div className="col-lg-10">
                    <textarea
                      className="form-control"
                      type="text"
                      name="description"
                      value={this.state.description}
                      placeholder="Enter Description ..."
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <div className="question_options">
                    <div className="Header">
                      <input
                        ref={a => (this._inputElement = a)}
                        placeholder="Enter Answer options"
                      />
                      <button onClick={this.addItem} type="submit">
                        Add Option
                      </button>
                    </div>
                    <AnswerOptions
                      entries={this.state.items}
                      delete={this.deleteItem}
                    />
                  </div>
                </div>
                {this.state.answer_options_attributes}
                <div className="form-group">
                  <div className="col-lg-10">
                    <button
                      onClick={this.postQuestion}
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
      </React.Fragment>
    );
  }
}

export default createQuestion;
