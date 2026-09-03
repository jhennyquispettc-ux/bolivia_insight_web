# Despliegue — Bolivia Insight

Cloud Run (backend) + Cloud SQL (Postgres) + Firebase Hosting (frontend).
El mismo `backend/Dockerfile` sirve después para una instancia de Compute Engine.

---

## Antes de empezar

```bash
gcloud auth login
gcloud config set project <TU_PROJECT_ID>
gcloud services enable run.googleapis.com sqladmin.googleapis.com \
  cloudbuild.googleapis.com artifactregistry.googleapis.com
```

---

## 1. Cloud SQL — arráncalo primero, tarda ~10 min

```bash
gcloud sql instances create bolivia-insight \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=southamerica-east1
```

`southamerica-east1` es la región más cercana a Bolivia; en una demo en vivo la latencia se nota.

```bash
gcloud sql databases create bolivia_insight --instance=bolivia-insight
gcloud sql users set-password postgres --instance=bolivia-insight --password='<CLAVE>'
```

## 2. Crear el esquema — **este es el paso que se olvida y rompe la demo en silencio**

`backend/prisma/migrations/` **no existe** en este repo. `prisma migrate deploy` no aplicaría nada y la base quedaría **sin tablas**, sin ningún error visible.

Usa `db push` a través del Cloud SQL Auth Proxy:

```bash
cloud-sql-proxy <PROJECT>:southamerica-east1:bolivia-insight --port 5433
```

Y en otra terminal, desde `backend/`:

```bash
DATABASE_URL="postgresql://postgres:<CLAVE>@localhost:5433/bolivia_insight" npm run db:setup
```

`db:setup` crea el esquema **y** siembra el grafo de rutas (57 nodos, 35 POIs, 1726 aristas).

> Si te saltas la siembra, `GET /routes/pois` devuelve `[]` y **el planificador aparece vacío en producción sin dar ningún error.** Verifícalo antes de exponer.

## 3. Desplegar el backend

```bash
gcloud run deploy bolivia-insight-api \
  --source backend/ \
  --region southamerica-east1 \
  --allow-unauthenticated \
  --min-instances=1 \
  --max-instances=3 \
  --add-cloudsql-instances <PROJECT>:southamerica-east1:bolivia-insight \
  --set-env-vars "DATABASE_URL=postgresql://postgres:<CLAVE>@localhost/bolivia_insight?host=/cloudsql/<PROJECT>:southamerica-east1:bolivia-insight,GEMINI_API_KEY=...,PAYPAL_CLIENT_ID=...,PAYPAL_SECRET=...,PAYPAL_BASE_URL=https://api-m.sandbox.paypal.com,PAYPAL_CURRENCY=USD,GOOGLE_CLIENT_ID=...,GOOGLE_CLIENT_SECRET=...,JWT_SECRET=...,SMTP_HOST=...,SMTP_USER=...,SMTP_PASS=..."
```

- `DATABASE_URL` debe usar la forma **socket** (`?host=/cloudsql/...`), no una IP.
- `--min-instances=1` elimina el arranque en frío de Prisma delante del jurado.
- `--max-instances=3` porque `db-f1-micro` aguanta unas 25 conexiones y Prisma abre un pool por instancia.

Anota la URL que devuelve: `https://bolivia-insight-api-XXXX.run.app`

## 4. Desplegar el frontend

```bash
cd web
rm -rf dist          # dist/ ya existe de una compilación anterior
VITE_API_URL="https://bolivia-insight-api-XXXX.run.app" npm run build
```

```bash
firebase init hosting      # public: web/dist  ·  single-page app: SÍ
firebase deploy --only hosting
```

El **rewrite a `/index.html` es obligatorio**: la app enruta con `useState`, así que sin él cualquier recarga profunda da 404.

## 5. Google OAuth — **hazlo apenas sepas el dominio, no al final**

Consola de Google Cloud → Credenciales → cliente `648020306250-...` → **Orígenes autorizados de JavaScript**. Añade **los dos**:

- `https://<proyecto>.web.app`
- `https://<proyecto>.firebaseapp.com`

Firebase sirve ambos y GSI falla en el que no esté registrado. Conserva `http://localhost:5173`.

> Los cambios tardan **entre 5 minutos y varias horas** en propagarse. Este es el clásico "todo funciona menos el login, 20 minutos antes de exponer".

## 6. Cerrar CORS (opcional)

`main.ts` es permisivo si no defines nada. Para restringirlo:

```
--set-env-vars CORS_ORIGINS=https://<proyecto>.web.app,https://<proyecto>.firebaseapp.com
```

---

## Verificación posterior

1. `curl https://<api>/roads/status` → debe responder `200` con `status: "unavailable"` (la ABC exige captcha; es el estado honesto esperado).
2. `curl https://<api>/routes/pois?city=la-paz` → **debe traer 35 POIs.** Si viene `[]`, faltó la siembra.
3. Abrir el sitio, iniciar sesión con Google, calcular una ruta y llegar a PayPal sandbox.
4. Cambiar el idioma y recorrer el landing.

---

## Plan B

Si a media tarde el despliegue se complica, **presenta desde local** con `npm run dev`. Una demo local que funciona vale más que una URL de Cloud Run que devuelve 503 delante del jurado. Si despliegas, deja el entorno local corriendo como respaldo y no cambies de destino el día de la exposición.

## Deuda registrada

- Sin historial de migraciones de Prisma (`db push` crea el esquema pero no versiona los cambios).
- El panel de administración (Next.js) no se despliega; necesita integración de framework en Firebase Hosting. Córrelo local si hace falta mostrarlo.
- Las imágenes del landing suman varios MB sin optimizar.
