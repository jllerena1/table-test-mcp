#!/bin/bash

# ============================================
# Script para Subir Proyecto a GitHub
# ============================================
# 
# INSTRUCCIONES:
# 1. Reemplaza TU_USUARIO con tu nombre de usuario de GitHub
# 2. Reemplaza NOMBRE_REPOSITORIO con el nombre que quieras
# 3. Ejecuta este script: bash COMANDOS_GITHUB.sh
#
# ============================================

# CONFIGURACIÓN - CAMBIA ESTOS VALORES
GITHUB_USER="TU_USUARIO"
REPO_NAME="table-test-mcp"

# Colores para la terminal
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Guía para Subir Proyecto a GitHub${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Paso 1: Verificar si Git está instalado
echo -e "${YELLOW}Paso 1: Verificando Git...${NC}"
if ! command -v git &> /dev/null; then
    echo "❌ Git no está instalado. Por favor instálalo primero."
    exit 1
fi
echo -e "${GREEN}✅ Git está instalado${NC}"
echo ""

# Paso 2: Inicializar Git (si no está inicializado)
echo -e "${YELLOW}Paso 2: Inicializando Git...${NC}"
if [ ! -d ".git" ]; then
    git init
    echo -e "${GREEN}✅ Git inicializado${NC}"
else
    echo -e "${GREEN}✅ Git ya está inicializado${NC}"
fi
echo ""

# Paso 3: Agregar archivos
echo -e "${YELLOW}Paso 3: Agregando archivos...${NC}"
git add .
echo -e "${GREEN}✅ Archivos agregados${NC}"
echo ""

# Paso 4: Hacer commit
echo -e "${YELLOW}Paso 4: Haciendo commit...${NC}"
read -p "Mensaje del commit (Enter para usar el predeterminado): " COMMIT_MSG
if [ -z "$COMMIT_MSG" ]; then
    COMMIT_MSG="Initial commit: Data table component with dark mode"
fi
git commit -m "$COMMIT_MSG"
echo -e "${GREEN}✅ Commit realizado${NC}"
echo ""

# Paso 5: Verificar si el remote ya existe
echo -e "${YELLOW}Paso 5: Configurando repositorio remoto...${NC}"
if git remote | grep -q "origin"; then
    echo "⚠️  El remote 'origin' ya existe."
    read -p "¿Quieres reemplazarlo? (s/n): " REPLACE
    if [ "$REPLACE" = "s" ] || [ "$REPLACE" = "S" ]; then
        git remote remove origin
        git remote add origin "https://github.com/${GITHUB_USER}/${REPO_NAME}.git"
        echo -e "${GREEN}✅ Remote configurado${NC}"
    else
        echo "ℹ️  Manteniendo el remote existente"
    fi
else
    git remote add origin "https://github.com/${GITHUB_USER}/${REPO_NAME}.git"
    echo -e "${GREEN}✅ Remote agregado${NC}"
fi
echo ""

# Paso 6: Cambiar a rama main
echo -e "${YELLOW}Paso 6: Configurando rama principal...${NC}"
git branch -M main
echo -e "${GREEN}✅ Rama principal configurada como 'main'${NC}"
echo ""

# Paso 7: Instrucciones finales
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}✅ Configuración local completada${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo "📋 PRÓXIMOS PASOS:"
echo ""
echo "1. Ve a GitHub y crea un nuevo repositorio llamado: ${REPO_NAME}"
echo "   URL: https://github.com/new"
echo ""
echo "2. Después de crear el repositorio, ejecuta:"
echo ""
echo -e "${YELLOW}   git push -u origin main${NC}"
echo ""
echo "3. Si te pide autenticación:"
echo "   - Usa tu nombre de usuario de GitHub"
echo "   - Usa un Personal Access Token como contraseña"
echo "   - Crea uno en: https://github.com/settings/tokens"
echo ""
echo -e "${BLUE}========================================${NC}"

