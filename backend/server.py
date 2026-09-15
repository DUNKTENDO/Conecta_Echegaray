import base64
import hashlib
import hmac
import os
import secrets
from contextlib import asynccontextmanager
from pathlib import Path
from uuid import UUID

import psycopg
from fastapi import FastAPI, File, HTTPException, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from starlette.middleware.sessions import SessionMiddleware


PROJECT_ROOT = Path(__file__).resolve().parent.parent
FRONTEND_DIR = PROJECT_ROOT / "Conecta_Echegaray"
UPLOADS_DIR = PROJECT_ROOT / "uploads"
SCHEMA_PATH = PROJECT_ROOT / "database" / "schema.sql"

DATABASE_URL = os.environ.get("DATABASE_URL", "postgresql://conecta:conecta@db:5432/conecta_echegaray")
SESSION_SECRET = os.environ.get("SESSION_SECRET", "")
ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "")
COOKIE_SECURE = os.environ.get("COOKIE_SECURE", "false").lower() == "true"
MAX_IMAGE_BYTES = 5 * 1024 * 1024
ALLOWED_TYPES = {"noticia", "evento", "aviso", "servicio", "comercio", "compra-venta", "iniciativa"}
DIRECTORY_TYPES = {"comercio", "servicio"}
ALLOWED_CATEGORIES = {"alimentos", "servicios", "salud", "hogar", "educacion"}
IMAGE_TYPES = {"image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp"}


def get_connection():
    return psycopg.connect(DATABASE_URL, row_factory=psycopg.rows.dict_row)


def password_hash(password: str, salt: bytes | None = None) -> str:
    salt = salt or secrets.token_bytes(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, 600_000)
    return "pbkdf2_sha256$600000$%s$%s" % (
        base64.b64encode(salt).decode(), base64.b64encode(digest).decode()
    )


def password_matches(password: str, stored: str) -> bool:
    try:
        algorithm, iterations, encoded_salt, encoded_digest = stored.split("$", 3)
        if algorithm != "pbkdf2_sha256":
            return False
        salt = base64.b64decode(encoded_salt)
        calculated = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, int(iterations))
        return hmac.compare_digest(calculated, base64.b64decode(encoded_digest))
    except (ValueError, TypeError):
        return False


def initialize_database() -> None:
    if not SESSION_SECRET or not ADMIN_EMAIL or not ADMIN_PASSWORD:
        raise RuntimeError("SESSION_SECRET, ADMIN_EMAIL y ADMIN_PASSWORD son obligatorios.")
    with get_connection() as conn, conn.cursor() as cursor:
        cursor.execute(SCHEMA_PATH.read_text(encoding="utf-8"))
        cursor.execute("SELECT id FROM admin_users WHERE email = %s", (ADMIN_EMAIL.lower(),))
        if not cursor.fetchone():
            cursor.execute(
                "INSERT INTO admin_users (email, password_hash) VALUES (%s, %s)",
                (ADMIN_EMAIL.lower(), password_hash(ADMIN_PASSWORD)),
            )
        conn.commit()


@asynccontextmanager
async def lifespan(_: FastAPI):
    UPLOADS_DIR.mkdir(exist_ok=True)
    initialize_database()
    yield

app = FastAPI(title="Conecta Echegaray API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://dunktendo.github.io",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    SessionMiddleware,
    secret_key=SESSION_SECRET or "configure-a-session-secret-before-starting",
    https_only=COOKIE_SECURE,
    same_site="lax",
)

def require_admin(request: Request) -> str:
    email = request.session.get("admin_email")
    if not email:
        raise HTTPException(status_code=401, detail="Inicia sesión para continuar.")
    return email


def validate_text(value: str | None, field: str, maximum: int, required: bool = False) -> str | None:
    result = (value or "").strip()
    if required and not result:
        raise HTTPException(status_code=422, detail=f"{field} es obligatorio.")
    if len(result) > maximum:
        raise HTTPException(status_code=422, detail=f"{field} supera el máximo de {maximum} caracteres.")
    return result or None


