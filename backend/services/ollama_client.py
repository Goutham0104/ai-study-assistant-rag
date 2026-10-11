"""
Unified LLM client supporting both hosted cloud providers (Groq, OpenAI-compatible APIs)
and self-hosted Ollama.

Priority order:
1. GROQ_API_KEY -> Uses Groq Cloud API (Free tier: Llama 3.3 70B or Gemma 2 9B, ultra-fast)
2. OPENAI_API_KEY -> Uses OpenAI or OpenAI-compatible endpoint (OPENAI_BASE_URL)
3. GEMINI_API_KEY -> Can also use Google Gemini OpenAI-compatible endpoint
4. OLLAMA_BASE_URL -> Falls back to remote or local Ollama instance
"""

import logging
import os
import httpx

logger = logging.getLogger(__name__)

# Environment configurations
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "").strip()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "").strip()
OPENAI_BASE_URL = os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1").rstrip("/")

OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434").rstrip("/")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "gemma3:4b")

# Determine active provider and default model
if GROQ_API_KEY:
    PROVIDER = "groq"
    MODEL_NAME = os.getenv("LLM_MODEL", "llama-3.3-70b-versatile")
elif OPENAI_API_KEY:
    PROVIDER = "openai"
    MODEL_NAME = os.getenv("LLM_MODEL", "gpt-4o-mini")
else:
    PROVIDER = "ollama"
    MODEL_NAME = os.getenv("LLM_MODEL", OLLAMA_MODEL)

REQUEST_TIMEOUT = httpx.Timeout(
    connect=10.0,
    read=120.0,
    write=10.0,
    pool=10.0,
)


async def check_llm_health() -> dict:
    """
    Check connectivity and readiness of the configured LLM provider.
    Works for Groq, OpenAI-compatible APIs, and Ollama.
    """
    result = {
        "provider": PROVIDER,
        "model": MODEL_NAME,
        "reachable": False,
        "detail": "",
    }

    # 1. Groq Cloud Check
    if PROVIDER == "groq":
        try:
            async with httpx.AsyncClient(timeout=REQUEST_TIMEOUT) as client:
                resp = await client.get(
                    "https://api.groq.com/openai/v1/models",
                    headers={"Authorization": f"Bearer {GROQ_API_KEY}"},
                )
                if resp.status_code == 200:
                    result["reachable"] = True
                    result["detail"] = f"Connected to Groq Cloud API ({MODEL_NAME})."
                else:
                    result["detail"] = f"Groq API returned HTTP {resp.status_code}: {resp.text[:100]}"
        except Exception as exc:
            result["detail"] = f"Groq connection check failed: {exc}"
        return result

    # 2. OpenAI / Compatible Check
    if PROVIDER == "openai":
        try:
            async with httpx.AsyncClient(timeout=REQUEST_TIMEOUT) as client:
                resp = await client.get(
                    f"{OPENAI_BASE_URL}/models",
                    headers={"Authorization": f"Bearer {OPENAI_API_KEY}"},
                )
                if resp.status_code == 200:
                    result["reachable"] = True
                    result["detail"] = f"Connected to OpenAI API ({MODEL_NAME})."
                else:
                    result["detail"] = f"OpenAI API returned HTTP {resp.status_code}: {resp.text[:100]}"
        except Exception as exc:
            result["detail"] = f"OpenAI connection check failed: {exc}"
        return result

    # 3. Ollama (Self-hosted or Local) Check
    try:
        async with httpx.AsyncClient(timeout=REQUEST_TIMEOUT) as client:
            resp = await client.get(OLLAMA_BASE_URL)
            ollama_up = resp.status_code == 200

            tags_resp = await client.get(f"{OLLAMA_BASE_URL}/api/tags")
            if tags_resp.status_code != 200:
                result["detail"] = f"Could not list Ollama models (HTTP {tags_resp.status_code})."
                return result

            models = tags_resp.json().get("models", [])
            model_names = [m.get("name", "") for m in models]
            model_available = any(
                name == MODEL_NAME or name.startswith(f"{MODEL_NAME}:")
                for name in model_names
            )

            result["reachable"] = ollama_up and model_available
            if model_available:
                result["detail"] = f"Ollama is running at {OLLAMA_BASE_URL} and {MODEL_NAME} is available."
            else:
                result["detail"] = (
                    f"Model '{MODEL_NAME}' not found in Ollama. "
                    f"Available models: {model_names}."
                )
    except httpx.ConnectError:
        result["detail"] = f"Cannot connect to Ollama at {OLLAMA_BASE_URL}."
    except httpx.TimeoutException:
        result["detail"] = "Ollama connection timed out."
    except Exception as exc:
        logger.exception("Unexpected Ollama health-check error")
        result["detail"] = f"Ollama check failed: {exc}"

    return result


