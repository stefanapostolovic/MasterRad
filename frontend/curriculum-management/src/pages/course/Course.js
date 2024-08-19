import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Card from "../../components/card/Card";
import "./Course.css"; // Create this CSS file to style the detail page
import { checkIfCanTakeTest, getCourseByName } from "../../services/CourseService";
import Button from "@mui/material/Button";
import AlarmIcon from "@mui/icons-material/Alarm";

function Course() {
  const { id } = useParams(); // Extract the id from the URL
  const navigate = useNavigate();

  const [modules, setModules] = useState([]);
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [unmetPrerequisitesMap, setUnmetPrerequisitesMap] = useState({});

  const [canTakeTest, setCanTakeTest] = useState(false)

  const handlePrerequisitesCheck = (id, unmetPrerequisites) => {
    setUnmetPrerequisitesMap((prev) => ({
      ...prev,
      [id]: unmetPrerequisites,
    }));
  };

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

  useEffect(() => {
    if (modules.length > 0) {
      const checkCanTakeTest = async () => {
        try {
          const result = await checkIfCanTakeTest(title)
          if (result["can_take_test"] == true) {
            setCanTakeTest(true)
          }
        } catch (err) {
          setError("Faile to check whether the test can be taken")
        }
      }

      checkCanTakeTest()
    }
  }, [modules, title, description])

  const type = "course";
  const takeTheTest = () => {
    navigate(`/${id}/test`, { state: { type } });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="course-detail">
      <h1>{title}</h1>
      <p>{description}</p>
      <div className="card-grid">
        {modules.map((module) => (
          <div key={module.name} className="card-content">
            <Card
              key={module.name}
              id={module.name}
              title={module.name}
              description={module.description}
              route={"module"}
              prerequisites={module.prerequisites}
              onPrerequisitesCheck={handlePrerequisitesCheck}
            />
            {unmetPrerequisitesMap[module.name] &&
              unmetPrerequisitesMap[module.name].length > 0 && (
                <div className="prerequisites-not-met">
                  <p className="header">
                    In order to access this module, you first need to complete
                    the following:
                  </p>
                  <ul>
                    {unmetPrerequisitesMap[module.name].map(
                      (prerequisite, index) => (
                        <li key={index}>
                          {prerequisite.module
                            ? `Module: ${prerequisite.module}`
                            : `Course: ${prerequisite.course}`}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}
          </div>
        ))}
      </div>
      <Button
        variant="contained"
        startIcon={<AlarmIcon />}
        className="bottom-button"
        disabled={!canTakeTest}
        onClick={takeTheTest}
      >
        Take the test
      </Button>
      {!canTakeTest && (
        <div className="warning-message">
          <p>The test can be taken only after all modules in the course have been completed</p>
        </div>
      )}
    </div>
  );
}

export default Course;
