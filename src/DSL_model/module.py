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
  
  def init_test(self, t):
    return test.Test(t.name, t.questions, t.pass_criteria)