from DSL_model import test
from DSL_model import module

class Course:
  def __init__(self, name, modules, test, advice=None, prerequisites=None):
    self.name = name
    self.modules = self.init_modules(modules)
    self.test = self.init_test(test)
    self.advice = advice
    self.prerequisites = prerequisites
  
  def init_modules(self, modules):
    return_value = []
    
    for m in modules:
      return_value.append(module.Module(m.name, m.text, m.test, m.advice, m.prerequisites, m.images, m.videos))
      
    return return_value
  
  def init_test(self, t):
    return test.Test(t.name, t.questions, t.pass_criteria)