import os
from pathlib import Path
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from dotenv import load_dotenv
from .routes import router, init_db
from .auth_routes import router as auth_router

# Load environment variables
load_dotenv()


app = FastAPI(title="AI Freelance Manager - Finance API", version="0.1.0")

# Configure CORS based on environment
allowed_origins = os.getenv("ALLOWED_ORIGINS", "*")
if allowed_origins != "*":
    allowed_origins = [origin.strip() for origin in allowed_origins.split(",")]
else:
    allowed_origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


@app.on_event("startup")
def on_startup() -> None:
    init_db()


# Mount static files for frontend assets BEFORE including router
frontend_dist = Path(__file__).parent.parent.parent / "frontend" / "dist"
if frontend_dist.exists():
    # Serve static assets
    app.mount("/assets", StaticFiles(directory=str(frontend_dist / "assets")), name="assets")
    
    # Serve vite.svg
    @app.get("/vite.svg")
    async def serve_vite_svg():
        vite_svg = frontend_dist / "vite.svg"
        if vite_svg.exists():
            return FileResponse(vite_svg)
        return {"error": "Not found"}

# Include API routes
app.include_router(auth_router)
app.include_router(router)

# Custom 404 handler to serve SPA for non-API routes
@app.exception_handler(404)
async def not_found_handler(request: Request, exc):
    # If it's an API route, return JSON error
    if request.url.path.startswith("/api/") or request.url.path.startswith("/auth/") or request.url.path in ["/health", "/categories", "/transactions", "/balance", "/export/csv"] or "/report/" in request.url.path:
        return JSONResponse(
            status_code=404,
            content={"detail": "Not found"}
        )
    
    # Otherwise, serve the SPA
    index_file = frontend_dist / "index.html"
    if index_file.exists():
        return FileResponse(index_file)
    return JSONResponse(
        status_code=404,
        content={"detail": "Frontend not found"}
    )


