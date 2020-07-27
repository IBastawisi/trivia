import React, { useState } from 'react';
import { RouteComponentProps } from "@reach/router"

import '../stylesheets/Question.css';

export type questionModel = {
  id: number, question: string, answer: string, category: number, difficulty: string
};


export type QuestionComponentProps = RouteComponentProps & {
  question: string, answer: string, category: string, difficulty: string,
  questionAction(action: string): void
};

const Question: React.FC<& QuestionComponentProps> = (props) => {
  const [visibleAnswer, setVisibleAnswer] = useState(false)
  const { question, answer, category, difficulty } = props;
  return (
    <div className="Question-holder">
      <div className="Question">{question}</div>
      <div className="Question-status">
        <img className="category" src={`${category}.svg`} alt={category} />
        <div className="difficulty">Difficulty: {difficulty}</div>
        <img src="delete.png" className="delete" onClick={() => props.questionAction('DELETE')} alt="Delete"/>

      </div>
      <div className="show-answer button"
        onClick={() => setVisibleAnswer(!visibleAnswer)}>
        {visibleAnswer ? 'Hide' : 'Show'} Answer
          </div>
      {visibleAnswer && <div className="answer-holder">
        <span>Answer: {answer}</span>
      </div>}
    </div>
  );
}

export default Question;
