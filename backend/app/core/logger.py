# app/core/logger.py

import sqlite3
import json
import os
from datetime import datetime
from threading import Lock

class SQLiteLogger:
    """
    Thread-safe Singleton Logger using SQLite for persisting logs.
    Stores timestamp, event type, message, and optional metadata as JSON.
    """
    _instance = None
    _lock = Lock()

    def __new__(cls, db_path="logs/system_logs.db"):
        # Ensure only one instance is created (Singleton)
        if not cls._instance:
            with cls._lock:
                if not cls._instance:
                    cls._instance = super().__new__(cls)
                    cls._instance._init(db_path)
        return cls._instance

    def _init(self, db_path):
        # Ensure directory exists for DB
        os.makedirs(os.path.dirname(db_path), exist_ok=True)

        # Connect to SQLite DB (allowing multithreaded access)
        self.conn = sqlite3.connect(db_path, check_same_thread=False)

        # Create logs table if not exists
        self.conn.execute('''
            CREATE TABLE IF NOT EXISTS logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TEXT NOT NULL,
                event_type TEXT NOT NULL,
                message TEXT NOT NULL,
                metadata TEXT
            )
        ''')
        self.conn.commit()

    def log(self, event_type: str, message: str, metadata: dict = None):
        """
        Insert a log record into the database.

        Args:
            event_type (str): Type/category of the event (e.g., "error", "upload").
            message (str): Human-readable log message.
            metadata (dict, optional): Additional structured data.
        """
        timestamp = datetime.utcnow().isoformat()
        metadata_json = json.dumps(metadata) if metadata else None
        with self._lock:
            self.conn.execute(
                'INSERT INTO logs (timestamp, event_type, message, metadata) VALUES (?, ?, ?, ?)',
                (timestamp, event_type, message, metadata_json)
            )
            self.conn.commit()

    def fetch_logs(self, limit=100):
        """
        Retrieve the most recent logs from the database.

        Args:
            limit (int): Maximum number of logs to return.

        Returns:
            List[dict]: List of log records with timestamp, event_type, message, metadata.
        """
        cursor = self.conn.execute(
            'SELECT timestamp, event_type, message, metadata FROM logs ORDER BY id DESC LIMIT ?',
            (limit,)
        )
        rows = cursor.fetchall()
        results = []
        for row in rows:
            results.append({
                "timestamp": row[0],
                "event_type": row[1],
                "message": row[2],
                "metadata": json.loads(row[3]) if row[3] else None
            })
        return results


# Singleton instance for usage across the app
logger = SQLiteLogger()

# Usage example:
# logger.log("system_start", "System started successfully.")
