import os
import json
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse
from pydantic import BaseModel
import openai

# Load API key from environment variable
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise RuntimeError("OPENAI_API_KEY environment variable not set")
openai.api_key = OPENAI_API_KEY

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Message(BaseModel):
    message: str
# ✅ Add the health check route right here
@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/chat")
async def chat(msg: Message):
    """Simple non-streaming fallback endpoint."""
    try:
        resp = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": msg.message}],
            max_tokens=800,
            temperature=0.7,
        )
        text = resp.choices[0].message.get("content") if resp.choices else ""
        return JSONResponse({"reply": text})
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)


@app.post("/stream")
async def stream(request: Request):
    """Stream tokens from OpenAI and proxy them as a newline-delimited JSON stream."""
    body = await request.json()
    prompt = body.get("message", "")

    def event_stream():
        try:
            response = openai.ChatCompletion.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7,
                stream=True,
                max_tokens=800,
            )

            for chunk in response:
                try:
                    if not chunk:
                        continue
                    if isinstance(chunk, (bytes, str)):
                        text = str(chunk)
                        payload = {"token": text}
                    else:
                        token_text = ""
                        choices = chunk.get("choices", [])
                        for c in choices:
                            delta = c.get("delta", {})
                            token_text += delta.get("content", "")
                        payload = {"token": token_text}

                    data = json.dumps(payload) + "\n"
                    yield data.encode("utf-8")
                except Exception:
                    continue

            yield json.dumps({"done": True}).encode("utf-8")

        except Exception as e:
            yield json.dumps({"error": str(e)}).encode("utf-8")

    return StreamingResponse(event_stream(), media_type="application/x-ndjson")
#//END
