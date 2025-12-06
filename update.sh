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
echo -e "${YELLOW}Paso 2: Analizando contenido de cambios y generando mensaje...${NC}"

# Función para obtener la extensión de un archivo
get_extension() {
    echo "${1##*.}"
}

# Función para extraer líneas añadidas del diff
get_added_lines() {
    local file="$1"
    git diff --cached "$file" 2>/dev/null | grep -E "^\+" | grep -v "^+++" | sed 's/^+//' | head -20
}

# Función para extraer líneas eliminadas del diff
get_removed_lines() {
    local file="$1"
    git diff --cached "$file" 2>/dev/null | grep -E "^-" | grep -v "^---" | sed 's/^-//' | head -20
}

# Función para analizar el contenido real de los cambios
analyze_change_content() {
    local file="$1"
    local extension=$(get_extension "$file")
    local filename=$(basename "$file")
    local added_lines=$(get_added_lines "$file")
    local removed_lines=$(get_removed_lines "$file")
    local all_changes="$added_lines $removed_lines"
    
    # Análisis para archivos Markdown
    if [ "$extension" = "md" ]; then
        if echo "$added_lines" | grep -qiE "(#|##|###)"; then
            # Extraer títulos añadidos
            titles=$(echo "$added_lines" | grep -E "^#+" | sed 's/^#\+ *//' | head -3 | tr '\n' ', ' | sed 's/, $//')
            if [ -n "$titles" ]; then
                echo "docs: Agregada sección: $titles"
                return
            fi
        fi
        if echo "$added_lines" | grep -qiE "(funcionalidad|característica|feature)"; then
            echo "docs: Documentación de nuevas funcionalidades"
            return
        fi
        if echo "$added_lines" | grep -qiE "(fix|correg|bug|error)"; then
            echo "docs: Documentación de correcciones"
            return
        fi
        if echo "$all_changes" | grep -qiE "(actualiz|update|mejor)"; then
            echo "docs: Actualización de contenido"
            return
        fi
        echo "docs: Cambios en documentación"
        return
    fi
    
    # Análisis para archivos JavaScript/JSX
    if [[ "$extension" =~ ^(js|jsx|ts|tsx)$ ]]; then
        # Detectar nuevas funciones/componentes
        new_functions=$(echo "$added_lines" | grep -E "(function|const|export|class)\s+\w+" | sed -E 's/.*(function|const|export|class)\s+(\w+).*/\2/' | head -3 | tr '\n' ', ' | sed 's/, $//')
        if [ -n "$new_functions" ]; then
            echo "feat: Agregadas funciones: $new_functions"
            return
        fi
        
        # Detectar correcciones de bugs
        if echo "$all_changes" | grep -qiE "(fix|bug|error|correg|solucion)"; then
            # Intentar extraer el contexto del fix
            fix_context=$(echo "$added_lines" | grep -iE "(fix|bug|error)" | head -1 | sed 's/.*\(fix\|bug\|error\)[^a-z]*//i' | cut -c1-50)
            if [ -n "$fix_context" ]; then
                echo "fix: $fix_context"
            else
                echo "fix: Corrección en $filename"
            fi
            return
        fi
        
        # Detectar mejoras de rendimiento
        if echo "$all_changes" | grep -qiE "(optimiz|performance|rendimiento|mejor)"; then
            echo "perf: Mejoras de rendimiento en $filename"
            return
        fi
        
        # Detectar cambios de estilo/UI
        if echo "$all_changes" | grep -qiE "(style|className|css|theme|dark|light)"; then
            if echo "$all_changes" | grep -qiE "dark"; then
                echo "style: Ajustes de modo oscuro"
            else
                echo "style: Ajustes de estilos en $filename"
            fi
            return
        fi
        
        # Detectar nuevas importaciones (nuevas dependencias)
        if echo "$added_lines" | grep -qE "^import.*from"; then
            imports=$(echo "$added_lines" | grep -E "^import" | sed -E 's/import.*from [''"]?([^''"]+).*/\1/' | head -3 | tr '\n' ', ' | sed 's/, $//')
            if [ -n "$imports" ]; then
                echo "feat: Integración con: $imports"
                return
            fi
        fi
        
        # Detectar cambios en hooks de React
        if echo "$all_changes" | grep -qiE "(useState|useEffect|useCallback|useMemo)"; then
            echo "refactor: Optimización de hooks de React"
            return
        fi
        
        # Detectar cambios en props o estado
        if echo "$all_changes" | grep -qiE "(props|state|setState)"; then
            echo "refactor: Ajustes en manejo de estado/props"
            return
        fi
        
        echo "update: Cambios en $filename"
        return
    fi
    
    # Análisis para archivos CSS
    if [[ "$extension" =~ ^(css|scss|sass)$ ]]; then
        if echo "$all_changes" | grep -qiE "(dark|theme|@media|responsive)"; then
            if echo "$all_changes" | grep -qiE "dark"; then
                echo "style: Mejoras en modo oscuro"
            elif echo "$all_changes" | grep -qiE "@media"; then
                echo "style: Mejoras responsive"
            else
                echo "style: Ajustes de tema"
            fi
            return
        fi
        if echo "$all_changes" | grep -qiE "(color|background|border|padding|margin)"; then
            echo "style: Ajustes visuales"
            return
        fi
        echo "style: Actualización de estilos"
        return
    fi
    
    # Análisis para package.json
    if [ "$filename" = "package.json" ]; then
        if echo "$added_lines" | grep -qE '"(dependencies|devDependencies)"'; then
            deps=$(echo "$added_lines" | grep -E '"[^"]+":\s*"' | sed -E 's/.*"([^"]+)":.*/\1/' | head -5 | tr '\n' ', ' | sed 's/, $//')
            if [ -n "$deps" ]; then
                echo "deps: Agregadas dependencias: $deps"
            else
                echo "deps: Actualización de dependencias"
            fi
            return
        fi
        if echo "$removed_lines" | grep -qE '"(dependencies|devDependencies)"'; then
            echo "deps: Eliminadas dependencias"
            return
        fi
        echo "config: Cambios en configuración del proyecto"
        return
    fi
    
    # Análisis para scripts bash
    if [ "$extension" = "sh" ]; then
        if echo "$added_lines" | grep -qiE "(function|analyze|detect|generate)"; then
            echo "scripts: Mejoras en automatización"
            return
        fi
        echo "scripts: Actualización de script $filename"
        return
    fi
    
    # Por defecto
    echo "update: Cambios en $filename"
}

