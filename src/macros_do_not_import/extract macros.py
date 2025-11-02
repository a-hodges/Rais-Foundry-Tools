import os
import json

for filename in os.listdir("."):
  if filename.endswith(".json"):
    with open(filename, "r") as f:
      obj = json.load(f)
    with open(filename[:-5]+".js", "w") as f:
      f.write(obj["command"])
