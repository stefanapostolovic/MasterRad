from DSL_model import question
from DSL_model import pass_criteria

class Test:
  def __init__(self, name, questions, pass_criteria):
    self.name = name
    self.questions = self.init_questions(questions)
    self.pass_criteria = self.init_pass_criteria(pass_criteria)
    
  def init_questions(self, questions):
    return_value = []
    for q in questions:
      return_value.append(question.Question(q.question_text, q.question_type, q.points, q.negative_points))
    return return_value
    
  def init_pass_criteria(self, pc):
    return pass_criteria.PassCriteria(pc.percentage_required, pc.number_of_correct_answers_required, pc.points_required)
  
  def to_dict(self):
    return {
        "name": self.name,
        "questions": [q.to_dict() for q in self.questions],
        "pass_criteria": self.pass_criteria.to_dict()
    } 