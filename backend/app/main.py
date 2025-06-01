from fastapi import FastAPI
from app.api import router

app = FastAPI(title="Data Whisperer API")
app.include_router(router)
