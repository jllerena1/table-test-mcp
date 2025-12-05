# 🚀 Guía para Subir tu Proyecto a GitHub

## 📋 Pasos para Publicar tu Proyecto

### **Paso 1: Crear una cuenta en GitHub** (si no tienes una)
1. Ve a [github.com](https://github.com)
2. Haz clic en "Sign up"
3. Completa el formulario y crea tu cuenta

---

### **Paso 2: Crear un nuevo repositorio en GitHub**

1. Inicia sesión en GitHub
2. Haz clic en el botón **"+"** (arriba a la derecha) → **"New repository"**
3. Completa el formulario:
   - **Repository name**: `table-test-mcp` (o el nombre que prefieras)
   - **Description**: "Data table component with dark mode from Figma design"
   - **Visibility**: 
     - ✅ **Public** (cualquiera puede verlo)
     - 🔒 **Private** (solo tú puedes verlo)
   - ❌ **NO marques** "Add a README file" (ya tienes uno)
   - ❌ **NO marques** "Add .gitignore" (ya tienes uno)
   - ❌ **NO marques** "Choose a license"
4. Haz clic en **"Create repository"**

---

### **Paso 3: Inicializar Git en tu proyecto local**

Abre tu terminal en la carpeta del proyecto y ejecuta estos comandos:

```bash
# 1. Inicializar Git
git init

# 2. Agregar todos los archivos
git add .

# 3. Hacer el primer commit
git commit -m "Initial commit: Data table component with dark mode"
```

---

### **Paso 4: Conectar tu proyecto local con GitHub**

GitHub te mostrará comandos después de crear el repositorio. Ejecuta estos (reemplaza `TU_USUARIO` con tu nombre de usuario de GitHub):

```bash
# Conectar con el repositorio remoto
git remote add origin https://github.com/TU_USUARIO/table-test-mcp.git

# Cambiar la rama principal a 'main' (si es necesario)
git branch -M main

# Subir tu código a GitHub
git push -u origin main
```

**Nota**: Si GitHub te muestra comandos diferentes, usa esos en su lugar.

---

### **Paso 5: Autenticación**

Cuando ejecutes `git push`, GitHub te pedirá autenticarte:

**Opción A: Personal Access Token (Recomendado)**
1. Ve a GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Genera un nuevo token con permisos `repo`
3. Usa ese token como contraseña cuando Git te lo pida

**Opción B: GitHub CLI**
```bash
# Instalar GitHub CLI (si no lo tienes)
brew install gh

# Autenticarse
gh auth login
```

---

## ✅ Verificación

Después de completar los pasos:

1. Ve a tu repositorio en GitHub: `https://github.com/TU_USUARIO/table-test-mcp`
2. Deberías ver todos tus archivos allí
3. ¡Tu proyecto está publicado! 🎉

---

## 🔄 Comandos para Futuras Actualizaciones

Cuando hagas cambios en tu proyecto y quieras subirlos:

```bash
# 1. Ver qué archivos cambiaron
git status

# 2. Agregar los cambios
git add .

# 3. Hacer commit con un mensaje descriptivo
git commit -m "Descripción de los cambios"

# 4. Subir los cambios a GitHub
git push
```

---

## 📝 Ejemplo de Mensajes de Commit

Usa mensajes descriptivos:

```bash
git commit -m "Add dark mode toggle to data table"
git commit -m "Fix batch actions bar styling in dark mode"
git commit -m "Update README with dark mode documentation"
git commit -m "Improve responsive design for mobile devices"
```

---

## 🛠️ Solución de Problemas Comunes

### **Error: "remote origin already exists"**
```bash
git remote remove origin
git remote add origin https://github.com/TU_USUARIO/table-test-mcp.git
```

### **Error: "failed to push some refs"**
```bash
git pull origin main --rebase
git push -u origin main
```

### **Error: "authentication failed"**
- Verifica que tu token de acceso tenga permisos `repo`
- O usa GitHub CLI: `gh auth login`

### **Quiero cambiar el nombre del repositorio**
1. Ve a tu repositorio en GitHub
2. Settings → General → Repository name
3. Cambia el nombre y actualiza el remote:
```bash
git remote set-url origin https://github.com/TU_USUARIO/NUEVO_NOMBRE.git
```

---

## 📚 Recursos Adicionales

- [Documentación oficial de Git](https://git-scm.com/doc)
- [Guía de GitHub](https://docs.github.com)
- [Markdown Guide](https://www.markdownguide.org/) (para README.md)

---

## 🎯 Checklist Final

Antes de subir, verifica:

- [ ] Tu `.gitignore` está configurado correctamente
- [ ] No hay archivos sensibles (contraseñas, API keys)
- [ ] El `README.md` está actualizado
- [ ] Todos los archivos importantes están incluidos
- [ ] El proyecto funciona localmente (`npm run dev`)

---

¡Listo! Tu proyecto está en GitHub. 🚀

