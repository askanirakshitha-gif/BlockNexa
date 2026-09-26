"""
BlockNexa Backend Server Launcher
=================================
Usage:
  python run_server.py
"""

import sys
import uvicorn

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

if __name__ == "__main__":
    print("=" * 65)
    print("Starting BlockNexa AI Backend Server (FastAPI + Uvicorn)")
    print("Port: 8000 | Interactive Docs: http://127.0.0.1:8000/docs")
    print("=" * 65)
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
