from textx import metamodel_from_file, language, TextXSemanticError
from textx.export import model_export
from utils import module_path
from DSL_model import curriculum
import logging
import os

def init_metamodel(path=None):
  logging.info("Initializing the metamodel")
  crc_grammar_path = module_path('DSL_language/crcDSL.tx')
  crc_metamodel = metamodel_from_file(crc_grammar_path)
  
  object_processors = {
    "Course": course_validator,
    "SingleChoiceQuestion": single_choice_question_validator,
    "MultipleChoiceQuestion": multiple_choice_question_validator,
    "Question": question_validator,
    "Test": test_validators,
  }
  crc_metamodel.register_obj_processors(object_processors)
  crc_metamodel.register_model_processor(model_validator)
  
  if path is None:
    crc_model = crc_metamodel.model_from_file(module_path('Example/test.crc'))
  else:
    crc_model = crc_metamodel.model_from_file(path)
  
  if not os.path.exists('dot_files'):
    os.mkdir('dot_files')
  model_export(crc_model, 'dot_files/metamodel.dot')
  
  #TEMP
  #print_model(crc_model)
  
  return crc_model

#TEMP
def print_model(model):
  curr = curriculum.Curriculum(model.name, model.courses)
  #TEMP PRINTS
  print("************************Curriculum model:************************")
  print("-Curriculum name: ", curr.name) 
  for crc in curr.courses:
    print("--Course info: ")
    print("--Course name: ", crc.name)
    print("--Course is completed: ", crc.is_completed)
    print("---Modules for: ", crc.name)
    for m in crc.modules:
      print("---Module name: ", m.name)
      print("---Module text: ", m.text)
      print("---Module images: ", m.images)
      print("---Module videos: ", m.videos)
      print("---Module is completed: ", m.is_completed)
      print("----Module test info:")
      print("----Test name: ", m.test.name)
      print("-----Test questions info:")
      for q in m.test.questions:
        print("-----Question text: ", q.question_text)
        print_question_type(q.question_type)
        print("----Question points: ", q.points)
        print("----Question negative points: ", q.negative_points)
      print("----Test pass criteria: ")
      print_pass_criteria(m.test.pass_criteria)
      print("---Module advice: ", m.advice)
      print("---Module prerequisites: ")
      for pr in m.prerequisites:
        print_prerequisite(pr)
    print("----Test for: ", crc.name)
    print("----Test name: ", crc.test.name)
    print("----Test questions for: ", crc.test.name)
    for q1 in crc.test.questions:
      print("----Question name: ", q1.question_text)
      print_question_type(q1.question_type)
      print("----Question points: ", q1.points)
      print("----Question negative points: ", q1.negative_points)
    print("----Test pass criteria: ")
    print_pass_criteria(crc.test.pass_criteria)
    print("----Course advice: ", crc.advice)
    print("---Course prerequisites: ")
    for pr1 in crc.prerequisites:
      print_prerequisite(pr1)
      
#TEMP
def print_prerequisite(prerequisite):
  try:
    print("---", prerequisite.course_name)
  except Exception as e:
    print("---", prerequisite.module_name)

#TEMP
def print_pass_criteria(pass_criteria):
  if pass_criteria.percentage_required != 0.0:
    print("----Percentage required: ", pass_criteria.percentage_required)
  elif pass_criteria.number_of_correct_answers_required != 0:
    print("----Number of correct answers required: ", pass_criteria.number_of_correct_answers_required)
  else:
    print("----Points required: ", pass_criteria.points_required)

#TEMP
def print_question_type(question_type):
  print("----Question type: ", question_type.__class__.__name__)
  
  if question_type.__class__.__name__ == "MultipleChoiceQuestion":
    print("-----Question answers:")
    for a in question_type.answers:
      print("-----Answer text: ", a.text)
      print("-----Answer is correct: ", a.is_correct)
    print("----Question accepts partial answers: ", question_type.accept_partial_answer)
  elif question_type.__class__.__name__ == "NumberQuestion":
    print("-----Question answer: ", question_type.answer)
  elif question_type.__class__.__name__ == "OpenEndedQuestion":
    print("-----Question answer text: ", question_type.answer.text)
    print("-----Question answer is correct: ", question_type.answer.is_correct)
  elif question_type.__class__.__name__ == "SingleChoiceQuestion":
    for a1 in question_type.answers:
      print("-----Answer text: ", a1.text)
      print("-----Answer is correct: ", a1.is_correct)
  else:
    print("-----Question answer: ", question_type.answer)

