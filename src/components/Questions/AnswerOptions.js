import React from "react";

const AnswerOptions = ({ content, correct, options, updateOptions, optionKey }) => {
  const handleCorrectOptionChange = e => {
    const updatedOptions = options.map(option => {
      if (option.key === optionKey) {
        option.correct = e.target.checked;
      }
      return option;
    });
    updateOptions(updatedOptions);
  };

  const deleteOption = key => {
    const filteredOptions = options.filter(option => {
      return option.key !== optionKey;
    });
    updateOptions(filteredOptions);
  };
  return (
    <div className="option_display">
      <input
        type="checkbox"
        checked={correct}
        onChange={handleCorrectOptionChange}
      />
      <span className="option_content">{content}</span>
      <i onClick={deleteOption} className="fa fa-trash pull-right" />
    </div>
  );
};

export default AnswerOptions;
