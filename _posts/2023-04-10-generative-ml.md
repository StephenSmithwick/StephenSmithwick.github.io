---
layout: post
title:  "Playing with ml some more"
categories: ml
last_edit: 2025-01-20
published: false
---


## ChatGPT

```
curl https://api.openai.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-4o-mini",
    "store": true,
    "messages": [
      {"role": "user", "content": "write a haiku about ai"}
    ]
  }'
```

Links:


Diffusion:
- https://github.com/heejkoo/Awesome-Diffusion-Models

Models:
- https://www.cerebras.net/blog/cerebras-gpt-a-family-of-open-compute-efficient-large-language-models/
- https://github.com/nomic-ai/gpt4all

Usage:
- https://simonwillison.net/2023/Mar/27/ai-enhanced-development/
