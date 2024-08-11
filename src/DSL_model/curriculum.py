from DSL_model import course

class Curriculum:
  def __init__(self, name, courses):
    self.name = name
    self.courses = self.init_courses(courses)
  
  def init_courses(self, courses):
    return_value = []
    
    for crs in courses:
      return_value.append(course.Course(crs.name, crs.modules, crs.test, crs.advice, crs.prerequisites))
    
    return return_value