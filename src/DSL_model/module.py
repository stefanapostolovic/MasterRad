from DSL_model import test

class Module:
  def __init__(self, name, text, test, advice = None, prerequisites=None, images=None, videos=None):
    self.name = name
    self.text = text
    self.test = self.init_test(test)
    self.advice = advice
    self.prerequisites = prerequisites
    self.images = images
    self.videos = videos
    self.is_completed = False
  
  def init_test(self, t):
    return test.Test(t.name, t.questions, t.pass_criteria)
  
  def complete_module(self):
    self.is_completed = True
    
  def to_dict(self, seen=None):
    if seen is None:
      seen = set()
    
    if id(self) in seen:
      return {"name": self.name, "test": "Circular reference detected", "prerequisites": "Circular reference detected"}
    
    seen.add(id(self))
    
    return {
        "name": self.name,
        "text": self.text,
        "test": self.test.to_dict(),
        "advice": self.advice,
        "prerequisites": [self.prerequisite_to_dict(prerequisite) for prerequisite in self.prerequisites],
        "images": self.images,
        "videos": self.videos,
        "is_completed": self.is_completed
    }
    
  def prerequisite_to_dict(_, prerequisite):
      if hasattr(prerequisite, "course_name"):
        return "course:" + prerequisite.course_name.name
      else:
        return "module:" + prerequisite.module_name.name