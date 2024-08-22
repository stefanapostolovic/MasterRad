from DSL_model import test
from DSL_model import image

class Module:
  def __init__(self, name, description, text, test, advice = None, prerequisites=None, images=None, videos=None):
    self.name = name
    self.description = description
    self.text = text
    self.test = self.init_test(test)
    self.advice = advice
    self.prerequisites = prerequisites
    self.images = self.init_images(images)
    self.videos = self.init_videos(videos)
    self.is_completed = False
  
  def init_test(self, t):
    return test.Test(t.name, t.questions, t.pass_criteria)
  
  def init_images(self, images):
    if images == None:
      return []
    
    return_value = []
    for img in images:
      return_value.append(image.Image(img.url, img.description))
      
    return return_value

  def init_videos(self, videos):
    if videos == None:
      return []
    
    return_value = []
    for vid in videos:
      return_value.append(image.Image(vid.url, vid.description))
      
    return return_value
  
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
        "description": self.description,
        "text": self.text,
        "test": self.test.to_dict(),
        "advice": self.advice,
        "prerequisites": [self.prerequisite_to_dict(prerequisite) for prerequisite in self.prerequisites],
        "images": [i.to_dict() for i in self.images],
        "videos": [v.to_dict() for v in self.videos],
        "is_completed": self.is_completed
    }
    
  def prerequisite_to_dict(_, prerequisite):
      if hasattr(prerequisite, "course_name"):
        return "course:" + prerequisite.course_name.name
      else:
        return "module:" + prerequisite.module_name.name