from DSL_model import answer

#TODO potential bug that marks the question as incorrect
class OpenEndedQuestion:
  def __init__(self, answer):
    self.answer = self.init_answer(answer)
    
  def init_answer(self, a):
    return answer.Answer(a.text, a.is_correct, a.points)