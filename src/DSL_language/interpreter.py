from textx import metamodel_from_file, language
from textx.export import model_export
from utils import module_path

def init_metamodel():
  print ("Initializing the metamodel")

@language('curriculum', '*.crc')
def crc_parser():
  return init_metamodel()

def main():
    init_metamodel()

if __name__ == '__main__':
    main()