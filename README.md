# Data Whisperer

Data Whisperer is an AI-powered co-pilot for your data pipelines.  
It answers your questions about pipeline events, failures, and anomalies by combining fast vector search (ChromaDB) with GPT-4 for contextual understanding.

---

## 🚀 Features

✅ Ask pipeline-related questions like:
- "What happened at 3 PM yesterday?"
- "Why did Task X fail?"
- "Any delays in the system?"

✅ ChromaDB for fast vector search  
✅ SentenceTransformer for embeddings  
✅ GPT-4 for intelligent context interpretation  
✅ Modular FastAPI backend

---

## 🧑‍💻 How to Run Locally

## 1️⃣ Clone the repo & set up environment

```bash
git clone https://github.com/yourname/data-whisperer.git
cd data-whisperer/backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## 2️⃣ Add your OpenAI API Key

Create a `.env` file inside `backend/`:

```ini
OPENAI_API_KEY=sk-xxx-your-key-here
```

## 3️⃣ Load pipeline data into Chroma

```bash
python scripts/load_to_chroma.py
```

## 4️⃣ Run the FastAPI backend

```bash
uvicorn app.main:app --reload
```

Access the API at:

```bash
http://127.0.0.1:8000/docs
```

## 🏗️ Project Structure

```bash
data-whisperer/
├── .gitignore
└── backend/
    ├── .env
    ├── app/
    │   ├── api.py
    │   ├── main.py
    │   ├── services.py
    │   ├── vector_db.py
    ├── chroma_data/
    ├── pipeline_data/
    │   └── logs.json
    ├── scripts/
    │   └── load_to_chroma.py
    ├── venv/
    └── README.md
```

## 🔒 Notes

- `.env` and `chroma_data/` are git-ignored for security.
- Replace `logs.json` with your own pipeline data for real use cases.

## 🔥 License

MIT License

## 👑 Author

Built with ❤️ by `Subash Yadav`
Let’s build the future of data pipelines together! 🚀
