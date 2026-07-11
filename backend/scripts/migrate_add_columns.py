"""One-off column additions that Base.metadata.create_all() can't do
(it only creates missing tables, never ALTERs existing ones). Safe to
re-run — uses IF NOT EXISTS.
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from sqlalchemy import text

from app.database import engine

STATEMENTS = [
    "ALTER TABLE projects ADD COLUMN IF NOT EXISTS freelance_status VARCHAR(50)",
    "ALTER TABLE build_log_posts ADD COLUMN IF NOT EXISTS github_repo VARCHAR(255)",
]

with engine.begin() as conn:
    for stmt in STATEMENTS:
        conn.execute(text(stmt))
        print("ran:", stmt)

print("Migration complete.")
