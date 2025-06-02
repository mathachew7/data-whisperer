import os
from dotenv import load_dotenv
from openai import OpenAI
from app.core.vector_db import get_context  # Import function to query vector DB for context

# Load environment variables (like API keys) from .env file
load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")

# Initialize OpenAI client with the loaded API key
client = OpenAI(api_key=api_key)

async def ask_data_whisperer(question: str):
    """
    Handle user question by:
    - Retrieving relevant logs from Chroma vector DB
    - Constructing a detailed prompt for GPT based on logs and question
    - Sending prompt to OpenAI chat completion API
    - Returning GPT's response or error message

    Args:
        question (str): User's query

    Returns:
        dict: {"answer": response_text} or error message
    """
    # Fetch relevant logs from vector DB to build context for GPT
    context_list = get_context(question)

    # Join context or fallback message if no logs found
    if not context_list:
        context_str = "No matching logs were found."
    else:
        context_str = "\n".join(context_list)

    # Compose prompt to guide GPT to answer clearly and helpfully
    prompt = f"""
You are Data Whisperer, an AI assistant for pipeline data. Answer the user question based on the following logs. If the logs are relevant, explain the answer clearly. If they are not relevant, explain why, and suggest what kind of question the user could ask to get better results.

Logs:
{context_str}

User question: {question}

Respond in a helpful, concise, and clear manner.
"""

    try:
        # Call OpenAI chat completion endpoint with the constructed prompt
        response = client.chat.completions.create(
            model="gpt-4o-mini",  # Specify GPT model to use
            messages=[{"role": "user", "content": prompt}]
        )
        # Extract the textual answer from GPT response
        answer = response.choices[0].message.content.strip()
        return {"answer": answer}

    except Exception as e:
        # Print error and return generic error message
        print("GPT Error:", e)
        return {"answer": "Error calling GPT."}
