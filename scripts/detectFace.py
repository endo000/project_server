import sys
from deepface import DeepFace

img_path = sys.argv[1]
DeepFace.detectFace(img_path)
