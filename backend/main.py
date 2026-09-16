from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .models_service import service
from .routes import router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Load ML models and spatial index
    print("Starting MOIL Mining Decision Support Backend Service...")
    service.load()
    yield
    print("Shutting down MOIL Mining Decision Support Backend Service.")


app = FastAPI(
    title="AI-Based Manganese Exploration & Production Planning Decision Support System",
    description="Industrial decision-support backend for MOIL SIH 2026 Problem Statement 26009",
    version="2.4.0",
    lifespan=lifespan,
)

# Enable CORS for frontend Vite dev server and production builds
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.get("/")
def root():
    return {
        "service": "MOIL Manganese Decision Support System API",
        "problem_statement": "SIH 2026 PS 26009",
        "docs": "/docs",
        "status": service.get_health()["status"],
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=False)
