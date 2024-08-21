from DSL_model import question
from DSL_model import pass_criteria

class Test:
  def __init__(self, name, questions, pass_criteria):
    self.name = name
    self.questions = self.init_questions(questions)
    self.pass_criteria = self.init_pass_criteria(pass_criteria)
    self.number_of_attempts = 0
    self.score_percentages = []
    
  def init_questions(self, questions):
    return_value = []
    for q in questions:
      return_value.append(question.Question(q.question_text, q.question_type, q.points, q.negative_points))
    return return_value
    
  def init_pass_criteria(self, pc):
    return pass_criteria.PassCriteria(pc.percentage_required, pc.number_of_correct_answers_required, pc.points_required)
  
  def grade_test(self, answers):
    if len(answers) == 0:
      return {"test_result": "failed", "points": 0, "num_of_correct_answ": 0, "percentage": 0}
    
    points = 0
    num_of_correct_answ = 0
    
    for index, question in enumerate(self.questions):
      if str(index) not in answers:
            continue
          
      if (question.question_type.__class__.__name__ == "MultipleChoiceQuestion"):
        num_of_correct_and_false_answers_for_mult_choice_quest = self.get_num_of_correct_and_false_answers_for_mult_choice_quest(question, answers[str(index)])
        
        if num_of_correct_and_false_answers_for_mult_choice_quest["correct"] == self.get_num_of_correct_answ_for_mult_choice_qeust(question) and num_of_correct_and_false_answers_for_mult_choice_quest["false"] == 0:
          num_of_correct_answ += 1
          points += question.points
        
        elif question.question_type.accept_partial_answer:
          correct_answer_points = question.points / self.get_num_of_correct_answ_for_mult_choice_qeust(question)
          points += correct_answer_points * num_of_correct_and_false_answers_for_mult_choice_quest["correct"]
          points -= question.negative_points * num_of_correct_and_false_answers_for_mult_choice_quest["false"]
          
      elif self.is_answer_correct(question, answers[str(index)]):
        num_of_correct_answ += 1
        points += question.points
      else:
        points -= question.negative_points

    percentage = num_of_correct_answ / len(self.questions) * 100
    
    test_result = "passed" if self.is_test_passed(points, num_of_correct_answ, percentage) else "failed"
    
    return {"test_result": test_result, "points": points, "num_of_correct_answ": num_of_correct_answ, "percentage": percentage}
  
  def get_num_of_correct_and_false_answers_for_mult_choice_quest(self, question, answers):
    correct_answer_counter = 0
    false_answer_counter = 0
    
    for ans1 in answers:
      for ans2 in question.question_type.answers:
        if ans1 == ans2.text:
          if ans2.is_correct:
            correct_answer_counter += 1
          else:
            false_answer_counter += 1
    
    return { "correct": correct_answer_counter, "false": false_answer_counter }
  
  def get_num_of_correct_answ_for_mult_choice_qeust(self, question):
    return_value = 0
    for ans in question.question_type.answers:
      if ans.is_correct:
        return_value += 1
        
    return return_value
  
  def is_answer_correct(self, question, answer):
    if question.question_type.__class__.__name__ == "SingleChoiceQuestion":
      for ans in question.question_type.answers:
        if ans.text == answer and ans.is_correct:
          return True
    elif question.question_type.__class__.__name__ == "OpenEndedQuestion":
      if question.question_type.answer.text == answer:
        return True
    elif question.question_type.__class__.__name__ == "TrueFalseQuestion":
      if question.question_type.answer == answer:
        return True
    else:
      try:
        answer = float(answer)
      except (ValueError):
        return False
      
      if question.question_type.answer == answer:
        return True
      
    return False
  
  def is_test_passed(self, points, num_of_correct_answ, percentage):
    if self.pass_criteria.percentage_required > 0:
      return percentage >= self.pass_criteria.percentage_required
    elif self.pass_criteria.number_of_correct_answers_required > 0:
      return num_of_correct_answ >= self.pass_criteria.number_of_correct_answers_required
    else:
      return points >= self.pass_criteria.points_required
  
  def to_dict(self):
    return {
        "name": self.name,
        "questions": [q.to_dict() for q in self.questions],
        "pass_criteria": self.pass_criteria.to_dict()
    } 