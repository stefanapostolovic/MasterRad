import "./TestResult.css"
import { useLocation } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

const TestResult = () => {
  const location = useLocation();
  const { result, pass_criteria } = location.state || {};
  const { test_result, points, num_of_correct_answ, percentage } = result;

  if (!result) {
    return <div>No result data available.</div>;
  }

  return (
    <div className="result-container">
      <Card
        sx={{
          backgroundColor: "#3d3d3d",
          color: "white",
          border: "solid 1px rgb(81, 81, 81)",
          borderRadius: "4px",
          padding: "20px",
        }}
        className="result-card"
      >
        <CardContent>
          <Typography
            sx={{
              marginBottom: "4%",
            }}
            variant="h4"
            component="div"
            className="result-text"
          >
            {test_result === "passed"
              ? "Congratulations, you passed the test!"
              : "You failed the test!"}
          </Typography>
          <Typography
            sx={{
              marginBottom: "4%",
            }}
            variant="h7"
            component="div"
            className="result-details"
          >
            {pass_criteria?.percentage_required > 0 && (
              <div>
                Criteria for passing the test - Percentage Required:{" "}
                {pass_criteria?.percentage_required}%
              </div>
            )}
            {pass_criteria?.number_of_correct_answers_required > 0 && (
              <div>
                Criteria for passing the test - Number of Correct Answers
                Required: {pass_criteria?.number_of_correct_answers_required}
              </div>
            )}
            {pass_criteria?.points_required > 0 && (
              <div>
                Criteria for passing the test - Points Required:{" "}
                {pass_criteria?.points_required}
              </div>
            )}
          </Typography>
          <Typography variant="body1" className="result-details">
            Points acquired: <b>{points.toFixed(2)}</b>
          </Typography>
          <Typography variant="body1" className="result-details">
            Number of correct answers: <b>{num_of_correct_answ}</b>
          </Typography>
          <Typography variant="body1" className="result-details">
            Percentage: <b>{percentage}%</b>
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestResult;