import sys
from deepface import DeepFace
from os import path

img_path = sys.argv[1]

DeepFace.detectFace(img_path)
