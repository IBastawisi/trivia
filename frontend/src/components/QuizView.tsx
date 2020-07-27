import React, { useState, useEffect } from 'react';
import { RouteComponentProps } from "@reach/router"

import '../stylesheets/QuizView.css';
import { questionModel } from './Question';

const questionsPerPlay = 5;

const QuizView: React.FC<RouteComponentProps> = (props) => {
  const [state, setState] = useState({
    quizCategory: 0,
    previousQuestions: [] as number[],
    showAnswer: false,
    categories: [] as { id: number, type: string }[],
    numCorrect: 0,
    currentQuestion: {} as questionModel,
    guess: '',
    forceEnd: false
  })

  useEffect(() => {
    //TODO: update request URL
    fetch(`/categories`).then(rsp => rsp.json()).then(result => {
      setState(prev => { return { ...prev, categories: result.categories } })
      return;
    }).catch(error => {
      alert('Unable to load categories. Please try your request again')
      return;
    })
  }, [])


  const selectCategory = (id = 0) => {
    setState({ ...state, quizCategory: id })
    getNextQuestion(id)
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, [event.target.name]: event.target.value })
  }

  const getNextQuestion = (category_id = state.quizCategory) => {
    const previousQuestions = [...state.previousQuestions]
    if (state.currentQuestion.id) { previousQuestions.push(state.currentQuestion.id) }

    //TODO: update request URL
    fetch('/quizzes', {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({category_id: category_id.toString(), previous_questions:previousQuestions}),
    }).then(rsp => rsp.json()).then(result => {
      setState({
        ...state,
        quizCategory: category_id,
        showAnswer: false,
        previousQuestions: previousQuestions,
        currentQuestion: result.question,
        guess: '',
        forceEnd: result.question ? false : true
      })
      return;
    }).catch(error => {
      alert('Unable to load question. Please try your request again')
      return;
    })
  }

  const submitGuess = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let evaluate = evaluateAnswer()
    setState({
      ...state,
      numCorrect: !evaluate ? state.numCorrect : state.numCorrect + 1,
      showAnswer: true,
    })
  }

  const restartGame = () => {
    setState({
      ...state,
      quizCategory: 0,
      previousQuestions: [],
      showAnswer: false,
      numCorrect: 0,
      currentQuestion: {} as questionModel,
      guess: '',
      forceEnd: false
    })
  }

  const renderPrePlay = () => {
    return (
      <div className="quiz-play-holder">
        <div className="choose-header">Choose Category</div>
        <div className="category-holder">
          <div className="play-category" onClick={() => selectCategory(0)}>ALL</div>
          {state.categories.map(category => <div
            key={category.id}
            className="play-category"
            onClick={() => selectCategory(category.id)}>
            {category.type}
          </div>
          )}
        </div>
      </div>
    )
  }

  const renderFinalScore = () => {
    return (
      <div className="quiz-play-holder">
        <div className="final-header"> Your Final Score is {state.numCorrect}</div>
        <div className="play-again button" onClick={restartGame}> Play Again? </div>
      </div>
    )
  }

  const evaluateAnswer = () => {
    const formatGuess = state.guess.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").toLowerCase()
    const answerArray = state.currentQuestion.answer.toLowerCase().split(' ');
    return answerArray.includes(formatGuess)
  }

  const renderCorrectAnswer = () => {
    let evaluate = evaluateAnswer()
    return (
      <div className="quiz-play-holder">
        <div className="quiz-question">{state.currentQuestion.question}</div>
        <div className={`${evaluate ? 'correct' : 'wrong'}`}>{evaluate ? "You were correct!" : "You were incorrect"}</div>
        <div className="quiz-answer">{state.currentQuestion.answer}</div>
        <div className="next-question button" onClick={e=> getNextQuestion()}> Next Question </div>
      </div>
    )
  }

  const renderPlay = () => {
    return state.previousQuestions.length === questionsPerPlay || state.forceEnd
      ? renderFinalScore()
      : state.showAnswer
        ? renderCorrectAnswer()
        : (
          <div className="quiz-play-holder">
            <div className="quiz-question">{state.currentQuestion.question}</div>
            <form onSubmit={submitGuess}>
              <input type="text" name="guess" onChange={handleChange} />
              <input className="submit-guess button" type="submit" value="Submit Answer" />
            </form>
          </div>
        )
  }


  return state.currentQuestion.id
    ? renderPlay()
    : renderPrePlay()
}

export default QuizView;
