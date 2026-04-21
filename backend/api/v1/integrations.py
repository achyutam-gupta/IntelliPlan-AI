import requests
import logging
from fastapi import APIRouter, Request, Response, HTTPException
from fastapi.responses import JSONResponse
import os
import time

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("integrations_proxy")

router = APIRouter()

@router.api_route("/jira/{path:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def jira_proxy(path: str, request: Request):
    """
    Robust proxy for Jira Cloud API.
    Expects 'x-target-base-url' and 'Authorization' headers from the client.
    """
    target_base = request.headers.get("x-target-base-url")
    if not target_base:
        # Fallback to a default for testing, but warn in logs
        target_base = "https://ailearning2026.atlassian.net"
        logger.warning(f"Jira Proxy: No 'x-target-base-url' provided. Falling back to {target_base}")
    
    url = f"{target_base.rstrip('/')}/{path}"
    
    # Forward headers, excluding host and sensitive platform headers
    excluded_headers = ["host", "accept-encoding", "content-length", "connection"]
    headers = {k: v for k, v in request.headers.items() if k.lower() not in excluded_headers}
    
    # Ensure Authorization is present
    if "authorization" not in [k.lower() for k in headers.keys()]:
        logger.error("Jira Proxy: Missing Authorization header")
        raise HTTPException(status_code=401, detail="Authentication credentials (Authorization header) required for Jira proxy.")

    try:
        start_time = time.time()
        body = await request.body()
        resp = requests.request(
            method=request.method,
            url=url,
            headers=headers,
            data=body,
            params=request.query_params,
            timeout=15
        )
        duration = time.time() - start_time
        logger.info(f"Jira Proxy: {request.method} {path} -> {resp.status_code} ({duration:.2f}s)")
        
        return Response(
            content=resp.content,
            status_code=resp.status_code,
            headers={k: v for k, v in resp.headers.items() if k.lower() not in ["content-encoding", "transfer-encoding", "content-length"]}
        )
    except requests.exceptions.Timeout:
        logger.error(f"Jira Proxy: Request to {url} timed out")
        raise HTTPException(status_code=504, detail="Jira API request timed out (gateway timeout).")
    except Exception as e:
        logger.error(f"Jira Proxy Error: {str(e)}")
        raise HTTPException(status_code=502, detail=f"Jira Proxy Error: {str(e)}")

@router.api_route("/llm/{provider}/{path:path}", methods=["POST"])
async def llm_proxy(provider: str, path: str, request: Request):
    """
    Proxy for LLM providers (Groq, OpenAI, etc.)
    """
    providers = {
        "groq": "https://api.groq.com/openai/v1",
        "nvidia": "https://integrate.api.nvidia.com/v1",
        "openai": "https://api.openai.com/v1"
    }
    
    if provider not in providers:
        logger.error(f"LLM Proxy: Unsupported provider '{provider}'")
        raise HTTPException(status_code=400, detail=f"Unsupported LLM provider: {provider}")
        
    url = f"{providers[provider]}/{path}"
    
    excluded_headers = ["host", "accept-encoding", "content-length", "connection"]
    headers = {k: v for k, v in request.headers.items() if k.lower() not in excluded_headers}
    
    try:
        start_time = time.time()
        body = await request.body()
        resp = requests.request(
            method=request.method,
            url=url,
            headers=headers,
            data=body,
            params=request.query_params,
            timeout=45 # LLMs need longer timeouts
        )
        duration = time.time() - start_time
        logger.info(f"LLM Proxy ({provider}): {path} -> {resp.status_code} ({duration:.2f}s)")
        
        return Response(
            content=resp.content,
            status_code=resp.status_code,
            headers={k: v for k, v in resp.headers.items() if k.lower() not in ["content-encoding", "transfer-encoding", "content-length"]}
        )
    except requests.exceptions.Timeout:
        logger.error(f"LLM Proxy ({provider}): Timeout for {url}")
        raise HTTPException(status_code=504, detail=f"LLM Provider ({provider}) request timed out.")
    except Exception as e:
        logger.error(f"LLM Proxy ({provider}) Error: {str(e)}")
        raise HTTPException(status_code=502, detail=f"LLM Proxy Error: {str(e)}")