# Analizar cambios para generar mensaje automático
CHANGED_FILES=$(git diff --cached --name-status 2>/dev/null)
UNTRACKED_FILES=$(git ls-files --others --exclude-standard 2>/dev/null)

# Variables para categorizar cambios
FILES_TO_ANALYZE=""
NEW_FILES=""
MODIFIED_FILES=""
DELETED_FILES=""

# Recopilar archivos modificados para análisis
if [ -n "$CHANGED_FILES" ]; then
    while IFS= read -r line; do
        if [ -z "$line" ]; then continue; fi
        STATUS=$(echo "$line" | cut -c1)
        FILE=$(echo "$line" | cut -c2- | xargs)
        FILENAME=$(basename "$FILE")
        
        case "$STATUS" in
            A|?)
                NEW_FILES="$NEW_FILES|$FILE"
                FILES_TO_ANALYZE="$FILES_TO_ANALYZE|$FILE"
                ;;
            M)
                MODIFIED_FILES="$MODIFIED_FILES|$FILE"
                FILES_TO_ANALYZE="$FILES_TO_ANALYZE|$FILE"
                ;;
            D)
                DELETED_FILES="$DELETED_FILES|$FILENAME"
                ;;
        esac
    done <<< "$CHANGED_FILES"
fi

# Analizar archivos sin rastrear
if [ -n "$UNTRACKED_FILES" ]; then
    while IFS= read -r file; do
        if [ -z "$file" ]; then continue; fi
        NEW_FILES="$NEW_FILES|$file"
        FILES_TO_ANALYZE="$FILES_TO_ANALYZE|$file"
    done <<< "$UNTRACKED_FILES"
fi

# Generar mensaje de commit basado en análisis de contenido
COMMIT_MSG=""

# Prioridad 1: Archivos eliminados
if [ -n "$DELETED_FILES" ]; then
    DEL_COUNT=$(echo "$DELETED_FILES" | tr '|' '\n' | grep -v '^$' | wc -l | xargs)
    if [ "$DEL_COUNT" -eq 1 ]; then
        DEL_FILE=$(echo "$DELETED_FILES" | tr '|' '\n' | grep -v '^$' | head -1)
        COMMIT_MSG="remove: Eliminado $DEL_FILE"
    else
        COMMIT_MSG="remove: Archivos eliminados"
    fi
# Prioridad 2: Analizar el primer archivo modificado/agregado en detalle
elif [ -n "$FILES_TO_ANALYZE" ]; then
    FIRST_FILE=$(echo "$FILES_TO_ANALYZE" | tr '|' '\n' | grep -v '^$' | head -1)
    
    # Si solo hay un archivo, analizarlo en detalle
    FILE_COUNT=$(echo "$FILES_TO_ANALYZE" | tr '|' '\n' | grep -v '^$' | wc -l | xargs)
    if [ "$FILE_COUNT" -eq 1 ]; then
        COMMIT_MSG=$(analyze_change_content "$FIRST_FILE")
    else
        # Si hay múltiples archivos, analizar el más relevante
        # Priorizar: código > estilos > docs > otros
        PRIORITY_FILE=""
        for file in $(echo "$FILES_TO_ANALYZE" | tr '|' '\n' | grep -v '^$'); do
            ext=$(get_extension "$file")
            if [[ "$ext" =~ ^(js|jsx|ts|tsx)$ ]]; then
                PRIORITY_FILE="$file"
                break
            elif [[ "$ext" =~ ^(css|scss|sass)$ ]] && [ -z "$PRIORITY_FILE" ]; then
                PRIORITY_FILE="$file"
            elif [ "$ext" = "md" ] && [ -z "$PRIORITY_FILE" ]; then
                PRIORITY_FILE="$file"
            fi
        done
        
        if [ -n "$PRIORITY_FILE" ]; then
            COMMIT_MSG=$(analyze_change_content "$PRIORITY_FILE")
            # Agregar contexto de múltiples archivos
            if [ "$FILE_COUNT" -gt 1 ]; then
                COMMIT_MSG="$COMMIT_MSG (+$((FILE_COUNT - 1)) archivos más)"
            fi
        else
            COMMIT_MSG="update: Cambios en múltiples archivos"
        fi
    fi
else
    COMMIT_MSG="update: Cambios varios"
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

