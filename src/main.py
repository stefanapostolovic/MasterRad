import logging
from fastapi import FastAPI
from fastapi.middleware import Middleware, cors
import uvicorn
import api

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

origins = [
  "http://localhost:3000"
]

middleware = [
  Middleware(cors.CORSMiddleware, allow_origins=origins,
             allow_methods=["*"], allow_headers=["*"],)
]

app = FastAPI(middleware=middleware)
app.include_router(api.router)

def main():
  logging.info("Application started...")  
  uvicorn.run("main:app", log_level="info", reload=True)

if __name__ == '__main__':
  main()