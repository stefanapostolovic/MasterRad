import React, { useEffect, useState } from "react";
import "./Card.css"
import { useNavigate } from "react-router-dom";
import BookIcon from "@mui/icons-material/Book";
import CheckIcon from "@mui/icons-material/Check";
import { checkIfCourseIsComplete } from "../../services/CourseService";
import { checkIfModuleIsComplete } from "../../services/ModuleService";

function Card({
  id,
  title,
  description,
  route,
  prerequisites,
  onPrerequisitesCheck,
  isCompleted,
  courseName = "",
}) {
  const navigate = useNavigate();
  const [prerequisiteMet, setPrerequisiteMet] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkIfPrerequisitesMet = async () => {
      try {
        const unmetPrerequisites = [];

        for (const prerequisite of prerequisites) {
          const prerequisiteParts = prerequisite.split(":");
          const nodeType = prerequisiteParts[0];
          const nodeName = prerequisiteParts[1];

          let data = {};
          if (nodeType === "course") {
            data = await checkIfCourseIsComplete(nodeName);
          } else {
            data = await checkIfModuleIsComplete(nodeName);
          }

          if (data.is_completed === "false") {
            unmetPrerequisites.push({ [nodeType]: nodeName });
          }
        }

        if (unmetPrerequisites.length > 0) {
          setPrerequisiteMet(false);
          onPrerequisitesCheck(id, unmetPrerequisites);
        }

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    checkIfPrerequisitesMet();
  }, [prerequisites, id, onPrerequisitesCheck]);

  const handleClick = () => {
    if (route === "module") {
      navigate(`/module/${id}`, { state: { title, description, courseName } });
    } else {
      navigate(`/course/${id}`, { state: { title, description } });
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div
      className={!prerequisiteMet ? "disabled-card" : "card"}
      //className="disabled"
      onClick={handleClick}
    >
      <div className="title">
        <div className="icon">
          <BookIcon />
        </div>{" "}
        {title}{" "}
        {isCompleted && (
          <div>
            <CheckIcon sx={{ color: "rgb(33, 230, 33)", marginLeft: "42%"}} />
          </div>
        )}
      </div>
      <div className="description">{description}</div>
    </div>
  );
}

export default Card;
