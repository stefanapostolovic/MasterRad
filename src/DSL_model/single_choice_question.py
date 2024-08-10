from DSL_model import answer

class SingleChoiceQuestion:
  def __init__(self, answers):
    self.answers = self.init_answers(answers)
    
  def init_answers(self, answers):
    return_value = []
    
    for a in answers:
      return_value.append(answer.Answer(a.text, a.is_correct, a.points))
    
    return return_value