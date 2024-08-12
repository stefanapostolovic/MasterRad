class Answer:
  #TODO potentialy delete points
  def __init__(self, text, is_correct=True):
    self.text = text
    self.is_correct = is_correct
    
  def to_dict(self):
    return {
        "text": self.text,
        "is_correct": self.is_correct
    }