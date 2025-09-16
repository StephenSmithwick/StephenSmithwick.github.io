import datetime
import sys
import json

args = json.load(sys.stdin)

today = datetime.date.today()

future = datetime.date(today.year, args["month"], args["day"])
if future > today:
  diff = future - today
  print(diff.days)
else:
  future = datetime.date(today.year+1, args["month"], args["day"])
  diff = future - today
  print(diff.days)
