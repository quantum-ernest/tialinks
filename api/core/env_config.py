from pydantic import EmailStr
from pydantic_settings import BaseSettings, SettingsConfigDict


class EnvConfig(BaseSettings):
    model_config = SettingsConfigDict(env_file="dev.env", env_file_encoding="utf-8")
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB_NAME: str
    POSTGRES_HOST: str
    POSTGRES_PORT: str
    AUTH_SECRETE_KEY: str
    AUTH_ALGORITHM: str
    EMAIL_SERVER_HOST: str
    EMAIL_SERVER_PORT: int
    EMAIL_SERVER_USE_TLS: bool
    EMAIL_SERVER_ADDRESS: EmailStr
    EMAIL_HOST_PASSWORD: str
    BASE_URL: str
    FRONTEND_BASE_URL: str
    REDIS_HOST: str | None = "localhost"
    REDIS_PORT: int | None = "6379"


env = EnvConfig()
