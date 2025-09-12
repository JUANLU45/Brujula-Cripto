# Script de respaldo automático de archivos críticos
# Crea copias de seguridad cada hora

$backupDir = "C:\BRUJULA CRIPTO\.backups\$(Get-Date -Format 'yyyy-MM-dd')"
$criticalPaths = @(
    "packages\app\components\features\admin\*.tsx",
    "packages\app\components\features\blog\*.tsx",
    "packages\app\components\features\auth\*.tsx",
    "packages\app\components\features\contact\*.tsx",
    "packages\app\components\features\dashboard\*.tsx",
    "packages\app\components\features\home\*.tsx",
    "packages\app\components\features\payments\*.tsx",
    "packages\app\components\features\recovery\*.tsx",
    "packages\app\components\ui\*.tsx",
    "packages\app\lib\*.ts"
)

# Crear directorio de respaldo
if (!(Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir -Force
}

# Respaldar archivos críticos
foreach ($path in $criticalPaths) {
    $files = Get-ChildItem $path -ErrorAction SilentlyContinue
    foreach ($file in $files) {
        $relativePath = $file.FullName.Replace("C:\BRUJULA CRIPTO\", "")
        $backupPath = Join-Path $backupDir $relativePath
        $backupFolder = Split-Path $backupPath -Parent
        
        if (!(Test-Path $backupFolder)) {
            New-Item -ItemType Directory -Path $backupFolder -Force
        }
        
        Copy-Item $file.FullName $backupPath -Force
    }
}

# Log del respaldo
$logEntry = "$(Get-Date): Respaldo completado - $($files.Count) archivos"
Add-Content -Path ".backups\backup.log" -Value $logEntry

Write-Host "Respaldo completado: $backupDir" -ForegroundColor Green