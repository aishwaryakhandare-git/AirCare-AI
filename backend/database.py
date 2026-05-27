import sqlite3
import os
import tempfile
from pathlib import Path

BASE_DIR = Path(__file__).parent
DATABASE_PATH = Path(tempfile.gettempdir()) / "aircare.db" if os.getenv("VERCEL") else BASE_DIR / "aircare.db"
SCHEMA_PATH = BASE_DIR / "schema.sql"


def get_connection():
    connection = sqlite3.connect(DATABASE_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def setup_database():
    connection = get_connection()

    with open(SCHEMA_PATH, "r", encoding="utf-8") as schema_file:
        connection.executescript(schema_file.read())

    connection.commit()
    connection.close()


def rows_to_dicts(rows):
    return [dict(row) for row in rows]
