import sys
import logging
from Dto.Course.CompleteCourseRequest import CompleteCourseRequest
from Dto.Modul.CompleteModuleRequest import CompleteModuleRequest
from Dto.Test.CompleteTestRequest import CompleteTestRequest
from fastapi import HTTPException, APIRouter
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from DSL_language import metamodel 
from DSL_model import curriculum

def get_model():
  try:
    model = None
    
    args = sys.argv[1:]
    if len(args) == 0 or args[0] == "main:app":
      model = metamodel.init_metamodel()
    elif len(args) == 1:
      model = metamodel.init_metamodel(args[0])
    else:
      raise Exception("Invalid arguments. Required argument - path to the curriculum file")
      
    return model
  except Exception as e:
    raise Exception(e)

model = get_model()

curric = curriculum.Curriculum(model.name, model.courses)

router = APIRouter()

@router.get("/", response_model=None)
def get_curriculum():
  response = curric
  
  if response is None:
    raise HTTPException(status_code=404, detail="No courses found.")
  
  try:
    json_response = jsonable_encoder(response.to_dict())
  except Exception as e:
    logging.exception("Exception: {}".format(type(e).__name__))
    logging.exception("Exception message: {}".format(type(e)))
    return
  
  return JSONResponse(content=json_response)

@router.get("/courses", response_model=None)
def get_all_course_names():
  response = []
  
  for course in curric.courses:
    response.append(course.name)
  
  if response.count == 0:
    raise HTTPException(status_code=404, detail="No courses found.")
  
  try:
    json_response = jsonable_encoder(response)
  except Exception as e:
    logging.exception("Exception: {}".format(type(e).__name__))
    logging.exception("Exception message: {}".format(type(e)))
    return
  
  return JSONResponse(content=json_response)

@router.get("/course/{course_name}", response_model=None)
def get_course_by_name(course_name: str):
  canAccess = check_if_can_access_course(course_name)
  if canAccess[course_name] == False:
    raise HTTPException(status_code=403, detail=f"Course with the name {course_name} cannot be accessed.")
    
  response = curric.get_course_by_name(course_name)
  
  if response is None:
    raise HTTPException(status_code=404, detail=f"Course with the name {course_name} not found.")
  
  try:
    json_response = jsonable_encoder(response.to_dict())
  except Exception as e:
    logging.exception("Exception: {}".format(type(e).__name__))
    logging.exception("Exception message: {}".format(type(e)))
    return
  
  return JSONResponse(content=json_response)

@router.get("/course/is_complete/{course_name}", response_model=None)
def check_if_course_is_complete(course_name: str):
  course = curric.get_course_by_name(course_name)
  
  if course is None:
    raise HTTPException(status_code=404, detail=f"Course with the name {course_name} not found.")
  
  response = {"is_completed": "true"} if course.is_completed else {"is_completed": "false"}
  return response

@router.get("/course/can_access/{course_name}", response_model=None)
def check_if_can_access_course(course_name: str):
  course = curric.get_course_by_name(course_name)
  
  if course is None:
    raise HTTPException(status_code=404, detail=f"Course with the name {course_name} not found.")

  response = True
  
  for prereq in course.to_dict()["prerequisites"]:
    nodeType, nodeName = str.split(prereq, ":")
    if nodeType == "course":
      prereqCourse = curric.get_course_by_name(nodeName)
      if prereqCourse.is_completed == False:
        response = False
    else:
      prereqModule = curric.get_module_by_name(nodeName)
      if prereqModule.is_completed == False:
        response = False
    
  return { course_name: response }

@router.get("/course/can_take_test/{course_name}", response_model=None)
def check_if_can_take_test(course_name: str):
  course = curric.get_course_by_name(course_name)
  
  if course is None:
    raise HTTPException(status_code=404, detail=f"Course with the name {course_name} not found.")

  response = True
  
  for module in course.modules:
    if module.is_completed == False:
      response = False
      break
    
  return { "can_take_test": response }
    
@router.patch("/course/{course_name}", response_model=None)
def complete_course(course_name: str, update_course_request: CompleteCourseRequest):
  course = curric.get_course_by_name(course_name)
  if course is None:
    raise HTTPException(status_code=404, detail=f"Course with the name {course_name} not found.")
  
  course.is_completed = update_course_request.is_completed
  
  return {"message": "Course completed successfully", "course": course.name}

@router.get("/module/{module_name}", response_model=None)
def get_module_by_name(module_name: str):
  canAccess = check_if_can_access_module(module_name)
  if canAccess[module_name] == False:
    raise HTTPException(status_code=403, detail=f"Module with the name {module_name} cannot be accessed.")
  
  response = curric.get_module_by_name(module_name)
  if response is None:
    raise HTTPException(status_code=404, detail=f"Module with the name {module_name} not found.")
  
  try:
    json_response = jsonable_encoder(response.to_dict())
  except Exception as e:
    logging.exception("Exception: {}".format(type(e).__name__))
    logging.exception("Exception message: {}".format(type(e)))
    return
  
  return JSONResponse(content=json_response)

@router.get("/module/is_complete/{module_name}", response_model=None)
def check_if_course_is_complete(module_name: str):
  module = curric.get_module_by_name(module_name)
  
  if module is None:
    raise HTTPException(status_code=404, detail=f"Module with the name {module} not found.")
  
  response = {"is_completed": "true"} if module.is_completed else {"is_completed": "false"}
  return response

