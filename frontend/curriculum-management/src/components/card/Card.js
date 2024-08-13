import React from "react";
import "./Card.css"
import { useNavigate } from "react-router-dom";
import BookIcon from "@mui/icons-material/Book";

function Card({ id, title, description }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/course/${id}`, { state: { title, description } });
  };

  return (
    <div className="card" onClick={handleClick}>
      <div className="title">
        <div className="icon">
          <BookIcon />
        </div>{" "}
        {title}
      </div>
      <div className="description">{description}</div>
    </div>
  );
}

export default Card;
