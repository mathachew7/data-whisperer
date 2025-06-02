from fastapi import FastAPI
from app.api.routes import router  # Import router from the correct location
from app.api.api_fetcher import fetch_logs_from_api  # Import API fetcher
from app.core.logger import logger  # Import your new logger

app = FastAPI(title="Data Whisperer API")

# Include all API routes (e.g., /ask, /upload)
app.include_router(router)

# Optional: Fetch logs from external API on server startup
@app.on_event("startup")
async def fetch_initial_logs():
    api_url = "http://127.0.0.1:9000/logs"  # Replace with your actual API endpoint
    api_headers = {"Authorization": "Bearer YOUR_API_KEY"}  # Replace with actual headers if needed

    logger.log("system_start", "Application startup initiated.")
    print("Fetching initial logs from external API...")

    try:
        fetch_logs_from_api(api_url, headers=api_headers)
        logger.log("api_fetch", f"Fetched initial logs from API: {api_url}")
        print("Initial logs loaded into Chroma.")
    except Exception as e:
        logger.log("api_fetch_error", f"Failed to fetch initial logs from API: {api_url}", {"error": str(e)})
        print(f"Failed to fetch logs: {e}")

    logger.log("system_start", "Application startup completed.")
