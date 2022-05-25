import sys
from deepface import DeepFace
from os import path

img_path = sys.argv[1]
path.exists(img_path)

DeepFace.detectFace(img_path)
