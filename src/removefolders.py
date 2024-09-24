import os
import json
from pathlib import Path

cwd = Path(".")
for dir in cwd.iterdir():
  if dir.is_dir():
    for file in dir.iterdir():
      print(file)
      file = Path(file)
      if file.is_file() and file.suffix == ".json":
        with file.open("r") as f:
          obj = json.load(f)
        if "folder" in obj:
          del obj["folder"]
        if "flags" in obj:
          del obj["flags"]
        obj["_key"] = obj["_key"].replace("!item!", "!items!")
        with file.open("w") as f:
          json.dump(obj, f, indent=2)
