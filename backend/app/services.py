import os
from dotenv import load_dotenv
from openai import OpenAI
from app.vector_db import get_context

load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")

client = OpenAI(api_key=api_key)

async def ask_data_whisperer(question: str):
    context_list = get_context(question)

    if not context_list:
        context_str = "No matching logs were found."
    else:
        context_str = "\n".join(context_list)

    prompt = f"""
You are Data Whisperer, an AI assistant for pipeline data. Answer the user question based on the following logs. If the logs are relevant, explain the answer clearly. If they are not relevant, explain why, and suggest what kind of question the user could ask to get better results.

Logs:
{context_str}

User question: {question}

Respond in a helpful, concise, and clear manner.
"""

    try:
        response = client.chat.completions.create(
            model="gpt-4-turbo",
            messages=[{"role": "user", "content": prompt}]
        )
        answer = response.choices[0].message.content.strip()
        return {"answer": answer}
    except Exception as e:
        print("GPT Error:", e)
        return {"answer": "Error calling GPT."}