async def check_ollama_health() -> dict:
    """Backward compatibility alias for health check."""
    res = await check_llm_health()
    return {
        "ollama_reachable": res["reachable"],
        "model_available": res["reachable"],
        "detail": res["detail"],
        "provider": res["provider"],
        "model": res["model"],
    }


async def generate_chat_response(
    system_prompt: str,
    user_message: str,
) -> str:
    """
    Generate chat completion from the active provider (Groq, OpenAI, or Ollama).
    """
    # --- Option A: Groq Cloud ---
    if PROVIDER == "groq":
        payload = {
            "model": MODEL_NAME,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message},
            ],
            "temperature": 0.2,
        }
        try:
            async with httpx.AsyncClient(timeout=REQUEST_TIMEOUT) as client:
                resp = await client.post(
                    "https://api.groq.com/openai/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {GROQ_API_KEY}",
                        "Content-Type": "application/json",
                    },
                    json=payload,
                )
        except Exception as exc:
            raise RuntimeError(f"Failed to connect to Groq Cloud API: {exc}") from exc

        if resp.status_code != 200:
            raise RuntimeError(f"Groq API error ({resp.status_code}): {resp.text[:300]}")

        data = resp.json()
        content = data.get("choices", [{}])[0].get("message", {}).get("content", "").strip()
        if not content:
            raise RuntimeError("Groq returned an empty response.")
        return content

    # --- Option B: OpenAI / Compatible endpoint ---
    if PROVIDER == "openai":
        payload = {
            "model": MODEL_NAME,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message},
            ],
            "temperature": 0.2,
        }
        try:
            async with httpx.AsyncClient(timeout=REQUEST_TIMEOUT) as client:
                resp = await client.post(
                    f"{OPENAI_BASE_URL}/chat/completions",
                    headers={
                        "Authorization": f"Bearer {OPENAI_API_KEY}",
                        "Content-Type": "application/json",
                    },
                    json=payload,
                )
        except Exception as exc:
            raise RuntimeError(f"Failed to connect to OpenAI API: {exc}") from exc

        if resp.status_code != 200:
            raise RuntimeError(f"OpenAI API error ({resp.status_code}): {resp.text[:300]}")

        data = resp.json()
        content = data.get("choices", [{}])[0].get("message", {}).get("content", "").strip()
        if not content:
            raise RuntimeError("OpenAI returned an empty response.")
        return content

    # --- Option C: Ollama ---
    ollama_endpoint = f"{OLLAMA_BASE_URL}/api/chat"
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
                ollama_endpoint,
                json=payload,
            )
    except httpx.ConnectError as exc:
        raise RuntimeError(
            f"Cannot connect to Ollama at {OLLAMA_BASE_URL}. "
            "Please ensure Ollama is running or configure GROQ_API_KEY / OPENAI_API_KEY for cloud inference."
        ) from exc
    except httpx.TimeoutException as exc:
        raise RuntimeError("Ollama request timed out. Model may be loading.") from exc

    if resp.status_code != 200:
        raise RuntimeError(f"Ollama returned HTTP {resp.status_code}: {resp.text[:300]}")

    data = resp.json()
    content = data.get("message", {}).get("content", "").strip()
    if not content:
        raise RuntimeError("Ollama returned an empty response.")
    return content


async def chat_with_ollama(system_prompt: str, user_message: str) -> str:
    """Backward compatibility alias for chat_with_ollama."""
    return await generate_chat_response(system_prompt, user_message)