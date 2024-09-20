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
  
  return crc_model

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
  validate_question_points(question)
  validate_negative_points_and_accept_partial_answer(question)

def validate_question_points(question):
  if question.points <= 0:
    raise TextXSemanticError(f"Question: {question.question_text} must have a defined points value above 0")

def validate_negative_points_and_accept_partial_answer(question):
  if question.question_type.__class__.__name__ == "MultipleChoiceQuestion" and hasattr(question.question_type, "accept_partial_answer"):
    if hasattr(question, "negative_points") == False or hasattr(question, "negative_points") == True and question.negative_points <= 0:
      raise TextXSemanticError(f"Multiple-choice question: {question.question_text} must have a defined negative points value above 0 if it accepts partial answers")
  
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
    is_unique, message = validate_name_uniqueness(model)
    if (is_unique is False):
      raise TextXSemanticError(message)
    
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

def validate_name_uniqueness(model):
  course_names = set()
  module_names = set()
  test_names = set()

  for course in model.courses:
    # Check if course name is unique
    if course.name in course_names:
      return False, f"Duplicate course name found: {course.name}"
    course_names.add(course.name)

    if course.test.name in test_names:
      return False, f"Duplicate test name found: {course.test.name}"
    test_names.add(course.test.name)
    
    for module in course.modules:
      # Check if module name is unique within the entire curriculum
      if module.name in module_names:
          return False, f"Duplicate module name found: {module.name}"
      module_names.add(module.name)

      # Check if test name is unique within the entire curriculum
      if module.test.name in test_names:
          return False, f"Duplicate test name found: {module.test.name}"
      test_names.add(module.test.name)

  return True, "All names are unique"

@language('curriculum', '*.crc')
def crc_parser():
  return init_metamodel()

def main():
    init_metamodel()

if __name__ == '__main__':
    main()