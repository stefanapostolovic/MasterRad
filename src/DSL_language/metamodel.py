from textx import metamodel_from_file, language
from textx.export import model_export
from utils import module_path
from DSL_model import curriculum
import logging
import os

def init_metamodel(path=None):
  logging.info("Initializing the metamodel")
  crc_grammar_path = module_path('DSL_language/crcDSL.tx')
  crc_metamodel = metamodel_from_file(crc_grammar_path)
  #TODO add processors
  #crc_metamodel.register_obk_processors(...)
  
  if path is None:
    crc_model = crc_metamodel.model_from_file(module_path('Example/test.crc'))
  else:
    crc_model = crc_metamodel.model_from_file(path)
  
  if not os.path.exists('dot_files'):
    os.mkdir('dot_files')
  model_export(crc_model, 'dot_files/metamodel.dot')
  
  #TEMP
  print_model(crc_model)
  
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
    print("---Modules for: ", crc.name)
    for m in crc.modules:
      print("---Module name: ", m.name)
      print("---Module text: ", m.text)
      print("---Module images: ", m.images)
      print("---Module videos: ", m.videos)
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

@language('curriculum', '*.crc')
def crc_parser():
  return init_metamodel()

def main():
    init_metamodel()

if __name__ == '__main__':
    main()