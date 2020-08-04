import React, { useState, useEffect } from 'react';
import { RouteComponentProps } from "@reach/router"
import { questionModel } from './Question';

const questionsPerPlay = 5;

const QuizView: React.FC<RouteComponentProps> = (props) => {
  const [state, setState] = useState({
    playing: false,
    gameover: false,
    quizCategory: 0,
    previousQuestions: [] as number[],
    showAnswer: false,
    categories: [] as { id: number, type: string }[],
    numCorrect: 0,
    currentQuestion: {} as questionModel,
    guess: '',
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
    setState({ ...state, quizCategory: id, playing: true })
    getNextQuestion(id)
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, [event.target.name]: event.target.value })
  }

  const getNextQuestion = (category_id = state.quizCategory) => {
    const previousQuestions = [...state.previousQuestions]
    if (state.currentQuestion.id) { previousQuestions.push(state.currentQuestion.id) }

    fetch('/quizzes', {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ category_id: category_id.toString(), previous_questions: previousQuestions }),
    }).then(rsp => rsp.json()).then(result => {
      setState({
        ...state,
        quizCategory: category_id,
        showAnswer: false,
        previousQuestions: previousQuestions,
        currentQuestion: result.question,
        guess: '',
        playing: true,
        gameover: result.question ? false : true
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
      playing: false,
      gameover: false,
      quizCategory: 0,
      previousQuestions: [],
      showAnswer: false,
      numCorrect: 0,
      currentQuestion: {} as questionModel,
      guess: '',
    })
  }

  const renderPrePlay = () => {
    return (
      <div className="w-75 mx-auto mt-5">
        <div className="h3 text-center">Choose Category</div>
        <div className="btn-group-lg btn-group-vertical w-100" style={{ overflow: 'auto' }}>
          <button className="btn" onClick={() => selectCategory(0)}>ALL</button>
          {state.categories.map(category => <button key={category.id} className="btn" onClick={() => { selectCategory(category.id) }}>
            <img src={`${category.type.toLowerCase()}.svg`} alt={category.type} style={{ width: 28 }} />
            <span className="px-2">{category.type}</span>
          </button>)}
        </div>
      </div>
    )
  }

  const renderFinalScore = () => {
    return (
      <div className="w-75 mx-auto mt-5 text-center">
        <div className="h3 mb-3"> Your Final Score is {state.numCorrect}</div>
        <button className="btn btn-primary" onClick={restartGame}> Play Again? </button>
      </div>
    )
  }

  const evaluateAnswer = () => {
    const formatGuess = state.guess.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").toLowerCase()
    const answerArray = state.currentQuestion.answer.toLowerCase().split(' ');
    return formatGuess == state.currentQuestion.answer.toLowerCase() || answerArray.includes(formatGuess)
  }

  const renderCorrectAnswer = () => {
    let evaluate = evaluateAnswer()
    return (
      <div className="w-75 mx-auto mt-5">
        <div className="h5">{state.currentQuestion.question}</div>
        <div className={`alert alert-${evaluate ? 'success' : 'danger'}`}>{evaluate ? "You were correct!" : "You were incorrect"}
          <br/>
          {`${state.currentQuestion.answer} is the correct answer`}
        </div>
        <button className="btn btn-primary" onClick={e => getNextQuestion()}> Next Question </button>
      </div>
    )
  }

  const renderPlay = () => {
    return state.previousQuestions.length === questionsPerPlay || state.gameover
      ? renderFinalScore()
      : state.showAnswer
        ? renderCorrectAnswer()
        : (
          <div className="w-75 mx-auto mt-5">
            <div className="h5">{state.currentQuestion.question}</div>
            <form className="form-inline flex-nowrap my-2" onSubmit={submitGuess}>
              <input type="text" name="guess" className="form-control w-100 flex-grow-1" onChange={handleChange} />
              <button type="submit" className="btn btn-outline-success flex-shrink-0">Submit Answer</button>
            </form>
          </div>
        )
  }


  return state.playing
    ? renderPlay()
    : renderPrePlay()
}

export default QuizView;
