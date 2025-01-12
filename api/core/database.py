from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import redis
from core import env

redis_db = redis.Redis(host=env.REDIS_HOST, port=env.REDIS_PORT, decode_responses=True)

DATABASE_URL = f"postgresql://{env.POSTGRES_USER}:{env.POSTGRES_PASSWORD}@{env.POSTGRES_HOST}:{env.POSTGRES_PORT}/{env.POSTGRES_DB_NAME}"
engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(bind=engine)


def get_db_session():
    db_session = SessionLocal()
    try:
        yield db_session
    finally:
        db_session.close()
