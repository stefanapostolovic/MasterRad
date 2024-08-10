class PassCriteria:
  def __init__(self, percentage_required=None, number_of_correct_answers_required=None, points_required=None):
    self.percentage_required = percentage_required
    self.number_of_correct_answers_required = number_of_correct_answers_required
    self.points_required = points_required