from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.api import (
    datasets,
    profiling,
    drift,
    health,
    explanation
)

app = FastAPI(title="AI Data Drift Monitoring Platform")

# ✅ CORS CONFIGURATION (VERY IMPORTANT)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173","http://localhost:5174"],  # frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(datasets.router)
app.include_router(profiling.router)
app.include_router(drift.router)
app.include_router(health.router)
app.include_router(explanation.router)