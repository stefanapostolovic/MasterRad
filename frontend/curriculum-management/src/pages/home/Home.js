import React, { useEffect, useState } from "react";
import { getAllCourses } from "../../services/CourseService";
import Card from "../../components/card/Card";
import "./Home.css"

function Home() {
  const [curriculumName, setCurriculumName] = useState('');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null)

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
          <Card
            key={course.name}
            id={course.name}
            title={course.name}
            description={course.description}
            route={"course"}
          />
        ))}
      </div>
    </div>
  );
}

export default Home;