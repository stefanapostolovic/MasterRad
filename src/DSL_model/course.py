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
  
  def get_user_statistics(self):
    number_of_test_attempts = 0
    average_test_performance = 0.0
    
    number_of_test_attempts += self.test.number_of_attempts
    for score in self.test.score_percentages:
      average_test_performance += score
    
    best_scores_per_module = []
    
    for module in self.modules:
      number_of_test_attempts += module.test.number_of_attempts
      best_test_score = module.test.score_percentages[0]
      
      for score1 in module.test.score_percentages:          
        average_test_performance += score1
        
        if (score1 > best_test_score):
          best_test_score = score1
          
      best_scores_per_module.append({
            "module_name": module.name, 
            "best_score": best_test_score
        })
    
    average_test_performance = average_test_performance / number_of_test_attempts
    
    # Sort the best scores by best_score in descending order
    best_scores_per_module.sort(key=lambda x: x["best_score"], reverse=True)
    
    # The first element is the best module, the last is the worst
    best_module = best_scores_per_module[0]["module_name"]
    best_module_performance = best_scores_per_module[0]["best_score"]
    
    worst_module = best_scores_per_module[-1]["module_name"]
    worst_module_performance = best_scores_per_module[-1]["best_score"]
    
    return {"number_of_test_attempts": number_of_test_attempts, "average_test_performance": average_test_performance, "best_module": best_module, "best_module_performance": best_module_performance, "worst_module": worst_module, "worst_module_performance": worst_module_performance}
    
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