@router.get("/module/can_access/{module_name}", response_model=None)
def check_if_can_access_module(module_name: str):
  module = curric.get_module_by_name(module_name)
  
  if module is None:
    raise HTTPException(status_code=404, detail=f"Module with the name {module_name} not found.")

  response = True
  
  for prereq in module.to_dict()["prerequisites"]:
    nodeType, nodeName = str.split(prereq, ":")
    if nodeType == "course":
      prereqCourse = curric.get_course_by_name(nodeName)
      if prereqCourse.is_completed == False:
        response = False
    else:
      prereqModule = curric.get_module_by_name(nodeName)
      if prereqModule.is_completed == False:
        response = False
    
  return { module_name: response }

@router.patch("/module/{course_name}/{module_name}", response_model=None)
def complete_module(course_name: str, module_name: str, update_module_request: CompleteModuleRequest):
  
  course = curric.get_course_by_name(course_name)
  if course is None:
    raise HTTPException(status_code=404, detail=f"Course with the name {course_name} not found.")
  
  module = course.get_module_by_name(module_name)
  if module is None:
    raise HTTPException(status_code=404, detail=f"Module with the name {module_name} in the course {course_name} not found.")
  
  module.is_completed = update_module_request.is_completed
  
  return {"message": "Module completed successfully", "module": module.name}

@router.get("/test/course/{course_name}", response_model=None)
def get_test_by_course_name(course_name: str):
  course = curric.get_course_by_name(course_name)
  if course is None:
    raise HTTPException(status_code=404, detail=f"Course with the name {course_name} not found.")

  response = course.test
  if response is None:
    raise HTTPException(status_code=404, detail=f"Course {course_name} has no tests.")
  
  try:
    json_response = jsonable_encoder(response.to_dict())
  except Exception as e:
    logging.exception("Exception: {}".format(type(e).__name__))
    logging.exception("Exception message: {}".format(type(e)))
    return
  
  return JSONResponse(content=json_response)

@router.get("/test/module/{module_name}", response_model=None)
def get_test_by_module_name(module_name: str):
  module = curric.get_module_by_name(module_name)
  if module is None:
    raise HTTPException(status_code=404, detail=f"Module with the name {module_name} not found.")

  response = module.test
  if response is None:
    raise HTTPException(status_code=404, detail=f"Module {module_name} has no tests.")
  
  try:
    json_response = jsonable_encoder(response.to_dict())
  except Exception as e:
    logging.exception("Exception: {}".format(type(e).__name__))
    logging.exception("Exception message: {}".format(type(e)))
    return
  
  return JSONResponse(content=json_response)

@router.get("/test/{course_name}/{module_name}", response_model=None)
def get_test_by_course_and_module_name(course_name: str, module_name: str):
  
  course = curric.get_course_by_name(course_name)
  if course is None:
    raise HTTPException(status_code=404, detail=f"Course with the name {course_name} not found.")

  module = course.get_module_by_name(module_name)
  if module is None:
    raise HTTPException(status_code=404, detail=f"Module with the name {module_name} from the course {course_name} not found.")
  
  response = module.test
  if response is None:
    raise HTTPException(status_code=404, detail=f"Module {module_name} from the course {course_name} has no tests.")
  
  try:
    json_response = jsonable_encoder(response.to_dict())
  except Exception as e:
    logging.exception("Exception: {}".format(type(e).__name__))
    logging.exception("Exception message: {}".format(type(e)))
    return
  
  return JSONResponse(content=json_response)

@router.post("/test/completeFromCourse", response_model=None)
def complete_test_from_course(request: CompleteTestRequest):
  course_name = request.name
  answers = request.answers
  
  course = curric.get_course_by_name(course_name)
  if course is None:
    raise HTTPException(status_code=404, detail=f"Course with the name {course_name} not found.")
  
  response = course.test.grade_test(answers)
  course.test.number_of_attempts += 1
  course.test.score_percentages.append(response["percentage"])
  
  if response["test_result"] == "passed":
    course.complete_course()
  
  try:
    json_response = jsonable_encoder(response)
  except Exception as e:
    logging.exception("Exception: {}".format(type(e).__name__))
    logging.exception("Exception message: {}".format(type(e)))
    return
  
  return JSONResponse(content=json_response)

@router.post("/test/completeFromModule", response_model=None)
def complete_test_from_module(request: CompleteTestRequest):
  module_name = request.name
  answers = request.answers
  
  module = curric.get_module_by_name(module_name)
  if module is None:
    raise HTTPException(status_code=404, detail=f"Module with the name {module_name} not found.")
  
  response = module.test.grade_test(answers)
  module.test.number_of_attempts += 1
  module.test.score_percentages.append(response["percentage"])
  
  if response["test_result"] == "passed":
    module.complete_module()
  
  try:
    json_response = jsonable_encoder(response)
  except Exception as e:
    logging.exception("Exception: {}".format(type(e).__name__))
    logging.exception("Exception message: {}".format(type(e)))
    return
  
  return JSONResponse(content=json_response)

@router.get("/testResult/userStatistics/{course_name}", response_model=None)
def getUserStatisticsForCourse(course_name: str):
  course = curric.get_course_by_name(course_name)
  if course is None:
    raise HTTPException(status_code=404, detail=f"Course with the name {course_name} not found.")
  
  response = course.get_user_statistics()
  
  try:
    json_response = jsonable_encoder(response)
  except Exception as e:
    logging.exception("Exception: {}".format(type(e).__name__))
    logging.exception("Exception message: {}".format(type(e)))
    return
  
  return JSONResponse(content=json_response)