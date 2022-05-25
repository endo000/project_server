import sys
from deepface import DeepFace
import json
from os import path

img1_path = sys.argv[1]
img2_path = sys.argv[2]

print("img1_path: ", img1_path)
print("exists: ", path.exists(img1_path))
print("img2_path: ", img2_path)
print("exists: ", path.exists(img2_path))

verification = DeepFace.verify(img1_path=img1_path, img2_path=img2_path, prog_bar=False)
print(json.dumps(verification))
