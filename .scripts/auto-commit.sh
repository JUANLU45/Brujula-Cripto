#!/bin/bash
# Script de auto-commit para proteger cambios
# Ejecuta cada 5 minutos

# Navegar al directorio del proyecto
cd "C:\BRUJULA CRIPTO"

# Verificar si hay cambios
if ! git diff-index --quiet HEAD --; then
    echo "Cambios detectados - Creando commit automático..."
    
    # Agregar todos los archivos
    git add .
    
    # Commit con timestamp
    git commit -m "AUTO-SAVE: $(date '+%Y-%m-%d %H:%M:%S')"
    
    echo "Commit automático creado: $(date)"
else
    echo "No hay cambios que guardar: $(date)"
fi