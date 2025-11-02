# Terrible script to extract json objects from .log files

from pathlib import Path
import os
import json

data = []
for log in Path(".").iterdir():
  if log.suffix == ".log":
    with open(log, "r", encoding="ascii", errors="replace") as f:
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

folder = Path("logsrc")
if not folder.exists():
  folder.mkdir()

for match in data:
  try:
    object = json.loads(match)
    if object.get("name", False) == False:
      pass # print(object)
    else:
      name = object['name'].replace(":", "")
      filename = (folder / name).with_suffix(".json")
      print(filename)
      with open(filename, "w") as f:
        json.dump(object, f, indent=2)
  except:
    pass # print(match)
