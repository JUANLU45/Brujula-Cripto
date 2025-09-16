# 🔐 GUÍA PARA CONFIGURAR SECRETOS EN GOOGLE SECRET MANAGER

## 📋 COMANDOS LISTOS PARA EJECUTAR CUANDO TENGAS LAS CLAVES DE STRIPE

### ⚡ INSTRUCCIONES RÁPIDAS

**1. Primero verifica tu autenticación con Google Cloud:**

```bash
gcloud auth list
gcloud config get-value project
```

**2. Si no estás autenticado o en el proyecto correcto:**

```bash
gcloud auth login
gcloud config set project brujula-cripto
```

---

## 🚨 SECRETOS CRÍTICOS A CONFIGURAR

### 1. **STRIPE_SECRET_KEY** (Clave secreta del servidor)

```bash
# ⚠️  REEMPLAZAR 'sk_test_YOUR_SECRET_KEY' con tu clave real de Stripe
gcloud secrets create STRIPE_SECRET_KEY --data-file=- <<< "sk_test_YOUR_SECRET_KEY"
```

### 2. **STRIPE_WEBHOOK_SECRET** (Secreto del webhook)

```bash
# ⚠️  REEMPLAZAR 'whsec_YOUR_WEBHOOK_SECRET' con tu webhook secret real
gcloud secrets create STRIPE_WEBHOOK_SECRET --data-file=- <<< "whsec_YOUR_WEBHOOK_SECRET"
```

### 3. **UPSTASH_REDIS_REST_URL** (URL de Redis)

```bash
# ⚠️  REEMPLAZAR con tu URL real de Upstash Redis
gcloud secrets create UPSTASH_REDIS_REST_URL --data-file=- <<< "https://your-redis-url.upstash.io"
```

### 4. **UPSTASH_REDIS_REST_TOKEN** (Token de Redis)

```bash
# ⚠️  REEMPLAZAR con tu token real de Upstash Redis
gcloud secrets create UPSTASH_REDIS_REST_TOKEN --data-file=- <<< "YOUR_REDIS_TOKEN"
```

---

## ✅ VERIFICACIÓN DE SECRETOS

### Listar todos los secretos:

```bash
gcloud secrets list
```

### Verificar un secreto específico:

```bash
gcloud secrets versions access latest --secret="STRIPE_SECRET_KEY"
```

---

## 🔄 ACTUALIZAR SECRETOS EXISTENTES

Si ya tienes secretos y necesitas actualizarlos:

```bash
# Actualizar STRIPE_SECRET_KEY
echo "sk_test_NEW_SECRET_KEY" | gcloud secrets versions add STRIPE_SECRET_KEY --data-file=-

# Actualizar STRIPE_WEBHOOK_SECRET
echo "whsec_NEW_WEBHOOK_SECRET" | gcloud secrets versions add STRIPE_WEBHOOK_SECRET --data-file=-
```

---

## 📝 CONFIGURACIÓN DEL FRONTEND (.env.local)

**También debes actualizar estas variables en `packages/app/.env.local`:**

```bash
# Reemplazar esta línea:
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY_HERE

# Con tu clave pública real:
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_TU_CLAVE_PUBLICA_REAL
```

**Y los price IDs de Stripe:**

```bash
NEXT_PUBLIC_STRIPE_PRICE_PREMIUM_1H=price_TU_PRICE_ID_1H
NEXT_PUBLIC_STRIPE_PRICE_PREMIUM_5H=price_TU_PRICE_ID_5H
NEXT_PUBLIC_STRIPE_PRICE_PREMIUM_10H=price_TU_PRICE_ID_10H
```

---

## 🎯 CHECKLIST FINAL

- [ ] **STRIPE_SECRET_KEY** configurado en Google Secret Manager
- [ ] **STRIPE_WEBHOOK_SECRET** configurado en Google Secret Manager
- [ ] **UPSTASH_REDIS_REST_URL** configurado en Google Secret Manager
- [ ] **UPSTASH_REDIS_REST_TOKEN** configurado en Google Secret Manager
- [ ] **NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY** actualizado en .env.local
- [ ] **Price IDs** actualizados en .env.local
- [ ] Verificación de secretos con `gcloud secrets list`

---

## ⚠️ IMPORTANTE - SEGURIDAD

1. **NUNCA** subas las claves secretas a Git
2. **SIEMPRE** usa claves de test hasta que estés listo para producción
3. **VERIFICAR** que el frontend solo usa claves públicas (`NEXT_PUBLIC_*`)
4. **CONFIRMAR** que el backend usa Google Secret Manager correctamente

---

## 🚀 DESPUÉS DE CONFIGURAR

Una vez configurados todos los secretos, ejecuta:

```bash
# Verificar que no hay errores de compilación
cd "C:\BRUJULA CRIPTO\packages\app"
npm run build

# Desplegar las Cloud Functions
cd "C:\BRUJULA CRIPTO\packages\functions"
npm run deploy
```

