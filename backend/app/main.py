from fastapi import FastAPI
from .routes import router

app = FastAPI(title="SignalScope API")

app.include_router(router)

@app.get("/")
def home():
    return {"message": "SignalScope API running"}
