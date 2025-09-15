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
