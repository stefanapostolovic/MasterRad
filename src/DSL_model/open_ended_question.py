from DSL_model import answer

class OpenEndedQuestion:
  def __init__(self, answer):
    self.answer = self.init_answer(answer)
    
  def init_answer(self, a):
    return answer.Answer(a.text, True)