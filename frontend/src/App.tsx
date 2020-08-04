import React from 'react';
import { Router } from "@reach/router"

import FormView from './components/FormView';
import QuestionView from './components/QuestionView';
import Header from './components/Header';
import QuizView from './components/QuizView';

function App() {
  return (
    <div className="App">
      <Header />
      <Router className="container-fluid py-3">
        <QuestionView path="/" />
        <FormView path="/add" />
        <QuizView path="/play" />
      </Router>
    </div>
  );
}

export default App;
