import json
import os
import uuid
import psycopg

DATABASE_URL = os.environ["DATABASE_URL"]
JSON_PATH = os.environ.get("JSON_PATH", "data/publications.json")

with open(JSON_PATH, encoding="utf-8") as f:
    data = json.load(f)

items = data if isinstance(data, list) else data.get("publications", [])

with psycopg.connect(DATABASE_URL) as conn:
    with conn.cursor() as cur:
        for item in items:
            pid = item.get("id") or str(uuid.uuid4())
            cur.execute(
                """
                INSERT INTO publications
                    (id, type, title, description, business_name, category,
                     hours, location, contact, status, created_at, reviewed_at)
                VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
                ON CONFLICT (id) DO NOTHING
                """,
                (
                    pid,
                    item.get("type", "servicio"),
                    item.get("title") or item.get("businessName") or "Sin título",
                    item.get("description") or "",
                    item.get("businessName") or item.get("business_name") or "Sin nombre",
                    item.get("category") or "otros",
                    item.get("hours"),
                    item.get("location"),
                    item.get("contact"),
                    item.get("status", "pendiente"),
                    item.get("createdAt"),
                    item.get("reviewedAt"),
                ),
            )
    conn.commit()

print(f"Migración terminada: {len(items)} registros procesados.")
