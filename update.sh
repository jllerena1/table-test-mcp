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
echo -e "${YELLOW}Paso 2: Generando mensaje de commit automático...${NC}"

# Analizar cambios para generar mensaje automático
CHANGED_FILES=$(git diff --cached --name-status 2>/dev/null)
UNTRACKED_FILES=$(git ls-files --others --exclude-standard 2>/dev/null)

# Inicializar variables
NEW_FILES=""
MODIFIED_FILES=""
DELETED_FILES=""
COMMIT_MSG=""

# Analizar archivos modificados/agregados
if [ -n "$CHANGED_FILES" ]; then
    while IFS= read -r line; do
        if [ -z "$line" ]; then continue; fi
        STATUS=$(echo "$line" | cut -c1)
        FILE=$(echo "$line" | cut -c2- | xargs)
        FILENAME=$(basename "$FILE")
        
        case "$STATUS" in
            A|?)
                if [ -z "$NEW_FILES" ]; then
                    NEW_FILES="$FILENAME"
                else
                    NEW_FILES="$NEW_FILES, $FILENAME"
                fi
                ;;
            M)
                if [ -z "$MODIFIED_FILES" ]; then
                    MODIFIED_FILES="$FILENAME"
                else
                    MODIFIED_FILES="$MODIFIED_FILES, $FILENAME"
                fi
                ;;
            D)
                if [ -z "$DELETED_FILES" ]; then
                    DELETED_FILES="$FILENAME"
                else
                    DELETED_FILES="$DELETED_FILES, $FILENAME"
                fi
                ;;
        esac
    done <<< "$CHANGED_FILES"
fi

# Analizar archivos sin rastrear (antes de git add)
UNTRACKED_BEFORE_ADD=$(git ls-files --others --exclude-standard 2>/dev/null)
if [ -n "$UNTRACKED_BEFORE_ADD" ]; then
    while IFS= read -r file; do
        if [ -z "$file" ]; then continue; fi
        FILENAME=$(basename "$file")
        if [ -z "$NEW_FILES" ]; then
            NEW_FILES="$FILENAME"
        else
            # Evitar duplicados
            if ! echo "$NEW_FILES" | grep -q "$FILENAME"; then
                NEW_FILES="$NEW_FILES, $FILENAME"
            fi
        fi
    done <<< "$UNTRACKED_BEFORE_ADD"
fi

# Generar mensaje de commit basado en los cambios
if [ -n "$NEW_FILES" ] && [ -n "$MODIFIED_FILES" ]; then
    COMMIT_MSG="Update: Modificaciones y nuevos archivos"
elif [ -n "$NEW_FILES" ]; then
    FILE_COUNT=$(echo "$NEW_FILES" | tr ',' '\n' | wc -l | xargs)
    if [ "$FILE_COUNT" -eq 1 ]; then
        COMMIT_MSG="Add: $(echo "$NEW_FILES" | cut -d',' -f1 | xargs)"
    else
        COMMIT_MSG="Add: Nuevos archivos y funcionalidades"
    fi
elif [ -n "$MODIFIED_FILES" ]; then
    FILE_COUNT=$(echo "$MODIFIED_FILES" | tr ',' '\n' | wc -l | xargs)
    if [ "$FILE_COUNT" -eq 1 ]; then
        COMMIT_MSG="Update: $(echo "$MODIFIED_FILES" | cut -d',' -f1 | xargs)"
    else
        COMMIT_MSG="Update: Mejoras y correcciones"
    fi
elif [ -n "$DELETED_FILES" ]; then
    COMMIT_MSG="Remove: Archivos eliminados"
else
    COMMIT_MSG="Update: Cambios varios"
fi

# Mostrar el mensaje generado y permitir confirmar o editar
echo -e "${BLUE}Mensaje generado: ${GREEN}$COMMIT_MSG${NC}"
echo ""
read -p "¿Usar este mensaje? (Enter para confirmar, o escribe uno nuevo): " USER_MSG

if [ -n "$USER_MSG" ]; then
    COMMIT_MSG="$USER_MSG"
fi

git commit -m "$COMMIT_MSG"
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Commit creado exitosamente${NC}"
    echo -e "${BLUE}   Mensaje: $COMMIT_MSG${NC}"
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

