import logging

def main():
  try:
    print("Project started")
  except Exception as e:
    logging.exception(e)

if __name__ == '__main__':
    main()