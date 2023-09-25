import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { Button, ListGroup } from "react-bootstrap";

import { Quiz } from "./types";

const QuizDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [quiz, setQuiz] = useState<Quiz | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get(`http://localhost:3001/quizzes/${id}`);
      setQuiz(result.data);
    };
    fetchData();
  }, [id]);

  return (
    <div>
      {quiz && (
        <div className="container">
          <div className="question-container">
            <div>
              <div>{quiz.title}</div>
              <div>{quiz.description}</div>
              {quiz?.score && <div>Score : {quiz.score}</div>}
              <div>
                <a href={quiz.url}>YouTube Video</a>
              </div>
            </div>
            <ListGroup className="questions" variant="flush">
              {quiz.questions_answers.map((qa) => (
                <ListGroup.Item className="group" key={qa.id}>
                  <h3>{qa.text}</h3>
                  <ul>
                    {qa.answers.map((answer) => (
                      <li key={answer.id}>
                        {answer.text}
                        {answer.is_true ? (
                          <span className="true">True </span>
                        ) : (
                          <span className="false"> False</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </ListGroup.Item>
              ))}
            </ListGroup>
            <div className="footer-button">
              <Link to={`/edit/${quiz.id}`}>
                <Button variant="primary" type="submit">
                  Edit
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizDetails;
