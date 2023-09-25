import { useEffect, useState } from "react";
import "./App.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";

import api from "./api";
import QuizForm from "./QuizForm";
import QuizDetails from "./QuizDetais";
import QuizList from "./QuizList";
import { Quiz } from "./types";

function App() {
  const [quizes, setQuizes] = useState<Quiz[]>([]);

  useEffect(() => {
    api
      .get("/quizzes")
      .then((response) => {
        setQuizes(response.data);
      })
      .catch((error) => {
        console.error("Error fetching quiz data:", error);
      });
  }, []);

  const handleAddQuiz = (quiz: Quiz) => {
    try {
      setQuizes([...quizes, quiz]);
      api.post("/quizzes", quiz).catch((error) => {
        console.error("Error adding quiz:", error);
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleChangeQuiz = (quiz: Quiz) => {
    try {
      api.put(`/quizzes/${quiz.id}`, quiz).catch((error) => {
        console.error("Error editing quiz:", error);
      });

      const quizIndex = quizes.findIndex((q) => q.id === quiz.id);
      const newQuizes = [...quizes];
      newQuizes[quizIndex] = quiz;
      setQuizes(newQuizes);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/add" element={<QuizForm onAddQuiz={handleAddQuiz} />} />
        <Route path="/quiz/:id" element={<QuizDetails />} />
        <Route path="/" element={<QuizList quizes={quizes} />} />
        <Route
          path="/edit/:id"
          element={<QuizForm onAddQuiz={handleChangeQuiz} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
