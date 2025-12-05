#!/bin/bash

# ============================================
# Script Rápido para Actualizar GitHub
# ============================================
# 
# Uso: bash update.sh
# O: ./update.sh (después de dar permisos con chmod +x update.sh)
#
# ============================================

# Colores para la terminal
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Actualizando Repositorio en GitHub${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Verificar si estamos en un repositorio Git
if [ ! -d ".git" ]; then
    echo -e "${RED}❌ Error: No estás en un repositorio Git${NC}"
    echo "   Ejecuta este script desde la carpeta del proyecto"
    exit 1
fi

# Verificar si hay cambios (incluyendo archivos nuevos)
echo -e "${YELLOW}Verificando cambios...${NC}"
# Verificar cambios en archivos rastreados y archivos sin rastrear
if git diff --quiet && git diff --cached --quiet && [ -z "$(git ls-files --others --exclude-standard)" ]; then
    echo -e "${YELLOW}⚠️  No hay cambios para subir${NC}"
    read -p "¿Quieres ver el estado del repositorio? (s/n): " SHOW_STATUS
    if [ "$SHOW_STATUS" = "s" ] || [ "$SHOW_STATUS" = "S" ]; then
        git status
    fi
    exit 0
fi

# Mostrar cambios pendientes
echo -e "${YELLOW}Cambios detectados:${NC}"
git status --short
echo ""

# Paso 1: Agregar archivos
echo -e "${YELLOW}Paso 1: Agregando archivos...${NC}"
git add .
echo -e "${GREEN}✅ Archivos agregados${NC}"
echo ""

# Paso 2: Hacer commit
echo -e "${YELLOW}Paso 2: Creando commit...${NC}"
read -p "Mensaje del commit: " COMMIT_MSG

# Validar que se ingresó un mensaje
if [ -z "$COMMIT_MSG" ]; then
    echo -e "${RED}❌ Error: Debes ingresar un mensaje de commit${NC}"
    exit 1
fi

git commit -m "$COMMIT_MSG"
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Commit creado exitosamente${NC}"
else
    echo -e "${RED}❌ Error al crear el commit${NC}"
    exit 1
fi
echo ""

# Paso 3: Verificar si hay un remote configurado
echo -e "${YELLOW}Paso 3: Verificando conexión con GitHub...${NC}"
if ! git remote | grep -q "origin"; then
    echo -e "${RED}❌ Error: No hay un remote 'origin' configurado${NC}"
    echo "   Ejecuta primero COMANDOS_GITHUB.sh para configurar el repositorio"
    exit 1
fi
echo -e "${GREEN}✅ Remote configurado${NC}"
echo ""

# Paso 4: Hacer push
echo -e "${YELLOW}Paso 4: Subiendo cambios a GitHub...${NC}"
git push

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${BLUE}========================================${NC}"
    echo -e "${GREEN}✅ ¡Cambios subidos exitosamente!${NC}"
    echo -e "${BLUE}========================================${NC}"
else
    echo ""
    echo -e "${RED}❌ Error al subir los cambios${NC}"
    echo "   Verifica tu conexión y credenciales"
    exit 1
fi

