from pydantic import BaseModel

class CompleteCourseRequest(BaseModel):
    is_completed: bool