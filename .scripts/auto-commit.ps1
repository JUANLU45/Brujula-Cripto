# Script PowerShell para auto-commit cada 5 minutos
# Ejecutar: powershell -ExecutionPolicy Bypass -File auto-commit.ps1

Set-Location "C:\BRUJULA CRIPTO"

try {
    # Verificar si hay cambios
    $changes = git status --porcelain
    
    if ($changes) {
        Write-Host "Cambios detectados - Creando commit automático..." -ForegroundColor Yellow
        
        # Agregar todos los archivos
        git add .
        
        # Commit con timestamp
        $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        git commit -m "AUTO-SAVE: $timestamp"
        
        Write-Host "Commit automático creado: $timestamp" -ForegroundColor Green
        
        # Log para auditoría
        Add-Content -Path ".scripts\auto-commit.log" -Value "$(Get-Date): Commit automático creado"
    } else {
        Write-Host "No hay cambios que guardar: $(Get-Date)" -ForegroundColor Blue
    }
} catch {
    Write-Error "Error en auto-commit: $($_.Exception.Message)"
    Add-Content -Path ".scripts\auto-commit.log" -Value "$(Get-Date): ERROR - $($_.Exception.Message)"
}