---
layout: post
title: FastAPI exploration in Python
# last_edit:
published: true
categories: python
meta: WiP
---

A quick exploration of [FastAPI](https://fastapi.tiangolo.com) going through the [tutorial](https://fastapi.tiangolo.com/#create-it.)

## Getting started
Creating a FastAPI project: `testFastAPI`
```bash
mkdir testFastAPI; cd testFastAPI
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip

pip install "fastapi[standard]"
pip freeze > requirements.txt
```

## My initial project

`testFastAPI/main.py`:
```python
from typing import Union

from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/echo/{path}")
def read_item(path: str, q: Union[str, None] = None):
    return {"path": path, "q": q}
```

### Starting the server

`fastapi dev main.py` will run the API server and output the port (default looks to be `8000`).  The Open API doc will be at: http://127.0.0.1:8000/docs

Testing the echo end point with this request:
`curl "http://127.0.0.1:8000/echo/hello?q=world" | jq`

```json
{
  "path": "hello",
  "q": "world"
}
```

## Next steps

From here, I plan to explore:
- Request body handling
- Dependency injection
- Response models and validation
