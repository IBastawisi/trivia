import React, { useState } from 'react';
import { RouteComponentProps } from "@reach/router"
import Recyclebin from "../images/delete.svg"

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
    <div className="card m-1">
      <div className="card-body p-3">
        <div className="card-title">{question}</div>
        <div className="card-text d-flex align-items-center mb-3">
          <img src={`${category.toLowerCase()}.svg`} alt={category} style={{ width: 28 }} />
          <span className="px-3">Difficulty: {difficulty}</span>
          <button className="btn btn-danger btn-sm rounded-circle p-1" style={{ fontSize: 0 }} onClick={() => props.questionAction('DELETE')}>
            <img src={Recyclebin} alt="Delete" style={{ width: 16 }} />
          </button>
        </div>
        <div className="row m-0 align-items-center">
          <button className="btn btn-primary mr-3 mb-2"
            onClick={() => setVisibleAnswer(!visibleAnswer)}>
            {visibleAnswer ? 'Hide' : 'Show'} Answer
        </button>
          {visibleAnswer && <span className="h5">Answer: {answer}</span>}
        </div>

      </div>
    </div>
  );
}

export default Question;
