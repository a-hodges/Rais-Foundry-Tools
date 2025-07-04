import sys
import os
import json

dir = os.path.dirname(sys.argv[0])
if dir:
  os.chdir(dir)

for filename in os.listdir("."):
  if filename.endswith(".json"):
    with open(filename[:-5]+".js", "r") as f:
      script = f.read()
    with open(filename, "r+") as f:
      obj = json.load(f)
      obj["command"] = script
      f.seek(0)
      json.dump(obj, f, indent=2)
      f.truncate()
