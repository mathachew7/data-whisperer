import json
import sys
import os

# Fix path for Chroma + vector_db import
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from app.vector_db import add_to_vector_db

def load_logs():
    file_path = os.path.join(os.path.dirname(__file__), '..', 'pipeline_data', 'logs.json')
    with open(file_path) as f:
        data = json.load(f)
        add_to_vector_db(data)
        print("Logs loaded into Chroma.")

if __name__ == "__main__":
    load_logs()
