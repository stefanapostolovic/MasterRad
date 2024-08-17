import React from "react";
import { useEffect, useState } from "react"
import {
  RadioGroup,
  Radio,
  FormControlLabel,
  FormGroup ,
  Checkbox,
  TextField,
} from "@mui/material";

function Question({ question, onAnswerChange, answer, currentQuestionIndex }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (question !== undefined) {
      setLoading(false)
    }
  }, [question]);

  const renderQuestionInput = () => {
    switch (question.question_type.type) {
      case "OpenEndedQuestion":
        return (
          <TextField
            sx={{
              marginTop: "3%",
              input: { color: "white" }, // Text color
              "& .MuiInputBase-root": {
                color: "white", // Text color
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "white", // Border color
                },
                "&:hover fieldset": {
                  borderColor: "white",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "white",
                },
                "&::placeholder": {
                  color: "white", // Placeholder text color
                },
              },
              "& .MuiInputBase-input::placeholder": {
                color: "white", // Additional placeholder text color
                opacity: 0.5, // Ensure full opacity for the placeholder
              },
            }}
            fullWidth
            multiline
            value={answer}
            onChange={(e) => onAnswerChange(e.target.value)}
            variant="outlined"
            placeholder="Type your answer here..."
          />
        );

      case "SingleChoiceQuestion":
        return (
          <RadioGroup
            sx={{
              marginTop: "3%",
              color: "white", // Text color
              "& .MuiRadio-root": {
                color: "white", // Radio button color
              },
            }}
            value={answer}
            onChange={(e) => onAnswerChange(e.target.value)}
          >
            {question.question_type.answers.map((a, index) => (
              <FormControlLabel
                key={index}
                value={a.text}
                control={<Radio />}
                label={a.text}
              />
            ))}
          </RadioGroup>
        );

      case "MultipleChoiceQuestion":
        return (
          <FormGroup>
            {question.question_type.answers.map((a, index) => (
              <FormControlLabel
                sx={{
                  marginTop: "2%",
                  color: "white", // Text color
                  "& .MuiCheckbox-root": {
                    color: "white", // Checkbox color
                  },
                }}
                key={index}
                control={
                  <Checkbox
                    checked={answer.includes(a.text)}
                    onChange={(e) => {
                      const newAnswer = [...answer];
                      if (e.target.checked) {
                        newAnswer.push(a.text);
                      } else {
                        const idx = newAnswer.indexOf(a.text);
                        if (idx > -1) {
                          newAnswer.splice(idx, 1);
                        }
                      }
                      onAnswerChange(newAnswer);
                    }}
                  />
                }
                label={a.text}
              />
            ))}
          </FormGroup>
        );

      case "TrueFalseQuestion":
        return (
          <RadioGroup
            sx={{
              marginTop: "3%",
              color: "white", // Text color
              "& .MuiRadio-root": {
                color: "white", // Radio button color
              },
            }}
            value={answer}
            onChange={(e) => onAnswerChange(e.target.value)}
          >
            <FormControlLabel value="true" control={<Radio />} label="True" />
            <FormControlLabel value="false" control={<Radio />} label="False" />
          </RadioGroup>
        );

      case "NumberQuestion":
        return (
          <TextField
            sx={{
              marginTop: "3%",
              input: { color: "white" }, // Text color
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "white", // Border color
                },
                "&:hover fieldset": {
                  borderColor: "white",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "white",
                },
              },
            }}
            type="number"
            value={answer}
            onChange={(e) => onAnswerChange(e.target.value)}
            variant="outlined"
            placeholder="Enter a number"
          />
        );

      default:
        return null;
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="question">
      <div className="header">
        Question {currentQuestionIndex + 1}: <b>{question.question_text}</b>
      </div>
      <div>{renderQuestionInput()}</div>
    </div>
  );
}

export default Question;