#OBJECT VALIDATORS
def course_validator(course):
  validate_course_depenencies(course)
  validate_module_dependencies(course)

def validate_course_depenencies(course):
  for module in course.modules:
    for prereq in module.prerequisites:
      if hasattr(prereq, "course_name") and prereq.course_name.name == course.name:
        raise TextXSemanticError("A module cannot have a course that it is a part of as a prerequisite")

def validate_module_dependencies(course):
  for prereq1 in course.prerequisites:
    for module1 in course.modules:
      if hasattr(prereq1, "module_name") and prereq1.module_name.name == module1.name:
        raise TextXSemanticError("A course cannot have one of its modules as a prerequisite")

def single_choice_question_validator(single_choice_question):
  correct_answer_counter = 0
  
  for answer in single_choice_question.answers:
    if answer.is_correct:
      correct_answer_counter += 1
      if correct_answer_counter > 1:
        raise TextXSemanticError("Single-choice questions can only have 1 correct answer!")
  
def multiple_choice_question_validator(multiple_choice_question):
  correct_answer_counter = 0
  
  for answer in multiple_choice_question.answers:
    if answer.is_correct:
      correct_answer_counter += 1
  
  if correct_answer_counter <= 1:
        raise TextXSemanticError("Multiple-choice questions must have more than 1 correct answer!")

def question_validator(question):
  if question.points <= 0:
    raise TextXSemanticError(f"Question: {question.question_text} must have a defined points value above 0")

def test_validators(test):
  validate_percentage_required_criteria(test.pass_criteria)
  validate_number_of_correct_answers_criteria(test)
  validate_points_required_criteria(test)

def validate_percentage_required_criteria(pass_criteria):
  if pass_criteria.percentage_required < 0 or pass_criteria.percentage_required > 100:
     raise TextXSemanticError("Percentage required must be a positive decimal number below 100")

def validate_number_of_correct_answers_criteria(test):
  if len(test.questions) < test.pass_criteria.number_of_correct_answers_required:
    raise TextXSemanticError("Number of correct answers required to pass a test must not be larger than the total number of questions the test has")

def validate_points_required_criteria(test):
  test_total_points = 0
  
  for question in test.questions:
    test_total_points += question.points
  
  if test_total_points < test.pass_criteria.points_required:
    raise TextXSemanticError("The amount of points required to pass a test must not be larger than the total amount of points the test has")

#MODEL VALIDATORS
def model_validator(model, metamodel):
    for course in model.courses:
        check_for_cycles(course, metamodel)

        for module in course.modules:
            check_for_cycles(module, metamodel)

    logging.info("Model validation passed: No circular dependencies detected.")

def check_for_cycles(course_or_module, metamodel):
    visited = set()
    stack = set()

    # Start DFS traversal
    if has_cycle(course_or_module, visited, stack, metamodel):
        raise TextXSemanticError(f"Circular dependency detected in {course_or_module.name}")

def has_cycle(node, visited, stack, metamodel):
    # Retrieve the necessary classes from the metamodel
    CoursePrerequisite = metamodel['CoursePrerequisite']
    ModulePrerequisite = metamodel['ModulePrerequisite']
  
    visited.add(node)
    stack.add(node)

    # Check all prerequisites
    for prereq in node.prerequisites:
        # Resolve the actual course or module object
        if isinstance(prereq, CoursePrerequisite):
            prereq_node = prereq.course_name
        elif isinstance(prereq, ModulePrerequisite):
            prereq_node = prereq.module_name
        else:
            continue

        # Recursively check for cycles
        if prereq_node not in visited:
            if has_cycle(prereq_node, visited, stack, metamodel):
                return True
        elif prereq_node in stack:
            return True

    stack.remove(node)
    return False

# def get_course_by_name(model, name):
#     return next((course for course in model.courses if course.name == name), None)

# def get_module_by_name(courses, name):
#     return next((module for course in courses for module in course.modules if module.name == name), None)

@language('curriculum', '*.crc')
def crc_parser():
  return init_metamodel()

def main():
    init_metamodel()

if __name__ == '__main__':
    main()