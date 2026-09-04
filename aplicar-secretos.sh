#!/usr/bin/env bash
# Lee las claves del archivo de secretos y las aplica a Cloud Run.
# Los valores NUNCA se imprimen: solo se informa que clave se aplico.
set -euo pipefail

SECRETS="/Users/macbookm2pro/Documents/Jhenny/bolivia-insight-secrets.env"
PROJECT="bolivia-insight-2026"
REGION="southamerica-east1"
SERVICE="bolivia-insight-api"
REPO_DIR="/Users/macbookm2pro/Documents/Jhenny/bolivia_insight_web-main"
API_URL="https://bolivia-insight-api-jgd3medhva-rj.a.run.app"

[ -f "$SECRETS" ] || { echo "No existe $SECRETS"; exit 1; }

# --- leer solo claves con valor, sin imprimirlos ---
declare -a PAIRS=()
declare -a NAMES=()
GOOGLE_ID_SET=""

while IFS= read -r line; do
  case "$line" in \#*|"") continue ;; esac
  key="${line%%=*}"
  val="${line#*=}"
  # limpiar CR (archivos CRLF), espacios y comillas envolventes
  val="${val%$'\r'}"
  val="${val#"${val%%[![:space:]]*}"}"
  val="${val%"${val##*[![:space:]]}"}"
  case "$val" in
    \"*\") val="${val#\"}"; val="${val%\"}" ;;
    \'*\') val="${val#\'}"; val="${val%\'}" ;;
  esac
  [ -z "$val" ] && continue
  case "$key" in
    GOOGLE_CLIENT_ID) GOOGLE_ID_SET="$val" ;;
  esac
  PAIRS+=("${key}=${val}")
  NAMES+=("$key")
done < "$SECRETS"

if [ ${#PAIRS[@]} -eq 0 ]; then
  echo "El archivo esta vacio — no hay nada que aplicar."
  echo "Rellena al menos una clave en:"
  echo "  $SECRETS"
  exit 0
fi

echo "Claves encontradas (${#NAMES[@]}):"
printf '  - %s\n' "${NAMES[@]}"
echo

# --- construir el argumento con delimitador seguro ---
JOINED=""
for p in "${PAIRS[@]}"; do
  if [ -z "$JOINED" ]; then JOINED="$p"; else JOINED="${JOINED}|${p}"; fi
done

echo "Aplicando al backend en Cloud Run..."
gcloud run services update "$SERVICE" \
  --region "$REGION" \
  --project "$PROJECT" \
  --update-env-vars "^|^${JOINED}" \
  --quiet >/dev/null
echo "  Backend actualizado."
echo

# --- si vino el Client ID, recompilar y redesplegar el frontend ---
if [ -n "$GOOGLE_ID_SET" ]; then
  echo "GOOGLE_CLIENT_ID presente: recompilando el frontend..."
  export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh" >/dev/null 2>&1
  nvm use 24 >/dev/null 2>&1
  cd "$REPO_DIR/web"
  rm -rf dist
  VITE_API_URL="$API_URL" VITE_GOOGLE_CLIENT_ID="$GOOGLE_ID_SET" npm run build >/dev/null 2>&1
  echo "  Frontend compilado."
  cd "$REPO_DIR"
  firebase deploy --only hosting \
    --project "$PROJECT" \
    --account jhenny.quispe.ttc@gmail.com 2>&1 | grep -E "Hosting URL|release complete|Error" || true
  echo "  Frontend desplegado."
  echo
fi

echo "Listo. Verificando que el backend sigue en pie..."
sleep 12
POIS=$(curl -s -m 30 "$API_URL/routes/pois?city=la-paz" | python3 -c "import sys,json;print(len(json.load(sys.stdin)))" 2>/dev/null || echo "ERROR")
echo "  POIs que responde la API: $POIS  (deben ser 35)"
