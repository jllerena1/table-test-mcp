# ⚡ Guía Rápida: Subir a GitHub en 5 Minutos

## 🎯 Pasos Rápidos

### 1️⃣ Crear Repositorio en GitHub
1. Ve a: https://github.com/new
2. Nombre: `table-test-mcp`
3. Elige: **Public** o **Private**
4. **NO marques** ninguna opción adicional
5. Clic en **"Create repository"**

---

### 2️⃣ Ejecutar Comandos en Terminal

Abre la terminal en esta carpeta y ejecuta:

```bash
# Inicializar Git
git init

# Agregar archivos
git add .

# Primer commit
git commit -m "Initial commit: Data table with dark mode"

# Conectar con GitHub (reemplaza TU_USUARIO)
git remote add origin https://github.com/TU_USUARIO/table-test-mcp.git

# Cambiar a rama main
git branch -M main

# Subir a GitHub
git push -u origin main
```

---

### 3️⃣ Autenticación

Cuando pida usuario/contraseña:
- **Usuario**: Tu nombre de usuario de GitHub
- **Contraseña**: Un Personal Access Token
  - Crea uno en: https://github.com/settings/tokens
  - Permisos: marca `repo`
  - Copia el token y úsalo como contraseña

---

## ✅ ¡Listo!

Tu proyecto estará en: `https://github.com/TU_USUARIO/table-test-mcp`

---

## 🔄 Para Futuras Actualizaciones

```bash
git add .
git commit -m "Descripción de cambios"
git push
```

---

**💡 Tip**: Si prefieres usar el script automático, ejecuta:
```bash
bash COMANDOS_GITHUB.sh
```
(Luego edita el archivo para poner tu usuario de GitHub)

