import React from "react";
import { Link } from "react-router-dom";
import { ListGroup, Button } from "react-bootstrap";
import { Quiz } from "./types";

interface props {
  quizes: Quiz[];
}

const QuizList: React.FC<props> = ({ quizes }) => {
  return (
    <div className="container">
      <Link to="/add">
        <div className="header">
          <Button variant="primary" className="add-button">
            Add Quiz
          </Button>
        </div>
      </Link>
      <ListGroup>
        {quizes?.map((quiz) => (
          <ListGroup.Item key={quiz.id}>
            <div className="quiz-header">
              <Link to={`/quiz/${quiz.id}`}>
                <h4>{quiz.title}</h4>
              </Link>

              <Link to={`/edit/${quiz.id}`}>
                <Button variant="primary" className="edit-button">
                  Edit
                </Button>
              </Link>
            </div>
            <p>{quiz.description}</p>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default QuizList;
