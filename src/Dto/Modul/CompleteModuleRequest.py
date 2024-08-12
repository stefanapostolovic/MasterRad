from pydantic import BaseModel

class CompleteModuleRequest(BaseModel):
    is_completed: bool