from pydantic import BaseModel
from typing import Dict, List, Union

class CompleteTestRequest(BaseModel):
  name: str
  answers: Dict[Union[int, str], Union[str, List[str]]]