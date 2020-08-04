import React, { useState, useEffect, createRef } from 'react';
import { RouteComponentProps } from "@reach/router"

const FormView: React.FC<RouteComponentProps> = (props) => {

  const [categories, setCategories] = useState([] as { id: number, type: string }[])

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
    <div className="d-flex flex-column align-items-center">
      <h2>Add a New Trivia Question</h2>
      <form className="col-sm-6" onSubmit={submitQuestion} ref={formRef}>
        <label className="w-100">
          Question
            <input type="text" name="question" className="form-control mt-2" onChange={handleChange} />
        </label>
        <label className="w-100">
          Answer
            <input type="text" name="answer" className="form-control mt-2" onChange={handleChange} />
        </label>
        <label className="w-100">
          Difficulty
            <select name="difficulty" className="form-control mt-2" onChange={handleChange}>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </label>
        <label className="w-100">
          Category
          <select name="category" className="form-control mt-2" onChange={handleChange}>
            {categories.map(category => <option key={category.id} value={category.id}>{category.type}</option>)}
          </select>
        </label>
        <button type="submit" className="btn btn-outline-success">Submit</button>
      </form>
    </div>
  );
}

export default FormView;
