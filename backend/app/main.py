from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import router, init_db


app = FastAPI(title="AI Freelance Manager - Finance API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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


app.include_router(router)


