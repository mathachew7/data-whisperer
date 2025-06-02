from fastapi import FastAPI
from fastapi.responses import JSONResponse

app = FastAPI()

@app.get("/logs")
async def get_logs():
    logs = [
        { "id": "log-101", "content": "Service X restarted due to memory leak." },
        { "id": "log-102", "content": "Job Y failed because of schema mismatch." },
        { "id": "log-103", "content": "Pipeline Z completed successfully at 3 AM." },
        { "id": "log-104", "content": "API rate limit exceeded for endpoint /data." }
    ]
    return JSONResponse(content=logs)
