import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Card from "../../components/card/Card";
import "./Course.css"; // Create this CSS file to style the detail page
import { getCourseByName } from "../../services/CourseService";
import Button from "@mui/material/Button";
import AlarmIcon from "@mui/icons-material/Alarm";

function Course() {
  const { id } = useParams(); // Extract the id from the URL
  const navigate = useNavigate();
  //const location = useLocation();
  //const { title, description } = location.state || {};

  const [modules, setModules] = useState([]);
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        let data = {};
        data = await getCourseByName(id);
        setModules(data.modules);
        setTitle(data.name)
        setDescription(data.description)
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch modules");
        setLoading(false);
      }
    };

    fetchModules();
  }, [id]);

  const takeTheTest = () => {
    navigate("/test");
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="course-detail">
      <h1>{title}</h1>
      <p>{description}</p>
      <div className="card-grid">
        {modules.map((module) => (
          <Card
            key={module.name}
            id={module.name}
            title={module.name}
            description={module.description}
            route={"module"}
          />
        ))}
      </div>
      <Button
        variant="contained"
        startIcon={<AlarmIcon />}
        className="bottom-button"
        onClick={takeTheTest}
      >
        Take the test
      </Button>
    </div>
  );
}

export default Course;
