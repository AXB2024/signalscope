from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import router

app = FastAPI(title="SignalScope API")

app.add_middleware(
    CORSMiddleware,
    # Update these URLs to match whatever port your React app runs on!
    allow_origins=["http://localhost:3000", "http://localhost:5173", "https://signalscope-two.vercel.app"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

@app.get("/")
def home():
    return {"message": "SignalScope API running"}
