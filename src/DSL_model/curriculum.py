from DSL_model import course

class Curriculum:
  def __init__(self, name, courses):
    self.name = name
    self.courses = self.init_courses(courses)
  
  def get_course_by_name(self, course_name):
    for course in self.courses:
      if course.name == course_name:
        return course
      
    return None
  
  def init_courses(self, courses):
    return_value = []
    
    for crs in courses:
      return_value.append(course.Course(crs.name, crs.description, crs.modules, crs.test, crs.advice, crs.prerequisites))
    
    return return_value
  
  def get_module_by_name(self, module_name):
    for course in self.courses:
      for module in course.modules:
        if module.name == module_name:
          return module
  
  def to_dict(self):
    return {
        "name": self.name,
        "courses": [c.to_dict() for c in self.courses]
    }