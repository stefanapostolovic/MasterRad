class PassCriteria:
  def __init__(self, percentage_required=None, number_of_correct_answers_required=None, points_required=None):
    self.percentage_required = percentage_required
    self.number_of_correct_answers_required = number_of_correct_answers_required
    self.points_required = points_required
    
  def to_dict(self):
    return {
        "percentage_required": self.percentage_required,
        "number_of_correct_answers_required": self.number_of_correct_answers_required,
        "points_required": self.points_required
    }