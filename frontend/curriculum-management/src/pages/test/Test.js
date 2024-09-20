import { useMemo, useEffect, useState } from "react";
import "./Test.css";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import {
  completeTestFromCourse,
  completeTestFromModule,
  getTestByCourseName,
  getTestByModuleName,
} from "../../services/TestService";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CheckIcon from "@mui/icons-material/Check";
import Question from "../../components/question/Question";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";
import { useAccessibility } from "../../context/AccessibilityContext";

function Test() {
  const { id } = useParams(); // Extract the id from the URL
  const location = useLocation();
  const navigate = useNavigate();
  const { type, courseName, advice } = useMemo(
    () => location.state || {},
    [location.state]
  );

  const [test, setTest] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(1);
  const [answers, setAnswers] = useState({});
  const [shuffledToOriginalMap, setShuffledToOriginalMap] = useState([]);

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
        if (type === "course") {
          data = await getTestByCourseName(id);
        } else {
          data = await getTestByModuleName(id);
        }

        const savedTestName = localStorage.getItem("testName");
        const savedShuffledQuestions = localStorage.getItem("shuffledQuestions");
        const savedShuffledToOriginalMap = localStorage.getItem("shuffledToOriginalMap");
          
        if (savedTestName !== data.name || !savedShuffledQuestions) {
          // Shuffle questions only if the test is being taken for the first time or retaken
          const originalQuestions = data.questions;
          const shuffledQuestions = shuffleArray(data.questions);

          const shuffledToOriginalMap = shuffledQuestions.map(
            (_, index) =>
            originalQuestions.findIndex((q) => q === shuffledQuestions[index])
          );

          setTest({
            ...data,
            questions: shuffledQuestions,
          });

          // Save shuffled questions and mapping
          localStorage.setItem(
            "shuffledQuestions",
            JSON.stringify(shuffledQuestions)
          );
          localStorage.setItem(
            "shuffledToOriginalMap",
            JSON.stringify(shuffledToOriginalMap)
          );
          localStorage.setItem("testName", data.name);

          localStorage.removeItem("currentQuestionIndex");
          localStorage.removeItem("answers");
          setCurrentQuestionIndex(1);
          setAnswers({});
        } else {
          // Use saved shuffled questions and mapping
          setTest({
            ...data,
            questions: JSON.parse(savedShuffledQuestions),
          });

          // Restore the mapping
          setShuffledToOriginalMap(JSON.parse(savedShuffledToOriginalMap));
        }

        setLoading(false);
      } catch (err) {
        setError(`Error while fetching the test information: ${err.message}`);
        setLoading(false);
      }
    };

    fetchTest();
  }, [id, type, courseName, test.name]);

  useEffect(() => {
    if (currentQuestionIndex >= 1 && !isEmpty(test)) {
      localStorage.setItem("currentQuestionIndex", currentQuestionIndex);
    }
  }, [currentQuestionIndex, test]);

  const isEmpty = (obj) =>
    Object.keys(obj).length === 0 && obj.constructor === Object;

  useEffect(() => {
    if (!isEmpty(answers)) {
      localStorage.setItem("answers", JSON.stringify(answers));
    }
  }, [answers]);

  const shuffleArray = (array) => {
    let shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const reorderAnswers = (shuffledAnswers, map) => {
    const reordered = {};
    map.forEach((originalIndex, shuffledIndex) => {
      if (shuffledAnswers[shuffledIndex] !== undefined) {
        reordered[originalIndex] = shuffledAnswers[shuffledIndex];
      }
    });
    return reordered;
  };

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
      [currentQuestionIndex - 1]: newAnswer,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex - 1 < test.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 1) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleFinish = () => {
    setOpenDialog(true);
  };

  const { refreshAccessibility } = useAccessibility();

  const handleConfirmFinish = async () => {
    setOpenDialog(false);
    localStorage.removeItem("currentQuestionIndex");
    localStorage.removeItem("answers");
    localStorage.removeItem("shuffledQuestions");
    localStorage.removeItem("shuffledToOriginalMap");
    localStorage.removeItem("testName");

    const correctAnswers = getCorrectAnswers();
    // Reorder answers before navigation
    const reorderedAnswers = reorderAnswers(answers, shuffledToOriginalMap);

    let data = {};
    if (type === "course") {
      data = await completeTestFromCourse(id, reorderedAnswers);
    } else {
      data = await completeTestFromModule(id, reorderedAnswers);
    }

    // Trigger refresh for the sidebar
    refreshAccessibility();

    navigate(`/${id}/test/test-result`, {
      state: {
        result: data,
        pass_criteria: test.pass_criteria,
        type: type,
        courseName: courseName,
        correctAnswers: correctAnswers,
        advice: advice,
      },
    });
  };

  const getCorrectAnswers = () => {
    const result = [];

    for (const question of test.questions) {
      if (question.question_type.type === "NumberQuestion") {
        result.push({
          [question.question_text]: question.question_type.answer,
        });
      } else if (question.question_type.type === "TrueFalseQuestion") {
        result.push({
          [question.question_text]: question.question_type.answer,
        });
      } else if (question.question_type.type === "MultipleChoiceQuestion") {
        const corrAns = [];
        for (const ans of question.question_type.answers) {
          if (ans.is_correct) {
            corrAns.push(ans.text);
          }
        }
        result.push({
          [question.question_text]: corrAns,
        });
      } else if (question.question_type.type === "OpenEndedQuestion") {
        result.push({
          [question.question_text]: question.question_type.answer.text,
        });
      } else {
        for (const ans1 of question.question_type.answers) {
          if (ans1.is_correct) {
            result.push({
              [question.question_text]: ans1.text,
            });
            break;
          }
        }
      }
    }

    return result
  }

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
              backgroundColor: "#345279",
              color: "white",
              border: "solid 1px rgb(81, 81, 81)",
              borderRadius: "4px",
              padding: "20px",
            }}
          >
            <CardContent>
              <Question
                question={test.questions[currentQuestionIndex - 1]}
                answer={answers[currentQuestionIndex - 1] || ""}
                onAnswerChange={handleAnswerChange}
                currentQuestionIndex={currentQuestionIndex - 1}
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
              visibility: currentQuestionIndex === 1 ? "hidden" : "visible",
            }}
          >
            Back
          </Button>
          <p>
            {currentQuestionIndex} / {test.questions.length}
          </p>
          {currentQuestionIndex - 1 < test.questions.length - 1 ? (
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
            backgroundColor: "#345279", // Gray background color
            color: "white", // White text color
          },
        }}
      >
        <DialogTitle id="alert-dialog-title"></DialogTitle>
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
