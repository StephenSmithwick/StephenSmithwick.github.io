---
layout: post
title:  Playing with Google models
categories: ml
published: false
# last_edit:
needs-work: unpublished
---

## Models
### Gemini 3 & 2.5 (Text & Multi-modal)

Display Name|API Model ID | Category|Key Strength
-|-|-|-
Gemini 3.1 Pro	| gemini-3.1-pro-preview	| Text-out |	SOTA reasoning, deep analysis.
Gemini 3 Flash	| gemini-3-flash-preview	| Text-out |	Best speed/intelligence balance.
Gemini 2.5 Pro	| gemini-2.5-pro	| Text-out |	Stable flagship reasoning.
Gemini 2.5 Flash	| gemini-2.5-flash	| Text-out |	High throughput, low latency.
Gemini 2.5 Flash Lite	| gemini-2.5-flash-lite	| Text-out |	Ultra-fast, high RPM for simple tasks.

### Gemma 3 (Open Weights / Multi-modal)

Display Name|API Model ID | Category|Key Strength
-|-|-|-
Gemma 3 27B |	gemma-3-27b-it	| Other |	High-tier open weights (multi-modal).
Gemma 3 12B |	gemma-3-12b-it	| Other |	Great for local hosting/Agentia testing.
Gemma 3 4B |	gemma-3-4b-it	| Other |	Lightweight multi-modal.
Gemma 3 1B |	gemma-3-1b-it	| Other |	Extreme efficiency.

### Generative Media (Images & Video)

Display Name|API Model ID | Category|Key Strength
-|-|-|-
Imagen 4 Ultra	| imagen-4.0-ultra-generate-001	| Multi-modal	| 4K professional quality visuals.
Imagen 4 Generate	| imagen-4.0-generate-001	| Multi-modal	| High-fidelity text-to-image.
Imagen 4 Fast	| imagen-4.0-fast-generate-001	| Multi-modal	| Speed-optimized generation.
Nano Banana Pro	| gemini-3-pro-image-preview	| Multi-modal	| Reasoning-heavy image generation.
Nano Banana 2	| gemini-3.1-flash-image-preview	| Multi-modal	| High-volume, fast image generation.
Veo 3.1	| veo-3.1-generate-preview	| Multi-modal	| Cinematic video with audio.

### Specialized & Agentic Tools

Display Name|API Model ID | Category|Key Strength
-|-|-|-
Computer Use	| computer-use-preview	| Other	| UI automation (clicks/types).
Deep Research Pro	| gemini-deep-research-preview	| Agents	| Multi-step autonomous research.
Gemini Robotics	| gemini-robotics-1.5-preview	| Other	| Embodied reasoning (spatial tasks).
Gemini Embedding 1	| text-embedding-004	| Other	 | RAG and semantic search.

### Live API (Audio/Video Streams)

Display Name|API Model ID | Category|Key Strength
-|-|-|-
Gemini 2.5 Flash Live	| gemini-2.5-flash-live-preview	| Live API |	Low-latency voice/video interaction.
Gemini 2.5 Flash TTS	| gemini-2.5-flash-preview-tts	| Multi-modal |	Controllable text-to-speech.

you can use the :latest aliases in your code to keep it evergreen:
- gemini-pro-latest → gemini-3.1-pro-preview
- gemini-flash-latest → gemini-3-flash-preview


## Requests
```bash
curl "https://generativelanguage.googleapis.com/v1alpha/models/gemma-3-27b-it:generateContent" \
  -H "x-goog-api-key: $GEMINI_API_KEY" \
  -H 'Content-Type: application/json' \
  -X POST \
  -d @- << JSON | jq
{
"contents": [{
    "parts": [
    { "text": "Identify any text, logos, or distinct engravings on the perfume bottle. Based on the bottle shape and sprayer, what brand and scent could this be?" },
    {
        "inlineData": {
        "mimeType": "image/webp",
        "data": "$(base64 -i ~/test.webp -o -)"
        },
        "mediaResolution": {
        "level": "media_resolution_high"
        }
    }
    ]
}]
}
JSON
```
response
```json
{
  "candidates": [
    {
      "content": {
        "parts": [
          {
            "text": "Here's a breakdown of what's in the image:\n\n*   **Perfume Bottle:** The most prominent object is a rectangular perfume bottle, mostly empty, with a metallic-colored spray nozzle. The liquid inside appears to be a light peach or rose color.\n*   **Hand:** A hand is holding the perfume bottle.\n*   **White Device:** In the background, there's a white, cylindrical device that looks like a smart speaker (possibly a Google Home or Amazon Echo).\n*   **Packaging:** There's some blue plastic packaging visible.\n*   **Jar/Container:** A small white jar or container is partially visible.\n*   **Drink & Straw:** A drink in a glass with a straw is in the lower left corner.\n*   **Picture Frame:** A portion of a gold picture frame is visible on the left side.\n*   **Black Case:** The perfume bottle is resting on a black case.\n\nIt appears to be a casual, indoor setting, possibly a dresser or countertop."
          }
        ],
        "role": "model"
      },
      "finishReason": "STOP",
      "index": 0
    }
  ],
  "modelVersion": "gemma-3-27b-it",
  "responseId": "zsehaebWDJal_PUPi8HwmQI"
}
```
