class Answer:
  #TODO potentialy delete points
  def __init__(self, text, is_correct=True, points=0):
    self.text = text
    self.is_correct = is_correct
    self.points = points