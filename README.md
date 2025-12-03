# ChatGPT Streaming Demo (FastAPI + Frontend)

This project provides a small, deployable example of a ChatGPT-powered chatbot using a Python FastAPI backend and a modern frontend that consumes streaming responses.

IMPORTANT: Keep your OpenAI API key secret. Do not commit `.env` with your key to version control.

## Local development

1. Copy files to your machine & `cd backend`.
2. Create a `.env` file with `OPENAI_API_KEY=sk-...`.
3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Run the backend:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

5. Serve the `frontend/` folder (open `frontend/index.html` directly in the browser or use a static server). If the backend runs on a different origin, update `BACKEND_URL` in `frontend/app.js`.

## Deploying

You can deploy the backend using Docker or directly to providers like Railway, Render, or DigitalOcean App Platform. The included `Dockerfile` works for all of them.

## Notes & Troubleshooting

- Streaming behavior depends on the version of the `openai` Python package. If streaming yields different shapes of chunks, adjust the parsing in `backend/main.py` accordingly.
- The streaming endpoint sends newline-delimited JSON (`application/x-ndjson`) to simplify parsing on the frontend.
- For production, add authentication, rate limits, and proper CORS origin restrictions.