async def save_image(image: UploadFile | None) -> str | None:
    if image is None or not image.filename:
        return None
    extension = IMAGE_TYPES.get(image.content_type or "")
    if not extension:
        raise HTTPException(status_code=422, detail="La imagen debe ser JPG, PNG o WEBP.")
    content = await image.read()
    if not content or len(content) > MAX_IMAGE_BYTES:
        raise HTTPException(status_code=422, detail="La imagen debe pesar entre 1 byte y 5 MB.")
    filename = f"{secrets.token_urlsafe(18)}{extension}"
    (UPLOADS_DIR / filename).write_bytes(content)
    return f"/uploads/{filename}"


@app.get("/api/health")
def healthcheck():
    with get_connection() as conn, conn.cursor() as cursor:
        cursor.execute("SELECT 1")
    return {"status": "ok"}


@app.post("/api/auth/login")
async def login(request: Request):
    data = await request.json()
    email = validate_text(data.get("email"), "El correo", 254, required=True)
    password = validate_text(data.get("password"), "La contraseña", 256, required=True)
    with get_connection() as conn, conn.cursor() as cursor:
        cursor.execute("SELECT email, password_hash FROM admin_users WHERE email = %s", (email.lower(),))
        admin = cursor.fetchone()
    if not admin or not password_matches(password, admin["password_hash"]):
        raise HTTPException(status_code=401, detail="Correo o contraseña incorrectos.")
    request.session.clear()
    request.session["admin_email"] = admin["email"]
    return {"email": admin["email"]}


@app.post("/api/auth/logout")
def logout(request: Request):
    request.session.clear()
    return {"ok": True}


@app.get("/api/auth/me")
def current_admin(request: Request):
    return {"email": require_admin(request)}


@app.post("/api/publications", status_code=201)
async def create_publication(
    request: Request,
    image: UploadFile | None = File(default=None),
):
    form = await request.form()
    publication_type = validate_text(form.get("type"), "El tipo", 20, required=True)
    if publication_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=422, detail="El tipo de publicación no es válido.")
    title = validate_text(form.get("title"), "El título", 100, required=True)
    description = validate_text(form.get("description"), "La descripción", 1000, required=True)
    business_name = validate_text(form.get("businessName"), "El nombre del comercio", 100)
    category = validate_text(form.get("category"), "La categoría", 50)
    if publication_type in DIRECTORY_TYPES:
        if not business_name or category not in ALLOWED_CATEGORIES:
            raise HTTPException(status_code=422, detail="Comercio/servicio requiere nombre y categoría válidos.")
    image_path = await save_image(image)
    values = (
        publication_type, title, description, business_name, category,
        validate_text(form.get("hours"), "El horario", 100),
        validate_text(form.get("location"), "La ubicación", 150),
        validate_text(form.get("contact"), "El contacto", 150), image_path,
        validate_text(form.get("eventDate"), "La fecha del evento", 10),
        validate_text(form.get("eventTime"), "La hora del evento", 8),
    )
    with get_connection() as conn, conn.cursor() as cursor:
        cursor.execute(
            """INSERT INTO publications
               (type, title, description, business_name, category, hours, location, contact, image_path, event_date, event_time)
               VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s) RETURNING *""",
            values,
        )
        publication = cursor.fetchone()
        conn.commit()
    return publication


@app.get("/api/publications")
def list_publications(request: Request, status: str = "pendiente"):
    require_admin(request)
    if status not in {"pendiente", "aprobada", "rechazada"}:
        raise HTTPException(status_code=422, detail="Estado no válido.")
    with get_connection() as conn, conn.cursor() as cursor:
        cursor.execute("SELECT * FROM publications WHERE status = %s ORDER BY created_at DESC", (status,))
        return cursor.fetchall()


@app.get("/api/publications/public")
def list_public_publications(types: str = ""):
    requested_types = [item.strip() for item in types.split(",") if item.strip()]
    if requested_types and any(item not in ALLOWED_TYPES for item in requested_types):
        raise HTTPException(status_code=422, detail="Tipo de publicación no válido.")
    query = """SELECT id, type, title, description, location, contact, image_path,
                      event_date, event_time, created_at
               FROM publications WHERE status = 'aprobada'"""
    parameters: tuple = ()
    if requested_types:
        query += " AND type = ANY(%s)"
        parameters = (requested_types,)
    query += " ORDER BY COALESCE(event_date, created_at::date) DESC, created_at DESC"
    with get_connection() as conn, conn.cursor() as cursor:
        cursor.execute(query, parameters)
        return cursor.fetchall()


