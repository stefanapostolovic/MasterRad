class Image:
  def __init__(self, url, description):
    self.url = url
    self.description = description
  
  def to_dict(self):
    return {
        "url": self.url,
        "description": self.description
    }