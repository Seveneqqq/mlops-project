import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
load_dotenv()

user = os.getenv("DBUSER")
password = os.getenv("DBPASSWORD")
db = os.getenv("DBNAME")


DATABASE_URL = f"mssql+pyodbc://{user}:{password}@mlops-db.database.windows.net/{db}?driver=ODBC+Driver+17+for+SQL+Server"


engine = create_engine(
    DATABASE_URL,
    echo=True,
    pool_pre_ping=True
)


SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()