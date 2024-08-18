from DSL_model import test
from DSL_model import module

class Course:
  def __init__(self, name, description, modules, test, advice=None, prerequisites=None):
    self.name = name
    self.description = description
    self.modules = self.init_modules(modules)
    self.test = self.init_test(test)
    self.advice = advice
    self.prerequisites = prerequisites
    self.is_completed = False
  
  def init_modules(self, modules):
    return_value = []
    
    for m in modules:
      return_value.append(module.Module(m.name, m.description, m.text, m.test, m.advice, m.prerequisites, m.images, m.videos))
      
    return return_value
  
  def init_test(self, t):
    return test.Test(t.name, t.questions, t.pass_criteria)
  
  def get_module_by_name(self, module_name):
    for module in self.modules:
      if module.name == module_name:
        return module
        
    return None
  
  def complete_course(self):
    self.is_completed = True
    
  def to_dict(self, seen=None):
    if seen is None:
      seen = set()
        
    if id(self) in seen:
      return {"name": self.name, "modules": "Circular reference detected", "test": "Circular reference detected"}
    
    seen.add(id(self))    
    
    return {
        "name": self.name,
        "description": self.description,
        "modules": [m.to_dict(seen) for m in self.modules],
        "test": self.test.to_dict(),
        "advice": self.advice,
        "prerequisites": [self.prerequisite_to_dict(prerequisite) for prerequisite in self.prerequisites],
        "is_completed": self.is_completed
    }
  
  def prerequisite_to_dict(_, prerequisite):
    if hasattr(prerequisite, "course_name"):
      return "course:" + prerequisite.course_name.name
    else:
      return "module:" + prerequisite.module_name.name