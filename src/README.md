# 22 Patagonia Sushi — Deploy

## 📁 Estructura
```
deploy/
├── index.html              ← Carta (página principal)
├── admin.html              ← Panel de administración
├── admin.js
├── menu-data.js            ← Datos del menú (platos, precios)
├── menu-styles.css
├── menu-components.jsx
├── menu-chrome.jsx
├── menu-app.jsx
└── assets/
    ├── Genjiro.ttf
    ├── logo-cream.png
    ├── lantern-cream.png
    ├── ambiente.jpeg
    └── dishes/
        ├── brillante.jpeg
        ├── cannifier.jpeg
        ├── ceviche.jpeg
        ├── pincrunch.jpeg
        └── demango.jpeg
```

---

## 🚀 Comandos para deploy (CMD)

### Primera vez — crear repo y subir
```cmd
cd C:\proyectos\22-patagonia-sushi-v5
xcopy /E /I /Y C:\Users\TU_USUARIO\Downloads\deploy\* .
git init
git add .
git commit -m "Carta 22 Patagonia Sushi - con fotos reales"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/22-patagonia-carta.git
git push -u origin main
```

### Actualizar precios (después de exportar desde Admin)
```cmd
cd C:\proyectos\22-patagonia-sushi-v5
copy /Y C:\Users\TU_USUARIO\Downloads\menu-data.js .\menu-data.js
git add menu-data.js
git commit -m "Update: precios actualizados"
git push
```

### Agregar nueva foto de plato
```cmd
copy /Y C:\Users\TU_USUARIO\Downloads\nueva-foto.jpeg .\assets\dishes\nueva-foto.jpeg
git add assets\dishes\nueva-foto.jpeg
git commit -m "Add: foto nuevo plato"
git push
```

---

## ⚙️ Cloudflare Pages (solo la primera vez)

1. **Cloudflare Dashboard** → Workers & Pages → Create → Pages → Connect to Git
2. Elegí el repo `22-patagonia-carta`
3. Settings:
   - Framework preset: **None**
   - Build command: *(vacío)*
   - Output directory: **/** (raíz)
4. Save and Deploy

Después de eso, cada `git push` redepliega solo automáticamente.

---

## 💰 Cómo cargar los precios (para Thali)

1. Abrí `https://tu-sitio.pages.dev/admin.html`
2. PIN: **2222** (podés cambiarlo en `admin.js`, línea 3)
3. Editá los precios de cada plato
4. Botón **"Exportar menu-data.js"** → descarga el archivo
5. Mandáselo al dev → él hace `git push` → precios actualizados en el sitio

O, si querés hacerlo vos directo:
```cmd
copy /Y C:\Users\TU_USUARIO\Downloads\menu-data.js .\menu-data.js
git add . && git commit -m "precios" && git push
```

---

## 📸 Agregar fotos nuevas (cuando Thali mande más)

1. Guardá la foto en `assets/dishes/nombre-plato.jpeg`
2. En `menu-data.js`, al item correspondiente agregá: `img: "assets/dishes/nombre-plato.jpeg"`
3. `git add . && git commit -m "foto nuevo plato" && git push`
