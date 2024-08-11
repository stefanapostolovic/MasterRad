from DSL_model import answer

class MultipleChoiceQuestion:
  def __init__(self, answers, accept_partial_answer):
    self.answers = self.init_answers(answers)
    self.accept_partial_answer = accept_partial_answer
    
  def init_answers(self, answers):
    return_value = []
    
    for a in answers:
      return_value.append(answer.Answer(a.text, a.is_correct))
    
    return return_value