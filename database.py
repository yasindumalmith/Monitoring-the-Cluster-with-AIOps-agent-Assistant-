import os
import psycopg2
import structlog
from contextlib import contextmanager
from dotenv import load_dotenv

load_dotenv()
log = structlog.get_logger()

DATABASE_URL = os.getenv("DATABASE_URL")

@contextmanager
def get_db_connection():
    """
    Context manager that yields a psycopg2 database connection.
    If DATABASE_URL is not set, it safely yields None.
    """
    conn = None
    try:
        if DATABASE_URL:
            conn = psycopg2.connect(DATABASE_URL)
            yield conn
        else:
            log.warning("db.connection.skipped", reason="DATABASE_URL not set in environment")
            yield None
    except Exception as e:
        log.error("db.connection.error", error=str(e))
        yield None
    finally:
        if conn is not None:
            conn.close()
