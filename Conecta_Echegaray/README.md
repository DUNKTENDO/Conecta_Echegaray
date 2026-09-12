# Conecta Echegaray

Aplicación comunitaria con frontend estático, API en FastAPI y PostgreSQL.

## Flujo actual

Las personas envían publicaciones desde `publicar.html`. Todas se guardan como
`pendiente`. Sólo el administrador autenticado puede entrar a
`/admin-login.html`, revisar solicitudes y aprobarlas o rechazarlas. Al aprobar
un comercio o servicio, éste aparece automáticamente en el directorio.

## Ejecutar localmente con Docker

1. Desde la raíz del proyecto, copia `.env.example` a `.env`.
2. Define valores únicos para `POSTGRES_PASSWORD`, `ADMIN_PASSWORD` y
   `SESSION_SECRET`. Para pruebas locales por HTTP usa `COOKIE_SECURE=false`.
3. Ejecuta `docker compose up --build`.
4. Abre `http://127.0.0.1:8000`; el acceso administrativo está en
   `http://127.0.0.1:8000/admin-login.html`.

La primera ejecución crea las tablas y el usuario administrador configurado en
`ADMIN_EMAIL` y `ADMIN_PASSWORD`. Si cambias esas credenciales después, cambia
la contraseña directamente en PostgreSQL o crea una herramienta administrativa;
no se reemplazan automáticamente para evitar sobrescribir una cuenta existente.

## Despliegue inicial en Ubuntu

Instala Docker Engine y Docker Compose Plugin. Copia el proyecto al servidor,
crea el archivo `.env` con `COOKIE_SECURE=true`, y ejecuta:

```bash
docker compose up -d --build
```

No expongas PostgreSQL al exterior. El siguiente paso de despliegue es colocar
Caddy o Nginx como proxy inverso delante del puerto 8000, asociar el dominio y
activar HTTPS. La cookie de administrador sólo se envía por HTTPS cuando
`COOKIE_SECURE=true`.

Respalda periódicamente los volúmenes `postgres_data` y `uploads_data`; ahí se
guardan respectivamente la base de datos y las imágenes subidas.
