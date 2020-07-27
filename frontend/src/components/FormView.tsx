import React, { useState, useEffect, createRef } from 'react';
import { RouteComponentProps } from "@reach/router"

import '../stylesheets/FormView.css';

const FormView: React.FC<RouteComponentProps> = (props) => {

  const [categories, setCategories]= useState([] as { id: number, type: string }[])
 
  const [question, setQuestion] = useState({
    question: "",
    answer: "",
    difficulty: 1,
    category: 1,
  })

  const formRef = createRef<HTMLFormElement>()

  useEffect(() => {
    //TODO: update request URL
    fetch(`/categories`).then(rsp => rsp.json()).then(result => {
      setCategories(result.categories)
      return;
    }).catch(error => {
      alert('Unable to load categories. Please try your request again')
      return;
    })
  }, [])


  const submitQuestion = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    fetch('/questions', {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(question),
    }).then(rsp => rsp.json()).then(result => {
      formRef.current?.reset();
      return;
    }).catch(error => {
      alert('Unable to add question. Please try your request again')
      return;
    })
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement & HTMLSelectElement>) => {
    setQuestion({ ...question, [event.target.name]: event.target.value })
  }

  return (
    <div id="add-form">
      <h2>Add a New Trivia Question</h2>
      <form className="form-view" onSubmit={submitQuestion} ref={formRef}>
        <label>
          Question
            <input type="text" name="question" onChange={handleChange} />
        </label>
        <label>
          Answer
            <input type="text" name="answer" onChange={handleChange} />
        </label>
        <label>
          Difficulty
            <select name="difficulty" onChange={handleChange}>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </label>
        <label>
          Category
          <select name="category" onChange={handleChange}>
            {categories.map(category => <option key={category.id} value={category.id}>{category.type}</option>)}
          </select>
        </label>
        <input type="submit" className="button" value="Submit" />
      </form>
    </div>
  );
}

export default FormView;
