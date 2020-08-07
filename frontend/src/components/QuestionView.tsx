import React, { useState, useEffect } from 'react';
import { RouteComponentProps } from "@reach/router"

import Question, { questionModel } from './Question';
import Search from './Search';

const QuestionView: React.FC<RouteComponentProps> = (props) => {
  const [state, setState] = useState({
    questions: [] as questionModel[],
    page: 1,
    totalQuestions: 0,
    categories: [] as { id: number, type: string }[],
    currentCategory: null,
  })

  const getQuestions = (page?: number) => {
    //TODO: update request URL
    fetch(`/questions?page=${page || state.page}`).then(rsp => rsp.json()).then(result => {
      setState({
        ...state,
        questions: result.questions,
        totalQuestions: result.total_questions,
        categories: result.categories,
        currentCategory: result.current_category,
        page: result.page
      })
      return;
    }).catch(error => {
      alert('Unable to load questions. Please try your request again')
      return;
    })

  }

  useEffect(getQuestions, [])

  const selectPage = (num: number) => {
    setState({ ...state, page: num });
    getQuestions(num);
  }

  const createPagination = () => {
    let pageNumbers = [];
    let maxPage = Math.ceil(state.totalQuestions / 10)
    for (let i = 1; i <= maxPage; i++) {
      pageNumbers.push(
        <li key={i} className={`page-item ${i === state.page ? 'active' : ''}`}>
          <button className="page-link" onClick={() => { selectPage(i) }}>{i}</button>
        </li>
        )
    }
    return pageNumbers;
  }

  const getByCategory = (id: number) => {
    //TODO: update request URL
    fetch(`/categories/${id}/questions`).then(rsp => rsp.json()).then(result => {
      setState({
        ...state,
        questions: result.questions,
        totalQuestions: result.total_questions,
        currentCategory: result.current_category
      })
      return;
    }).catch(error => {
      alert('Unable to load questions. Please try your request again')
      return;
    })
  }

  const submitSearch = (searchTerm: string) => fetch('/questions/search', {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ searchTerm: searchTerm }),
    }).then(rsp => rsp.json()).then(result => {
      setState({
        ...state,
        questions: result.questions,
        totalQuestions: result.total_questions,
        currentCategory: result.current_category
      })
      return;
    }).catch(error => {
      alert('Unable to load questions. Please try your request again')
      return;
    })
    
  const questionAction = (id: number) => (action: string) => {
    if (action === 'DELETE') {
      if (window.confirm('are you sure you want to delete the question?')) {
        //TODO: update request URL
        fetch(`/questions/${id}`, { method: 'DELETE' }).then(rsp => rsp.json()).then(result => {
          getQuestions();
        }).catch(error => {
          alert('Unable to load questions. Please try your request again')
          return;
        })
      }
    }
  }

  return (
    <div className="row align-items-start">
      <div className="col-sm-4 col-lg-3 sticky-sm-top">
        <h2 onClick={() => { getQuestions() }}>Categories</h2>
        <div className="flex-row justify-content-start flex-sm-column btn-group-lg btn-group-vertical w-100" style={{overflow: 'auto'}}>
          <button className="btn" onClick={() => getByCategory(0)}>ALL</button>
          {state.categories.map(category => <button key={category.id} className="btn" onClick={() => { getByCategory(category.id) }}>
            <img src={`${category.type.toLowerCase()}.svg`} alt={category.type} style={{ width: 28 }}/>
            <span className="px-1">{category.type}</span>
          </button>)}
        </div>
        <Search submitSearch={submitSearch} />
      </div>
      <div className="col">
        <h2>{state.categories.find(c => c.id == state.currentCategory)?.type || "All"} Questions</h2>
        {state.questions.map((q, ind) => (
          <Question
            key={q.id}
            question={q.question}
            answer={q.answer}
            category={state.categories.find(c => c.id == q.category)?.type || ""}
            difficulty={q.difficulty}
            questionAction={questionAction(q.id)}
          />
        ))}
        <ul className="pagination justify-content-center">
          {createPagination()}
        </ul>
      </div>

    </div>
  );
}

export default QuestionView;
