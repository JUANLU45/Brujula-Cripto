param(
  [Parameter(Mandatory=$true)][string]$ProjectId
)

# Este script crea/actualiza secretos de App Hosting con variables NEXT_PUBLIC_* de Firebase
# Requisitos: Firebase CLI >= 13.15.4 autenticada (firebase login)

$vars = @(
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
  'NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID'
)

Write-Host "Configurando secretos de App Hosting en proyecto $ProjectId" -ForegroundColor Cyan

foreach ($name in $vars) {
  $value = Read-Host "Introduce valor para $name"
  if (-not $value) { Write-Host "Saltando $name (vacío)" -ForegroundColor Yellow; continue }
  Write-Host "Creando/actualizando secreto $name" -ForegroundColor Green
  firebase apphosting:secrets:set $name --project $ProjectId --value "$value"
}

Write-Host "Otorgando acceso al backend si fuera necesario (si ya existe)" -ForegroundColor Cyan
Write-Host "Si ves errores de permisos, ejecuta: firebase apphosting:secrets:grantaccess --secret <NAME> --backend <BACKEND_ID> --project $ProjectId" -ForegroundColor Yellow
