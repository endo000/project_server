print("Hello world")
import sys
from deepface import DeepFace
import json

img1_path = sys.argv[1]
img2_path = sys.argv[2]

verification = DeepFace.verify(img1_path=img1_path, img2_path=img2_path, prog_bar=False)
print(json.dumps(verification))
