# Terrible script to extract json objects from .log files

import os
import json

data = []
with open("000003.log", "r", encoding="ascii", errors="replace") as f:
  s = f.read()
  i = 0
  while i < len(s):
    if s[i] == "{":
      nest = 1
      j = i + 1
      while j < len(s):
        if s[j] == "{":
          nest += 1
        elif s[j] == "}":
          nest -= 1
        elif s[j] in "‘’“”":
          pass
        elif not s[j].isascii():
          break
        if nest == 0:
          break
        j += 1
      if nest == 0:
        match = s[i:j+1]
        data.append(match)
      i = j
    i += 1

if not os.path.exists("src"):
  os.mkdir("src")

for match in data:
  try:
    object = json.loads(match)
    if object.get("name", False) == False:
      pass # print(object)
    else:
      print(f"src/{object['name']}.json")
      with open(f"src/{object['name']}.json", "w") as f:
        json.dump(object, f, indent=2)
  except:
    pass # print(match)
