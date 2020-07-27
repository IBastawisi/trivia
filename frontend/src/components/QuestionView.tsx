import React, { useState, useEffect } from 'react';
import { RouteComponentProps } from "@reach/router"

import Question, { questionModel } from './Question';
import Search from './Search';

import '../stylesheets/App.css';

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
        <span
          key={i}
          className={`page-num ${i === state.page ? 'active' : ''}`}
          onClick={() => { selectPage(i) }}>{i}
        </span>)
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
    <div className="question-view">
      <div className="categories-list">
        <h2 onClick={() => { getQuestions() }}>Categories</h2>
        <ul>
          {state.categories.map(category => <li key={category.id} onClick={() => { getByCategory(category.id) }}>
            {category.type}
            <img className="category" src={`${category.type.toLowerCase()}.svg`} alt={category.type} />
          </li>)}
        </ul>
        <Search submitSearch={submitSearch} />
      </div>
      <div className="questions-list">
        <h2>Questions</h2>
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
        <div className="pagination-menu">
          {createPagination()}
        </div>
      </div>

    </div>
  );
}

export default QuestionView;
