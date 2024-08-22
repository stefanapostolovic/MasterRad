from DSL_model import multiple_choice_question, number_question, open_ended_question, single_choice_question, true_false_question

class Question:
  def __init__(self, question_text, question_type, points, negative_points=None):
    self.question_text = question_text
    self.question_type = self.init_type(question_type)
    self.points = points
    self.negative_points = negative_points
    
  def init_type(self, type):
    if type.__class__.__name__ == "MultipleChoiceQuestion":
      return multiple_choice_question.MultipleChoiceQuestion(type.answers, type.accept_partial_answer)
    elif type.__class__.__name__ == "NumberQuestion":
      return number_question.NumberQuestion(type.answer)
    elif type.__class__.__name__ == "OpenEndedQuestion":
      return open_ended_question.OpenEndedQuestion(type.answer)
    elif type.__class__.__name__ == "SingleChoiceQuestion":
      return single_choice_question.SingleChoiceQuestion(type.answers)
    else:
      return true_false_question.TrueFalseQuestion(type.answer)
    
  def to_dict(self):
    return {
        "question_text": self.question_text,
        "question_type": self._type_to_dict(self.question_type),
        "points": self.points,
        "negative_points": self.negative_points
    }
    
  def _type_to_dict(self, question_type):
    if isinstance(question_type, multiple_choice_question.MultipleChoiceQuestion):
        return {
            "type": "MultipleChoiceQuestion",
            "answers": [a.to_dict() for a in question_type.answers],
            "accept_partial_answer": question_type.accept_partial_answer
        }
    elif isinstance(question_type, number_question.NumberQuestion):
        return {
            "type": "NumberQuestion",
            "answer": question_type.answer
        }
    elif isinstance(question_type, open_ended_question.OpenEndedQuestion):
        return {
            "type": "OpenEndedQuestion",
            "answer": question_type.answer.to_dict()
        }
    elif isinstance(question_type, single_choice_question.SingleChoiceQuestion):
        return {
            "type": "SingleChoiceQuestion",
            "answers": [a.to_dict() for a in question_type.answers],
        }
    elif isinstance(question_type, true_false_question.TrueFalseQuestion):
        return {
            "type": "TrueFalseQuestion",
            "answer": question_type.answer
        }
    else:
        raise ValueError("Unknown question type")