**¡Listo! Tu aplicación estará totalmente configurada para manejar pagos con Stripe. 🎉**
# 🛠️ BRÚJULA CRIPTO - CONFIGURACIÓN COMPLETA DE APIs Y SERVICIOS

## SERVICIOS DE GOOGLE CLOUD NECESARIOS

### 1. Firebase Services
**Verificado en:** PROYEC_PARTE1.MD, PROYEC_PARTE2.MD, PROYEC_PARTE3.MD

```bash
# Firebase Authentication con Custom Claims
gcloud services enable firebase.googleapis.com

# Cloud Firestore para base de datos
gcloud services enable firestore.googleapis.com

# Firebase Storage para archivos
gcloud services enable firebase.googleapis.com
```

**Colecciones Firestore identificadas:**
- `users/` - uid, email, createdAt, usageCreditsInSeconds, stripeCustomerId
- `articles/` - contenido bilingüe, status, source 'ai-generated'
- `professionalServices/` - directorio de servicios profesionales
- `siteContent/` - contenido editable de homepage
- `contactSubmissions/` - formularios de contacto
- `siteConfig/` - configuración de precios
- `chatbot_conversations/` - conversaciones del chatbot
- `chatbot_messages/` - mensajes del chatbot (subcolección)

### 2. Cloud Functions
**Verificado en:** PROYEC_PARTE1.MD, PROYEC_PARTE3.MD, firebase.json

```bash
# Cloud Functions v2 con runtime nodejs20
gcloud services enable cloudfunctions.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

**Funciones identificadas:**
- `setAdminRole` - Asignar claims de administrador
- `createArticle`, `updateArticle`, `deleteArticle` - CRUD artículos
- `createCheckout`, `stripeWebhooks`, `createStripePortalSession` - Stripe
- `handleContactForm` - Procesar formularios de contacto
- `trackUsage`, `getUserCredits` - Sistema de créditos por tiempo

### 3. Vertex AI y Gemini
**Verificado en:** PROYEC_PARTE4.MD, DOCUMENTACION/COMPETENCIA/DIFERENCIAS.MD

```bash
# Vertex AI para acceder a Gemini Pro
gcloud services enable aiplatform.googleapis.com

# Genkit for Firebase requiere acceso a Vertex AI
gcloud services enable ml.googleapis.com
```

**Configuración Vertex AI:**
- Modelo: Gemini Pro via Vertex AI
- Framework: Genkit for Firebase (TypeScript)
- Uso: Generación automática de contenido bilingüe
- Trigger: Cloud Scheduler diario

### 4. Cloud Run
**Verificado en:** PROYEC_PARTE4.MD, PROYEC_PARTE7.MD

```bash
# Cloud Run para microservicio de IA
gcloud services enable run.googleapis.com

