# Wedding Landing Page Template

Una landing page de boda simple, moderna y pensada para ser fácil de personalizar. Está diseñada con enfoque mobile-first y construida con React + Vite. (mobile fist porque el 90% de los usuarios que vean esto va a ser en el telefono...)

## Características

* Diseño mobile-first.
* Componentes organizados y fáciles de editar.
* Galería de imágenes, cuenta regresiva, información de ceremonia, formulario RSVP y footer con redes.
* Reproductor de música opcional.
* Estructura limpia sin datos personales.

## Guía de configuración

Antes de personalizar la landing, seguí la guía completa paso a paso:

- [GUIA_CONFIGURACION.md](GUIA_CONFIGURACION.md)

## Cómo usar esta plantilla

1. Hacé clic en "Use this template" en GitHub para crear tu propio repositorio.
2. Instalá dependencias y levantá el proyecto:

   ```bash
   cd wedding-free-template
   npm install
   npm run dev
   ```
3. Editá los componentes en `src/components`, reemplazá imágenes en `src/assets/images` y ajustá estilos en `global.css`.

## Modo Fullstack (Frontend + API)

Este repo ya incluye un backend simple en Node + Express + Prisma + SQLite para 2 CRUDs:

- RSVP
- Song Requests

Primera puesta en marcha recomendada:

```bash
npm install
cp .env.example .env
npm run db:push
npm run dev:full
```

Si usas PowerShell en Windows, el copiado puede ser:

```powershell
Copy-Item .env.example .env
```

El frontend usa `/api` en desarrollo mediante proxy de Vite (`vite.config.js`).

Comandos útiles:

```bash
npm run dev:api
npm run db:studio
npm run db:generate
```

API incluida:

- Health: `GET /api/health`
- Publicos:
   - `POST /api/public/rsvps`
   - `POST /api/public/song-requests`
- Admin (requiere header `x-admin-token`):
   - `GET /api/admin/capabilities`
   - `GET /api/admin/rsvps`
   - `PATCH /api/admin/rsvps/:id`
   - `DELETE /api/admin/rsvps/:id`
   - `GET /api/admin/song-requests`
   - `PATCH /api/admin/song-requests/:id`
   - `DELETE /api/admin/song-requests/:id`

Panel admin simple:

- Abrí `http://localhost:5173/admin` (o `http://localhost:5173/?admin=1`)
- Ingresá tu token (`ADMIN_TOKEN` en `.env`)
- El panel consulta `GET /api/admin/capabilities` para decidir qué funciones habilitar.
- Si el token es full: podés listar, editar y eliminar RSVP/Song Requests.
- Si el token es readonly: solo podés consultar, sin editar ni eliminar.
- El token se guarda en `localStorage` y se limpia desde "Cerrar sesion"

Tokens opcionales:

- `ADMIN_TOKEN`: acceso completo.
- `ADMIN_READONLY_TOKEN`: acceso solo lectura (opcional).

Flujo rapido de verificacion:

1. Ejecutar `npm run db:push`.
2. Ejecutar `npm run dev:full`.
3. Verificar `http://localhost:8787/api/health`.
4. Abrir `http://localhost:5173/admin` y gestionar registros.

## Estructura del proyecto

```
src/
 ┣ assets/
 ┃ ┣ images/        # Imágenes del slider y hero
 ┃ ┗ music/         # Música
 ┣ components/       # Componentes principales
 ┣ hooks/            # Hooks para audio y countdown
 ┣ pages/            # Landing Page
 ┣ App.jsx
 ┣ global.css
 ┗ main.jsx
```

## Personalización

* Cambiá nombres, fechas y textos en los componentes.
* Reemplazá imágenes en la carpeta `images`.
* Si no querés música, eliminá el hook correspondiente y el botón del reproductor.

## Palabras clave

wedding, wedding landing page, wedding template, boda, plantilla boda, invitación digital, landing page boda, mobile first, react template

