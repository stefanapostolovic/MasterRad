import logging
import sys
from DSL_language import metamodel 

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def main():
  try:
    logging.info("Application started...")
    args = sys.argv[1:]
    
    model = None
    if len(args) == 0:
      model = metamodel.init_metamodel()
    elif len(args) == 1:
      model = metamodel.init_metamodel(args[0])
    else:
      logging.exception("Invalid arguments. Required argument - path to the curriculum file")
    
  except Exception as e:
    logging.exception(e)

if __name__ == '__main__':
    main()