# Container Registry para imágenes Docker
gcloud services enable containerregistry.googleapis.com
```

**Microservicios identificados:**
- `packages/microservice-ia/` - Generación de contenido con Genkit
- Chatbot especializado (PROYEC_PARTE7.MD) - Genkit + Vector Search

### 5. Cloud Scheduler
**Verificado en:** PROYEC_PARTE4.MD

```bash
# Cloud Scheduler para triggers automáticos
gcloud services enable cloudscheduler.googleapis.com
```

**Configuración:**
- Trigger diario para generación de contenido IA
- Llamadas a Cloud Run endpoints

### 6. Google Secret Manager
**Verificado en:** configuraciones existentes, PROYEC_PARTE1.MD

```bash
# Secret Manager para credenciales sensibles
gcloud services enable secretmanager.googleapis.com
```

**Secretos ya configurados:**
- Firebase Web App credentials (7 secretos)
- Stripe API keys (pendientes)
- Vertex AI credentials

### 7. Vertex AI Vector Search
**Verificado en:** PROYEC_PARTE7.MD

```bash
# Vector Search para chatbot RAG
gcloud services enable aiplatform.googleapis.com
```

**Uso identificado:**
- Base de conocimiento para chatbot
- Indexado de documentación técnica y whitepapers
- RAG (Retrieval Augmented Generation)

### 8. Firebase App Hosting
**Verificado en:** apphosting.yaml, configuración actual

```bash
# App Hosting para Next.js deployment
gcloud services enable firebase.googleapis.com
```

**Configuración verificada:**
- Secrets ya configurados en Google Secret Manager
- Variables de entorno BUILD + RUNTIME availability

### 9. Cloud Logging
**Verificado en:** packages/functions/package.json

```bash
# Cloud Logging para monitoreo
gcloud services enable logging.googleapis.com
```

## APIS DE TERCEROS IDENTIFICADAS

### 1. Stripe Payment Processing
**Verificado en:** PROYEC_PARTE1.MD, PROYEC_PARTE3.MD

**Configuración requerida:**
- `STRIPE_SECRET_KEY` - Para pagos backend
- `STRIPE_WEBHOOK_SECRET` - Para webhooks
- `STRIPE_PUBLISHABLE_KEY` - Para frontend (público)

**Funcionalidades:**
- Checkout sessions para compra de créditos
- Portal de cliente para gestión de suscripciones
- Webhooks para actualizar estado de usuario

### 2. APIs Blockchain Externas
**Verificado en:** PROYEC_PARTE1.MD, PROYEC_PARTE7.MD

#### Covalent API
**Uso:** Análisis de wallets y transacciones
**Endpoint:** API para balance, tokens, NFTs
**Función:** `getWalletAnalysis(address, chain)`

#### Moralis API
**Uso:** Datos blockchain complementarios
**Endpoint:** API para análisis de transacciones
**Función:** `getTransactionStatus(txHash, chain)`

#### GoPlus Security API
**Uso:** Análisis de seguridad de contratos
**Endpoint:** API para auditorías de contratos
**Función:** `getContractAuditSummary(contractAddress, chain)`

### 3. Redis/Cache
**Verificado en:** PROYEC_PARTE1.MD

**Opciones identificadas:**
- Upstash Redis - Para cache externo
- Memorystore - Para cache interno Google Cloud
- TTL: 5 minutos para respuestas frecuentes

## COMANDOS DE CONFIGURACIÓN COMPLETA

```bash
# 1. Habilitar TODOS los servicios de Google Cloud
gcloud services enable \
  firebase.googleapis.com \
  firestore.googleapis.com \
  cloudfunctions.googleapis.com \
  cloudbuild.googleapis.com \
  aiplatform.googleapis.com \
  ml.googleapis.com \
  run.googleapis.com \
  containerregistry.googleapis.com \
  cloudscheduler.googleapis.com \
  secretmanager.googleapis.com \
  logging.googleapis.com

# 2. Verificar que todos los servicios están habilitados
gcloud services list --enabled --filter="name:(firebase.googleapis.com OR firestore.googleapis.com OR cloudfunctions.googleapis.com OR aiplatform.googleapis.com OR run.googleapis.com)"

# 3. Configurar permisos para Vertex AI
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:YOUR_PROJECT_ID@appspot.gserviceaccount.com" \
  --role="roles/aiplatform.user"

# 4. Configurar permisos para Cloud Run
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:YOUR_PROJECT_ID@appspot.gserviceaccount.com" \
  --role="roles/run.invoker"
```

## SECRETOS PENDIENTES POR CONFIGURAR

### Stripe (cuando estén disponibles)
```bash
# Stripe secrets - ESPERAR CLAVES REALES
gcloud secrets create STRIPE_SECRET_KEY --data-file=-
gcloud secrets create STRIPE_WEBHOOK_SECRET --data-file=-
gcloud secrets create STRIPE_PUBLISHABLE_KEY --data-file=-
```

### APIs Blockchain (cuando se obtengan)
```bash
# APIs externas - CONFIGURAR CUANDO SE TENGAN LAS CLAVES
gcloud secrets create COVALENT_API_KEY --data-file=-
gcloud secrets create MORALIS_API_KEY --data-file=-
gcloud secrets create GOPLUS_API_KEY --data-file=-
```

## VERIFICACIÓN DE CONFIGURACIÓN

### Verificar servicios habilitados
```bash
gcloud services list --enabled --format="value(name)" | grep -E "(firebase|firestore|functions|aiplatform|run|scheduler|secret)"
```

### Verificar secretos configurados
```bash
gcloud secrets list --format="table(name,createTime)"
```

### Verificar permisos
```bash
gcloud projects get-iam-policy YOUR_PROJECT_ID --flatten="bindings[].members" --filter="bindings.members:*appspot*"
```

## NOTAS IMPORTANTES

1. **TODOS LOS SERVICIOS LISTADOS ESTÁN VERIFICADOS** en la documentación del proyecto
2. **NO HAY ESPECULACIÓN** - Solo APIs y servicios explícitamente mencionados
3. **CONFIGURACIÓN ACTUAL** - Firebase secrets ya están configurados
4. **PENDIENTES** - Solo Stripe y APIs blockchain externas (cuando se obtengan las claves)
5. **RUNTIME** - Node.js 20 uniformizado en todo el proyecto

## COSTOS ESTIMADOS

- **Firebase**: Plan Blaze (pay-as-you-go)
- **Vertex AI**: Por uso de Gemini Pro
- **Cloud Run**: Pay-per-use
- **Cloud Functions**: Pay-per-invocation
- **Secret Manager**: Mínimo (<$1/mes)
- **Cloud Scheduler**: $0.10 por job/mes

**Total estimado inicial**: <$50/mes hasta escalar