import React, { useEffect, useState } from "react";
import { getAllCourses } from "../../services/CourseService";
import Card from "../../components/card/Card";
import "./Home.css"

function Home() {
  const [curriculumName, setCurriculumName] = useState('');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null)

  const [unmetPrerequisitesMap, setUnmetPrerequisitesMap] = useState({});

  const handlePrerequisitesCheck = (id, unmetPrerequisites) => {
    setUnmetPrerequisitesMap((prev) => ({
      ...prev,
      [id]: unmetPrerequisites,
    }));
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getAllCourses();
        setCurriculumName(data.name)
        setCourses(data.courses);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch courses');
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>

  return (
    <div className="home-page">
      <h1>{curriculumName}</h1>
      <div className="card-grid">
        {courses.map((course) => (
          <div key={course.name} className="card-content">
            <Card
              key={course.name}
              id={course.name}
              title={course.name}
              description={course.description}
              route={"course"}
              prerequisites={course.prerequisites}
              onPrerequisitesCheck={handlePrerequisitesCheck}
            />
            {unmetPrerequisitesMap[course.name] &&
              unmetPrerequisitesMap[course.name].length > 0 && (
                <div className="prerequisites-not-met">
                  <p className="header">
                    In order to access this course, you first need to complete
                    the following:
                  </p>
                  <ul>
                    {unmetPrerequisitesMap[course.name].map(
                      (prerequisite, index) => (
                        <li key={index}>
                          {prerequisite.course
                            ? `Course: ${prerequisite.course}`
                            : `Module: ${prerequisite.module}`}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;