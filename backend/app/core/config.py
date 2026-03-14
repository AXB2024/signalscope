from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    APP_NAME: str = "SignalScope"
    DATABASE_URL: str = "postgresql://signalscope:signalscope@localhost:5432/signalscope"
    REDIS_URL: str = "redis://localhost:6379"
    CORS_ORIGINS: List[str] = ["http://localhost:3000"]

    class Config:
        env_file = ".env"


settings = Settings()
