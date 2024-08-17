import { useEffect, useState } from "react";
import "./Test.css";
import { useLocation, useParams } from "react-router-dom";
import {
  getTestByCourseName,
  getTestByModuleName,
} from "../../services/TestService";
import Button from "@mui/material/Button";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CheckIcon from "@mui/icons-material/Check";
import Question from "../../components/question/Question";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

function Test() {
  const { id } = useParams(); // Extract the id from the URL
  const location = useLocation();
  const type = location.state || {};

  const [test, setTest] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const savedQuestionIndex = localStorage.getItem("currentQuestionIndex");
    const savedAnswers = localStorage.getItem("answers");

    if (savedQuestionIndex !== null) {
      setCurrentQuestionIndex(Number(savedQuestionIndex));
    }

    if (savedAnswers !== null) {
      setAnswers(JSON.parse(savedAnswers));
    }
  }, []);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        let data = {};
        if (type.type === "course") {
          data = await getTestByCourseName(id);
        } else {
          data = await getTestByModuleName(id);
        }
        setTest(data);
        setLoading(false);
      } catch (err) {
        setError(`Error while fetching the test information: ${err.message}`);
        setLoading(false);
      }
    };

    fetchTest();
  }, [id, type]);

  // Check if the test name from localStorage matches the fetched test name
  useEffect(() => {
    const savedTestName = localStorage.getItem("testName");

    if (test.name) {
      if (savedTestName === undefined || savedTestName === null) {
        localStorage.setItem("testName", test.name);
      } else if (savedTestName !== test.name) {
        localStorage.removeItem("currentQuestionIndex");
        localStorage.removeItem("answers");
        localStorage.setItem("testName", test.name);
        setCurrentQuestionIndex(0);
        setAnswers({});
      }
    }
  }, [test.name]);

  useEffect(() => {
    if (currentQuestionIndex > 0) {
      localStorage.setItem("currentQuestionIndex", currentQuestionIndex);
    }
  }, [currentQuestionIndex]);

  const isEmpty = (obj) =>
    Object.keys(obj).length === 0 && obj.constructor === Object;

  useEffect(() => {
    if (!isEmpty(answers)) {
      localStorage.setItem("answers", JSON.stringify(answers));
    }
  }, [answers]);

  const getTestPassageCriteria = () => {
    if (test.pass_criteria?.number_of_correct_answers_required > 0) {
      return `number of correct answers required: ${test.pass_criteria.number_of_correct_answers_required}`;
    } else if (test.pass_criteria?.percentage_required > 0) {
      return `percentage required: ${test.pass_criteria.percentage_required}%`;
    } else {
      return `points required: ${test.pass_criteria?.points_required}`;
    }
  };

  const handleAnswerChange = (newAnswer) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [currentQuestionIndex]: newAnswer,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < test.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleFinish = () => {
    setOpenDialog(true);
  };

  const handleConfirmFinish = () => {
    setOpenDialog(false);
    // Handle the finish logic here
    localStorage.removeItem("currentQuestionIndex");
    localStorage.removeItem("answers");
    alert("Test finished!");
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="test-detail">
      <h1>{test.name}</h1>
      <p>
        Criteria for passing: <b>{getTestPassageCriteria()}</b>
      </p>
      <div className="test-component">
        <div className="question-container">
          <Card
            sx={{
              backgroundColor: "#3d3d3d",
              color: "white",
              border: "solid 1px rgb(81, 81, 81)",
              borderRadius: "4px",
              padding: "20px"
            }}
          >
            <CardContent>
              <Question
                question={test.questions[currentQuestionIndex]}
                answer={answers[currentQuestionIndex] || ""}
                onAnswerChange={handleAnswerChange}
                currentQuestionIndex={currentQuestionIndex}
              />
            </CardContent>
          </Card>
        </div>
        <div className="navigation-buttons">
          <Button
            size="medium"
            startIcon={<ArrowBackIosIcon />}
            onClick={handleBack}
            sx={{
              color: "white",
              visibility: currentQuestionIndex === 0 ? "hidden" : "visible",
            }}
          >
            Back
          </Button>
          <p>
            {currentQuestionIndex + 1} / {test.questions.length}
          </p>
          {currentQuestionIndex < test.questions.length - 1 ? (
            <Button
              size="medium"
              endIcon={<ArrowForwardIosIcon />}
              onClick={handleNext}
              sx={{ color: "white" }}
            >
              Next
            </Button>
          ) : (
            <Button
              variant="contained"
              startIcon={<CheckIcon />}
              onClick={handleFinish}
              sx={{ color: "white", height: "40px" }}
            >
              Finish Test
            </Button>
          )}
        </div>
      </div>
      {/* Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{
          "& .MuiDialog-paper": {
            backgroundColor: "#2b2c2c", // Gray background color
            color: "white", // White text color
          },
        }}
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirm Finish Test"}
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to finish the test? Your answers will be
            submitted.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="success"
            onClick={handleConfirmFinish}
            autoFocus
          >
            Confirm
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => setOpenDialog(false)}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Test;
