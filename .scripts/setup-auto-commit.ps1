# Crear tarea programada para auto-commit cada 5 minutos
# Ejecutar como Administrador: powershell -ExecutionPolicy Bypass -File setup-auto-commit.ps1

$action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-ExecutionPolicy Bypass -WindowStyle Hidden -File `"C:\BRUJULA CRIPTO\.scripts\auto-commit.ps1`""

# Trigger corregido - se ejecuta inmediatamente y se repite cada 5 minutos
$trigger = New-ScheduledTaskTrigger -Once -At (Get-Date) -RepetitionInterval (New-TimeSpan -Minutes 5) -RepetitionDuration (New-TimeSpan -Days 365)

$principal = New-ScheduledTaskPrincipal -UserId "$env:USERDOMAIN\$env:USERNAME" -LogonType Interactive

$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable -ExecutionTimeLimit (New-TimeSpan -Minutes 2)

$task = New-ScheduledTask -Action $action -Trigger $trigger -Principal $principal -Settings $settings -Description "Auto-commit para Brújula Cripto cada 5 minutos"

# Eliminar tarea existente si existe
Unregister-ScheduledTask -TaskName "BrujulaCripto-AutoCommit" -Confirm:$false -ErrorAction SilentlyContinue

Register-ScheduledTask -TaskName "BrujulaCripto-AutoCommit" -InputObject $task -Force

Write-Host "Tarea programada 'BrujulaCripto-AutoCommit' creada exitosamente" -ForegroundColor Green
Write-Host "La tarea se ejecutará cada 5 minutos para proteger tus cambios" -ForegroundColor Yellow