from fastapi import APIRouter, UploadFile, File, HTTPException, status, Query
from pydantic import BaseModel, Field, validator
import json
import io
import csv
from typing import List
from app.core.services import ask_data_whisperer
from app.core.vector_db import add_to_vector_db
from app.core.preprocessor import preprocess_logs
from app.core.logger import SQLiteLogger

router = APIRouter()
logger = SQLiteLogger()

# Pydantic model for validating user's question input
class QuestionRequest(BaseModel):
    question: str = Field(
        ...,
        min_length=1,
        max_length=500,
        description="User's query text"
    )

# Pydantic model to validate individual log entries for uploads
class LogItem(BaseModel):
    id: str = Field(..., description="Unique log identifier")
    content: str = Field(..., min_length=1, description="Content of the log")

    @validator("id")
    def id_must_not_be_empty(cls, v):
        if not v.strip():
            raise ValueError("id cannot be empty")
        return v

    @validator("content")
    def content_must_not_be_empty(cls, v):
        if not v.strip():
            raise ValueError("content cannot be empty")
        return v

# Response model to standardize upload responses
class UploadResponse(BaseModel):
    status: str

# ---- /ask endpoint ----
@router.post("/ask", response_model=dict)
async def ask(request: QuestionRequest):
    """
    Receives a user's question and returns an AI-generated answer
    based on the stored and processed pipeline logs.
    Also logs this query event in system logs.
    """
    logger.log(
        event_type="query_received",
        message=f"User asked: {request.question}"
    )
    response = await ask_data_whisperer(request.question)
    logger.log(
        event_type="query_responded",
        message=f"Response given: {response.get('answer', '')[:100]}..."  # store snippet
    )
    return response


# ---- /upload endpoint ----
@router.post("/upload", response_model=UploadResponse)
async def upload_logs(file: UploadFile = File(...)):
    """
    Upload a logs file (.json or .csv), validate and preprocess
    the logs, then add them to the vector database.
    Logs this upload event in system logs.
    """
    content = await file.read()  # Read entire uploaded file content
    filename = file.filename.lower()

    # Parse JSON file content
    if filename.endswith(".json"):
        try:
            data_raw = json.load(io.BytesIO(content))
        except json.JSONDecodeError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid JSON file."
            )

    # Parse CSV file content
    elif filename.endswith(".csv"):
        try:
            csvfile = io.StringIO(content.decode())
            reader = csv.DictReader(csvfile)
            data_raw = []

            # Convert each CSV row into a dictionary with 'id' and 'content'
            for idx, row in enumerate(reader, 1):
                data_raw.append({
                    "id": row.get("id", f"log-{idx}"),
                    "content": row.get("content", "")
                })
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid CSV file: {e}"
            )

    # Unsupported file types
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported file type. Please upload a .json or .csv file."
        )

    # Validate the data format: must be a list
    if not isinstance(data_raw, list):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Expected a list of log entries."
        )

    # Validate each log entry structure with Pydantic model
    try:
        logs = [LogItem(**item) for item in data_raw]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Log data validation error: {e}"
        )

    # Convert Pydantic models to dicts for processing
    logs_dicts = [log.dict() for log in logs]

    # Preprocess logs: deduplicate, clean, chunk long entries
    cleaned_logs = preprocess_logs(logs_dicts)

    # Add preprocessed logs to the vector database for later querying
    add_to_vector_db(cleaned_logs)

    logger.log(
        event_type="logs_uploaded",
        message=f"Uploaded {len(cleaned_logs)} cleaned logs from file: {filename}"
    )

    return UploadResponse(
        status=f"Uploaded {len(cleaned_logs)} cleaned logs successfully."
    )


# ---- /system-logs endpoint ----
@router.get("/system-logs", tags=["System Logs"])
def read_system_logs(
    limit: int = Query(50, ge=1, le=500, description="Number of recent logs to fetch")
):
    """
    Retrieve recent system logs from the SQLite logger.

    Args:
        limit (int): Number of recent logs to return (default 50, max 500)

    Returns:
        dict: List of logs with timestamp, event_type, message, and metadata
    """
    logs = logger.fetch_logs(limit=limit)
    return {"logs": logs}
