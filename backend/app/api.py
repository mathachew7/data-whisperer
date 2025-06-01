from fastapi import APIRouter
from pydantic import BaseModel
from app.services import ask_data_whisperer

router = APIRouter()

class QuestionRequest(BaseModel):
    question: str

@router.post("/ask")
async def ask(request: QuestionRequest):
    return await ask_data_whisperer(request.question)
