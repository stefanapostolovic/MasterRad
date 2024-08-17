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
  
  def grade_test(self, answers):
    points = 0
    num_of_correct_answ = 0
    
    for index, question in enumerate(self.questions):
      if (question.question_type.__class__.__name__ == "MultipleChoiceQuestion"):
        num_of_correct_answ_for_mult_choic_quest = self.is_answer_for_mult_choice_quest_correct(question, answers[str(index)])
        
        if num_of_correct_answ_for_mult_choic_quest == self.get_num_of_correct_answ_for_mult_choice_qeust(question):
          num_of_correct_answ += 1
          points += question.points
        elif question.question_type.accept_partial_answer and num_of_correct_answ_for_mult_choic_quest > 0:
          points += question.points / num_of_correct_answ_for_mult_choic_quest
          points -= question.negative_points
        else:
          points -= question.negative_points
          
      elif self.is_answer_correct(question, answers[str(index)]):
        num_of_correct_answ += 1
        points += question.points
      else:
        points -= question.negative_points

    percentage = num_of_correct_answ / len(self.questions) * 100
    
    test_result = "passed" if self.is_test_passed(points, num_of_correct_answ, percentage) else "failed"
    
    return {"test_result": test_result, "points": points, "num_of_correct_answ": num_of_correct_answ, "percentage": percentage}
  
  def is_answer_for_mult_choice_quest_correct(self, question, answers):
    return_value = 0
    for ans1 in answers:
      for ans2 in question.question_type.answers:
        if ans1 == ans2.text and ans2.is_correct:
          return_value += 1
    
    return return_value
  
  def get_num_of_correct_answ_for_mult_choice_qeust(self, question):
    return_value = 0
    for ans in question.question_type.answers:
      if ans.is_correct:
        return_value += 1
        
    return return_value
  
  def is_answer_correct(self, question, answer):
    if question.question_type.__class__.__name__ == "SingleChoiceQuestion":
      print("A")
      for ans in question.question_type.answers:
        if ans.text == answer and ans.is_correct:
          return True
    elif question.question_type.__class__.__name__ == "OpenEndedQuestion":
      print("B")
      if question.question_type.answer.text == answer:
        return True
    elif question.question_type.__class__.__name__ == "TrueFalseQuestion":
      print("C")
      if question.question_type.answer == answer:
        return True
    else:
      print("D")
      if question.question_type.answer == answer:
        return True
      
    return False
  
  def is_test_passed(self, points, num_of_correct_answ, percentage):
    if self.pass_criteria.percentage_required > 0:
      return percentage > self.pass_criteria.percentage_required
    elif self.pass_criteria.number_of_correct_answers_required > 0:
      return num_of_correct_answ > self.pass_criteria.number_of_correct_answers_required
    else:
      return points > self.pass_criteria.points_required
  
  def to_dict(self):
    return {
        "name": self.name,
        "questions": [q.to_dict() for q in self.questions],
        "pass_criteria": self.pass_criteria.to_dict()
    } 