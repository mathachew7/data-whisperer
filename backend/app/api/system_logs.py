from fastapi import APIRouter, Query
from app.core.logger import SQLiteLogger
from typing import List

router = APIRouter()
logger = SQLiteLogger()

@router.get("/system-logs", tags=["System Logs"])
def read_system_logs(limit: int = Query(50, ge=1, le=500, description="Number of recent logs to fetch")):
    """
    Retrieve recent system logs from SQLite logger.

    Args:
        limit (int): Number of recent logs to return (default 50, max 500)

    Returns:
        dict: List of logs with timestamp, event_type, message, metadata
    """
    # Fetch logs from SQLite logger
    logs = logger.fetch_logs(limit=limit)

    # Log the fetch event into the system logs with metadata
    logger.log(
        event_type="fetch_logs",
        message=f"Fetched {len(logs)} system logs.",
        metadata={"limit": limit}
    )

    return {"logs": logs}
