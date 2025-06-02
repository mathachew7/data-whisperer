# Data Whisperer

**Data Whisperer** is an AI-powered co-pilot for your data pipelines.  
It answers your questions about pipeline events, failures, and anomalies by combining fast vector search (ChromaDB) with GPT-4 for contextual understanding.

---

## 🚀 Features

✅ Ask pipeline-related questions like:
- "What happened at 3 PM yesterday?"
- "Why did Task X fail?"
- "Any delays in the system?"

- ✅ Upload logs via JSON or CSV  
- ✅ ChromaDB for fast vector search  
- ✅ SentenceTransformer for embeddings  
- ✅ GPT-4 for intelligent context interpretation  
- ✅ Modular FastAPI backend  
- ✅ System logs with SQLite for debugging and monitoring  
- ✅ Pydantic validation for input data  
- ✅ API endpoints for logs, questions, and system logs  
-✅ JSON and CSV file support for uploading pipeline data

---

## 🧑‍💻 How to Run Locally

### 1️⃣ Clone the repo & set up environment

```bash
git clone https://github.com/yourname/data-whisperer.git
cd data-whisperer/backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

```


### 2️⃣ Add your OpenAI API Key

Create a `.env` file inside `backend/`:

```ini
OPENAI_API_KEY=sk-xxx-your-key-here
```

### 3️⃣ Load pipeline data into Chroma (optional for testing)

```bash
python scripts/load_to_chroma.py
```

### 4️⃣ Run the FastAPI backend

```bash
uvicorn app.main:app --reload
```

Access the API at:

```bash
http://127.0.0.1:8000/docs
```

---

## 📦 API Endpoints

| Endpoint       | Method | Description                                                                                           |
|----------------|--------|-------------------------------------------------------------------------------------------------------|
| `/ask`         | POST   | Ask questions about logs and pipelines                                                                |
| `/upload`      | POST   | Upload logs in JSON/CSV format                                                                        |
| `/system-logs` | GET    | etrieve internal system logs stored in SQLite (e.g., system events, queries, API calls).              |

Example
```json
[
  { "id": "log-1", "content": "Task X failed at 3 PM." },
  { "id": "log-2", "content": "Pipeline Y delayed due to retries." }
]

```
---

## 🏗️ Project Structure

```bash
data-whisperer/
├── .gitignore
└── backend/
    ├── .env
    ├── app/
    │   ├── api/
    │   │   ├── routes.py
    │   │   ├── api_fetcher.py
    │   ├── core/
    │   │   ├── logger.py
    │   │   ├── services.py
    │   │   ├── vector_db.py
    │   │   ├── preprocessor.py
    │   ├── main.py
    ├── chroma_data/
    ├── logs/
    │   └── system_logs.db
    ├── pipeline_data/
    │   └── logs.json
    ├── scripts/
    │   └── load_to_chroma.py
    ├── venv/
    └── README.md
```

---

## 🔒 Notes

- `.env`, `chroma_data/`, and `logs/system_logs.db` are git-ignored for security.

- Replace `logs.json` with your own pipeline data for real use cases.

- All system activities (e.g., API calls, file uploads, questions) are logged in `logs/system_logs.db`.

- The `/system-logs` endpoint provides easy access to these logs for audit and debugging purposes.

---
## 🌐 Example Questions

```json
POST /ask
{
  "question": "What caused the delay in Task Y yesterday?"
}

```
---

## 🔥 License

MIT License

---

## 👑 Author

Built with ❤️ by **Subash Yadav**  
Let’s build the future of data pipelines together! 🚀
