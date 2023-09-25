import React, { useEffect, useState } from "react";
import { Quiz, QuestionAnswer, Answer } from "./types";
import { v4 as uuidv4 } from "uuid";
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";

import { useNavigate, useParams } from "react-router-dom";

import api from "./api";

interface props {
  onAddQuiz: (quiz: Quiz) => void;
}

const AddQuiz: React.FC<props> = ({ onAddQuiz }) => {
  const [quiz, setQuiz] = useState<Quiz>({
    created: new Date().toLocaleDateString(),
    description: "",
    id: uuidv4(),
    modified: new Date().toLocaleDateString(),
    questions_answers: [],
    score: 0,
    title: "",
    url: "",
  });

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      const result = await api.get(`/quizzes/${id}`);
      setQuiz(result.data);
    };
    fetchData();
  }, [id]);

  const navigate = useNavigate();

  const handleChangeQuizField = (
    event: React.ChangeEvent<HTMLInputElement>,
    label: "title" | "description" | "url" | "score"
  ) => {
    if (!quiz) return;

    const newQuiz: Quiz = {
      ...quiz,
      [label]:
        label === "score" ? Number(event.target.value) : event.target.value,
    };

    setQuiz(newQuiz);
  };

  const handleQuestionChange = (
    qIndex: number | string,
    event: React.ChangeEvent<HTMLInputElement>,
    label: "feedback_false" | "feedback_true" | "text"
  ) => {
    if (!quiz) return;

    const newQuiz: Quiz = {
      ...quiz,
    };

    const values = [...newQuiz?.questions_answers];
    const question = values.find((question) => question.id === qIndex);
    if (question) {
      question[label] = event.target.value as string;
      setQuiz(newQuiz);
    }
  };

  const handleAddQuestion = () => {
    if (!quiz) return;
    const newQuiz: Quiz = {
      ...quiz,
    };

    const newQuestion: QuestionAnswer = {
      answer_id: null,
      answers: [
        {
          id: uuidv4(),
          is_true: true,
          text: "",
        },
      ],
      feedback_false: "",
      feedback_true: "",
      id: uuidv4(),
      text: "",
    };

    newQuiz.questions_answers.push(newQuestion);
    setQuiz(newQuiz);
  };

  const handleAddAnswer = (qIndex: number | string) => {
    if (!quiz) return;
    const newQuiz: Quiz = {
      ...quiz,
    };

    const isFirstAnswer =
      newQuiz?.questions_answers.find((question) => question.id === qIndex)
        ?.answers.length === 0;
    const newAnswer: Answer = {
      id: uuidv4(),
      is_true: isFirstAnswer,
      text: "",
    };

    const values = [...newQuiz?.questions_answers];
    const question = values.find((question) => question.id === qIndex);
    if (question) {
      question.answers.push(newAnswer);
      setQuiz(newQuiz);
    }
  };

  const handleChangeAnswerText = (
    qIndex: number | string,
    ansIndex: number | string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!quiz) return;
    const newQuiz: Quiz = {
      ...quiz,
    };

    const question = newQuiz?.questions_answers.find(
      (question) => question.id === qIndex
    );
    if (question) {
      const answer = question.answers.find((answer) => answer.id === ansIndex);
      if (answer) {
        answer.text = event.target.value as string;
        setQuiz(newQuiz);
      }
    }
  };

  const handleSelectAnswer = (
    qIndex: number | string,
    ansIndex: number | string
  ) => {
    if (!quiz) return;
    const newQuiz: Quiz = {
      ...quiz,
    };

    const values = [...newQuiz?.questions_answers];
    const question = values.find((question) => question.id === qIndex);
    if (question) {
      const answer = question.answers.find((answer) => answer.id === ansIndex);
      if (answer) {
        question.answers.forEach((answer) => (answer.is_true = false));
        answer.is_true = true;
        setQuiz(newQuiz);
      }
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onAddQuiz(quiz);
    navigate("/");
  };

  return (
    <div className="container">
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="title">Title</Form.Label>
          <Form.Control
            type="text"
            id="title"
            onChange={(e) => handleChangeQuizField(e as any, "title")}
            placeholder="Title"
            required
            value={quiz?.title || ""}
          />
          <Form.Label htmlFor="description">Description</Form.Label>
          <Form.Control
            type="text"
            id="description"
            onChange={(e) => handleChangeQuizField(e as any, "description")}
            placeholder="Description"
            required
            value={quiz?.description || ""}
          />

          <Form.Label htmlFor="url">URL</Form.Label>
          <Form.Control
            type="text"
            id="url"
            onChange={(e) => handleChangeQuizField(e as any, "url")}
            placeholder="URL"
            required
            value={quiz?.url || ""}
          />

          <Form.Label htmlFor="score">Score</Form.Label>
          <Form.Control
            type="number"
            id="score"
            onChange={(e) => handleChangeQuizField(e as any, "score")}
            placeholder="Score"
            required
            value={quiz?.score || 0}
          />
          {quiz?.questions_answers?.map((question, qIndex) => (
            <div key={qIndex}>
              <Form.Label htmlFor="question">Question Text</Form.Label>
              <Form.Control
                type="text"
                id="question"
                onChange={(e) =>
                  handleQuestionChange(question.id, e as any, "text")
                }
                placeholder="Question"
                required
                value={question.text}
              />

              <Form.Label htmlFor="feedback-false">Feedback False</Form.Label>
              <Form.Control
                type="text"
                id="feedback-false"
                onChange={(e) =>
                  handleQuestionChange(question.id, e as any, "feedback_false")
                }
                placeholder="Feedback False"
                required
                value={question.feedback_false}
              />

              <Form.Label htmlFor="feedback-true">Feedback True</Form.Label>
              <Form.Control
                type="text"
                id="feedback-true"
                onChange={(e) =>
                  handleQuestionChange(question.id, e as any, "feedback_true")
                }
                placeholder="Feedback True"
                required
                value={question.feedback_true}
              />
              {question?.answers.map((answer, aIndex) => (
                <div key={aIndex}>
                  <Form.Label htmlFor="answer">Answer Text</Form.Label>
                  <Form.Control
                    type="text"
                    id="answer"
                    onChange={(e) =>
                      handleChangeAnswerText(question.id, answer.id, e as any)
                    }
                    placeholder="Answer"
                    required
                    value={answer.text}
                  />
                  <Form.Label htmlFor="is-true">Is True</Form.Label>
                  <Form.Check
                    type="radio"
                    id="is-true"
                    onChange={(e) => handleSelectAnswer(question.id, answer.id)}
                    placeholder="Is True"
                    required
                    checked={answer.is_true}
                  />
                </div>
              ))}

              <Button
                variant="secondary"
                onClick={() => handleAddAnswer(question.id)}
              >
                Add Answer
              </Button>
            </div>
          ))}

          <Button
            className="add-button"
            variant="secondary"
            onClick={handleAddQuestion}
          >
            Add Question
          </Button>
          <div className="footer-button">
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </div>
        </Form.Group>
      </Form>
    </div>
  );
};

export default AddQuiz;
