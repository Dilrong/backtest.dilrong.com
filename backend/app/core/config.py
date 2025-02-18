from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "BacktestAPI"
    LOG_LEVEL: str = "INFO"
    LOG_DIR: str = "./logs"


settings = Settings()
