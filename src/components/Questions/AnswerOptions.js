import React, { Component } from "react";
import "./style.css";

class AnswerOptions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      correct: false
    };
  }

  toggle = e => {
    this.setState({
      active: !this.state.active
    });
  };

  createOption = option => {
    return (
      <div key={option.key}>
        <i
          onClick={() => this.delete(option.key)}
          className="fa fa-trash pull-right"
        />
        <li>
          <span>{option.content}</span>
        </li>
      </div>
    );
  };

  delete(key) {
    this.props.delete(key);
  }
  toggleClick(key) {
    this.props.correct(key);
  }

  render() {
    let optionEntries = this.props.entries;
    let listOptions = optionEntries.map(this.createOption);

    return <div className="option_list">{listOptions}</div>;
  }
}

export default AnswerOptions;
