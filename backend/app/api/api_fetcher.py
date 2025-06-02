# app/api_fetcher.py

import requests
from app.core.vector_db import add_to_vector_db
from app.core.preprocessor import preprocess_logs

def fetch_logs_from_api(api_url: str, headers: dict = None) -> None:
    """
    Fetch logs from an external API, preprocess them, and add to vector DB.

    Args:
        api_url (str): URL of the external logs API.
        headers (dict, optional): Optional headers for the HTTP request.

    Returns:
        None
    """
    try:
        # Send GET request to the external API
        response = requests.get(api_url, headers=headers)

        # Raise HTTPError if the response status is not OK (4xx or 5xx)
        response.raise_for_status()

        # Parse JSON response to Python list/dict
        data = response.json()

        # Validate response is a list of log entries
        if not isinstance(data, list):
            print("API response is not a list of logs.")
            return

        # Preprocess logs: deduplicate, clean, and chunk
        cleaned_logs = preprocess_logs(data)

        # Add processed logs to Chroma vector DB
        add_to_vector_db(cleaned_logs)

        print(f"Fetched and stored {len(cleaned_logs)} logs from API.")

    except requests.RequestException as req_err:
        # Handle HTTP request related errors
        print(f"HTTP Request error while fetching logs: {req_err}")
    except Exception as e:
        # Handle other exceptions
        print(f"Error fetching or processing logs: {e}")
