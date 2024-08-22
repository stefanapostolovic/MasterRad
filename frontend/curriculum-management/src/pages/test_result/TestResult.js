import "./TestResult.css"
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import ReplayIcon from "@mui/icons-material/Replay";
import NextPlanIcon from "@mui/icons-material/NextPlan";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import KeyIcon from "@mui/icons-material/Key";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Divider,
} from "@mui/material";
import { getUserStatisticsForCourse } from "../../services/CourseService";

const TestResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { result, pass_criteria, type, courseName, correctAnswers, advice } =
    location.state || {};
  const { test_result, points, num_of_correct_answ, percentage } = result;

  const [openCheckAnswersDialog, setOpenCheckAnswersDialog] = useState(false);
  
  const [userStatistics, setUserStatistics] = useState({})
  const [error, setError] = useState(null);

  useEffect(() => {
    if (type && test_result && type === "course" && test_result === "passed") {
      const fetchStatistics = async () => {
        try {
          const data = await getUserStatisticsForCourse(courseName);
          setUserStatistics(data);
        } catch (err) {
          setError(`Error while fetching the user statistics: ${err.message}`);
        }
      };

      fetchStatistics();
    }
  }, [courseName, test_result, type]);

  const handleClickOpen = () => {
    setOpenCheckAnswersDialog(true);
  };

  const handleClose = () => {
    setOpenCheckAnswersDialog(false);
  };

  const retakeTest = () => {
    const pathSegments = location.pathname.split("/");
    const nodeName = pathSegments[1]
    navigate(`/${nodeName}/test`, { state: { type, courseName, advice } });
  }

  const goBack = () => {
    const pathSegments = location.pathname.split("/");
    const nodeName = pathSegments[1];

    if (type === "course") {
      navigate('/')
    }
    else {
      const description = ""
      navigate(`/course/${courseName}`, { state: { nodeName, description } });
    }
  }

  if (!result) {
    return <div>No result data available.</div>;
  }

  if (error) return <div>{error}</div>;

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
        className={
          test_result === "passed" ? "result-card-passed" : "result-card-failed"
        }
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
      {type === "course" && test_result === "passed" && (
        <div>
          <div className="congradulations-message">You Passed The Course!</div>
          <div className="statistical-data-row">
            <Card
              sx={{
                backgroundColor: "#2b2b2b",
                color: "white",
                border: "solid 1px rgb(81, 81, 81)",
                borderRadius: "4px",
                padding: "10px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div>
                <Typography variant="body1" sx={{ marginRight: "3%" }}>
                  <b>Number of Test Attempts:</b>
                </Typography>
                {userStatistics.test_attempts !== undefined ? (
                  <ul>
                    {Object.entries(userStatistics.test_attempts).map(
                      ([testName, attempts]) => (
                        <li key={testName}>{`${testName} - ${attempts}`}</li>
                      )
                    )}
                  </ul>
                ) : (
                  "N/A"
                )}
              </div>
              <Typography variant="body1" sx={{ marginRight: "3%" }}>
                <b>Average Test Performance:</b>{" "}
                {userStatistics.average_test_performance !== undefined
                  ? userStatistics.average_test_performance.toFixed(2)
                  : "N/A"}
                %
              </Typography>
              <Typography variant="body1" sx={{ marginRight: "3%" }}>
                <b>Best Module Performance:</b> {userStatistics.best_module} -{" "}
                {userStatistics.best_module_performance}%
              </Typography>
              <Typography variant="body1">
                <b>Worst Module Performance:</b> {userStatistics.worst_module} -{" "}
                {userStatistics.worst_module_performance}%
              </Typography>
            </Card>
          </div>
        </div>
      )}
      {test_result === "failed" && (
        <div>
          <div className="tips">
            <TipsAndUpdatesIcon /> Tips: {advice}
          </div>
          <div className="bottom-buttons-failed">
            <Button
              variant="contained"
              startIcon={<KeyIcon />}
              sx={{ color: "white", height: "40px", marginRight: "7%" }}
              onClick={handleClickOpen}
            >
              Check Answers
            </Button>

            <Dialog
              open={openCheckAnswersDialog}
              onClose={handleClose}
              PaperProps={{
                sx: {
                  backgroundColor: "#333",
                  color: "white",
                },
              }}
            >
              <DialogTitle>Correct Answers</DialogTitle>
              <DialogContent>
                {correctAnswers.map((answerObj, index) => {
                  const question = Object.keys(answerObj)[0];
                  const answer = answerObj[question];

                  return (
                    <div key={index} style={{ marginBottom: "15px" }}>
                      <Divider sx={{ borderColor: "white", marginY: 2 }} />
                      <Typography variant="body1">
                        <b>Question:</b> {question}
                      </Typography>
                      <div>
                        <b>Answer:</b>{" "}
                        {Array.isArray(answer) ? (
                          <ul>
                            {answer.map((ans, i) => (
                              <li key={i}>{ans}</li>
                            ))}
                          </ul>
                        ) : (
                          <Typography variant="body1" component="span">
                            {answer.toString()}
                          </Typography>
                        )}
                      </div>
                    </div>
                  );
                })}
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} sx={{ color: "white" }}>
                  Close
                </Button>
              </DialogActions>
            </Dialog>

            <Button
              variant="contained"
              color="warning"
              startIcon={<ReplayIcon />}
              sx={{ color: "white", height: "40px" }}
              onClick={retakeTest}
            >
              Try Again
            </Button>
          </div>
        </div>
      )}
      {test_result === "passed" && (
        <div className="bottom-buttons-passed">
          <Button
            variant="contained"
            startIcon={<KeyIcon />}
            sx={{ color: "white", height: "40px", marginRight: "7%" }}
            onClick={handleClickOpen}
          >
            Check Answers
          </Button>

          <Dialog
            open={openCheckAnswersDialog}
            onClose={handleClose}
            PaperProps={{
              sx: {
                backgroundColor: "#333",
                color: "white",
              },
            }}
          >
            <DialogTitle>Correct Answers</DialogTitle>
            <DialogContent>
              {correctAnswers.map((answerObj, index) => {
                const question = Object.keys(answerObj)[0];
                const answer = answerObj[question];

                return (
                  <div key={index} style={{ marginBottom: "15px" }}>
                    <Divider sx={{ borderColor: "white", marginY: 2 }} />
                    <Typography variant="body1">
                      <b>Question:</b> {question}
                    </Typography>
                    <div>
                      <b>Answer:</b>{" "}
                      {Array.isArray(answer) ? (
                        <ul>
                          {answer.map((ans, i) => (
                            <li key={i}>{ans}</li>
                          ))}
                        </ul>
                      ) : (
                        <Typography variant="body1" component="span">
                          {answer.toString()}
                        </Typography>
                      )}
                    </div>
                  </div>
                );
              })}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} sx={{ color: "white" }}>
                Close
              </Button>
            </DialogActions>
          </Dialog>

          <Button
            variant="contained"
            color="success"
            startIcon={<NextPlanIcon />}
            sx={{ color: "white", height: "40px" }}
            onClick={goBack}
          >
            Go to next {type}
          </Button>
        </div>
      )}
    </div>
  );
};

export default TestResult;