@app.get("/api/publications/public/{publication_id}")
def get_public_publication(publication_id: UUID):
    with get_connection() as conn, conn.cursor() as cursor:
        cursor.execute(
            """SELECT id, type, title, description, location, contact, image_path,
                      event_date, event_time, created_at
               FROM publications WHERE id = %s AND status = 'aprobada'""",
            (publication_id,),
        )
        publication = cursor.fetchone()
    if not publication:
        raise HTTPException(status_code=404, detail="Publicación no encontrada.")
    return publication


@app.patch("/api/publications/{publication_id}")
async def review_publication(publication_id: UUID, request: Request):
    require_admin(request)
    data = await request.json()
    status = data.get("status")
    if status not in {"aprobada", "rechazada"}:
        raise HTTPException(status_code=422, detail="Sólo se permite aprobar o rechazar.")
    with get_connection() as conn, conn.cursor() as cursor:
        cursor.execute(
            "UPDATE publications SET status = %s, reviewed_at = NOW() WHERE id = %s RETURNING *",
            (status, publication_id),
        )
        publication = cursor.fetchone()
        if not publication:
            raise HTTPException(status_code=404, detail="Publicación no encontrada.")
        if status == "aprobada" and publication["type"] in DIRECTORY_TYPES:
            cursor.execute(
                """INSERT INTO businesses
                   (publication_id, name, category, description, location, address, schedule, contact, image_path, services)
                   VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,jsonb_build_array(%s::text))
                   ON CONFLICT (publication_id) DO UPDATE SET
                     name = EXCLUDED.name, category = EXCLUDED.category, description = EXCLUDED.description,
                     location = EXCLUDED.location, address = EXCLUDED.address, schedule = EXCLUDED.schedule,
                     contact = EXCLUDED.contact, image_path = EXCLUDED.image_path, services = EXCLUDED.services""",
                (publication["id"], publication["business_name"] or publication["title"], publication["category"] or "servicios",
                 publication["description"], publication["location"], publication["location"], publication["hours"],
                 publication["contact"], publication["image_path"], publication["title"]),
            )
        conn.commit()
    return publication


@app.get("/api/businesses")
def list_businesses():
    with get_connection() as conn, conn.cursor() as cursor:
        cursor.execute(
            """SELECT b.id, b.name, b.category, b.description, b.location, b.address,
                      b.schedule, b.contact, b.image_path, b.services
               FROM businesses b JOIN publications p ON p.id = b.publication_id
               WHERE p.status = 'aprobada' ORDER BY b.created_at DESC"""
        )
        return cursor.fetchall()


@app.get("/api/businesses/{business_id}")
def get_business(business_id: UUID):
    with get_connection() as conn, conn.cursor() as cursor:
        cursor.execute(
            """SELECT b.id, b.name, b.category, b.description, b.location, b.address,
                      b.schedule, b.contact, b.image_path, b.services
               FROM businesses b JOIN publications p ON p.id = b.publication_id
               WHERE b.id = %s AND p.status = 'aprobada'""",
            (business_id,),
        )
        business = cursor.fetchone()
    if not business:
        raise HTTPException(status_code=404, detail="Comercio no encontrado.")
    return business


@app.get("/revision.html", include_in_schema=False)
def review_page(request: Request):
    if not request.session.get("admin_email"):
        return RedirectResponse("/admin-login.html", status_code=303)
    return FileResponse(FRONTEND_DIR / "revision.html")


@app.get("/admin-login.html", include_in_schema=False)
def login_page():
    return FileResponse(FRONTEND_DIR / "admin-login.html")


app.mount("/uploads", StaticFiles(directory=UPLOADS_DIR), name="uploads")
app.mount("/", StaticFiles(directory=FRONTEND_DIR, html=True), name="frontend")
