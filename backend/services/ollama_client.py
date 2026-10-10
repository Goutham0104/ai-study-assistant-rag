"""
Async client for the local Ollama chat API.

Sends chat-completion requests to http://localhost:11434/api/chat
using the gemma3:4b model. Includes health-check support.
"""

import logging

import httpx

logger = logging.getLogger(__name__)

OLLAMA_BASE_URL = "http://localhost:11434"
OLLAMA_CHAT_ENDPOINT = f"{OLLAMA_BASE_URL}/api/chat"
MODEL_NAME = "gemma3:4b"

# Timeout: Ollama on 16 GB RAM with gemma3:4b can take a while on first load
REQUEST_TIMEOUT = httpx.Timeout(
    connect=10.0,
    read=120.0,    # model inference can be slow
    write=10.0,
    pool=10.0,
)


async def check_ollama_health() -> dict:
    """
    Check whether Ollama is reachable and the model is available.

    Returns a dict with keys: status, ollama_reachable, model_available, detail
    """
    result = {
        "ollama_reachable": False,
        "model_available": False,
        "detail": "",
    }

    try:
        async with httpx.AsyncClient(timeout=REQUEST_TIMEOUT) as client:
            # Basic reachability — Ollama returns a page at GET /
            resp = await client.get(OLLAMA_BASE_URL)
            result["ollama_reachable"] = resp.status_code == 200

            # Check if the model is in the local model list
            tags_resp = await client.get(f"{OLLAMA_BASE_URL}/api/tags")
            if tags_resp.status_code == 200:
                models = tags_resp.json().get("models", [])
                model_names = [m.get("name", "") for m in models]
                # Ollama model names may have a tag suffix like ":latest"
                result["model_available"] = any(
                    MODEL_NAME in name for name in model_names
                )
                if not result["model_available"]:
                    result["detail"] = (
                        f"Model '{MODEL_NAME}' not found. "
                        f"Available: {model_names}. "
                        f"Run: ollama pull {MODEL_NAME}"
                    )
                else:
                    result["detail"] = "Ollama is running and model is available."
            else:
                result["detail"] = f"Could not list models (HTTP {tags_resp.status_code})."

    except httpx.ConnectError:
        result["detail"] = (
            "Cannot connect to Ollama. "
            "Make sure Ollama is running: https://ollama.com"
        )
    except httpx.TimeoutException:
        result["detail"] = "Ollama connection timed out."
    except Exception as exc:
        result["detail"] = f"Unexpected error checking Ollama: {exc}"

    return result


async def chat_with_ollama(system_prompt: str, user_message: str) -> str:
    """
    Send a chat request to Ollama and return the assistant's reply text.

    Raises RuntimeError on connection or model errors so the caller
    can return an appropriate HTTP error response.
    """
    payload = {
        "model": MODEL_NAME,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message},
        ],
        "stream": False,
    }

    try:
        async with httpx.AsyncClient(timeout=REQUEST_TIMEOUT) as client:
            resp = await client.post(
                OLLAMA_CHAT_ENDPOINT,
                json=payload,
            )
    except httpx.ConnectError as exc:
        raise RuntimeError(
            "Cannot connect to Ollama. Is it running on localhost:11434?"
        ) from exc
    except httpx.TimeoutException as exc:
        raise RuntimeError(
            "Ollama request timed out. The model may be loading — try again."
        ) from exc

    if resp.status_code != 200:
        raise RuntimeError(
            f"Ollama returned HTTP {resp.status_code}: {resp.text[:300]}"
        )

    data = resp.json()
    content = data.get("message", {}).get("content", "").strip()

    if not content:
        raise RuntimeError("Ollama returned an empty response.")

    return content
