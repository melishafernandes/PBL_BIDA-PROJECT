from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    fred_api_key: str = ""
    database_url: str = "sqlite:///./investiq.db"

    class Config:
        env_file = ".env"

settings = Settings()