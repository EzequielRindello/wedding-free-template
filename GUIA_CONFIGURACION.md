# Guia de Configuracion

Esta guia explica como dejar la landing totalmente lista para publicar.

## 1. Requisitos
- Node.js 18+
- npm 9+

## 2. Instalacion y ejecucion
```bash
npm install
npm run dev
```

Build de produccion:
```bash
npm run build
npm run preview
```

## 3. Archivo principal de configuracion
Toda la personalizacion central esta en:
- `src/content/siteData.js`

Edita este archivo y reemplaza placeholders.

### 3.1 Datos de pareja y CTAs
Objeto: `couple`
- `names`
- `heroSubtitle`
- `splashButtonLabel`
- `heroPrimaryCtaLabel`
- `heroSecondaryCtaLabel`

Objeto: `stickyCta`
- `primaryLabel`
- `secondaryLabel`

### 3.2 Cuenta regresiva
Objeto: `countdown`
- `targetDate` (formato ISO)
- `displayDate`
- `introText`

### 3.3 Ceremonia, mapas y calendario
Objeto: `ceremony`
- `venueName`
- `addressLines`
- `mapUrl` (Google Maps real)
- `wazeUrl` (Waze real)
- `mapCta`, `wazeCta`
- `calendarEvent.title`
- `calendarEvent.startDateTime`
- `calendarEvent.endDateTime`
- `calendarEvent.location`
- `calendarEvent.description`
- `icsFileName`

Si `mapUrl` o `wazeUrl` estan vacios, los botones quedan deshabilitados.

### 3.4 Logistica
Objeto: `logistics`
- `title`
- `subtitle`
- `items` (cards de info)
- `includesTitle`
- `includes`

### 3.5 RSVP embebido
Objeto: `rsvp`
- `title`, `subtitle`, `description`, `supportText`
- `deadlineText`
- `submitLabel`, `submittingLabel`
- `successTitle`, `successMessage`
- `errorMessage`
- `webhookUrl` (para guardar respuestas reales)
- `formUrl` (fallback externo opcional)
- `externalCtaLabel`

Si `webhookUrl` esta vacio, el formulario funciona en modo demo (no persiste datos).

### 3.6 Confianza
Objeto: `trust`
- `title`
- `storyTitle`, `storyText`
- `hostsTitle`, `hosts`
- `authenticityNote`
- `confirmedGuests`, `targetGuests` (barra de progreso)
- `supportWhatsappUrl` (CTA de ayuda)

### 3.7 FAQ
Objeto: `faq`
- `title`
- `items[]` con `id`, `title`, `content`
- opcional `details[]` para bloques extra

### 3.8 Pedido de canciones
Objeto: `songRequest`
- `title`
- `description`
- `ctaLabel`
- `formUrl`

### 3.9 Footer social
Objeto: `social`
- `title`
- `contacts[]` con `name`, `instagramUrl`, `whatsappUrl`
- `footerMessage`
- `footerDate`

## 4. SEO y metadata
Archivo:
- `index.html`

Campos que debes actualizar antes de publicar:
- `link rel="canonical"` (poner dominio real)
- `meta property="og:url"` (poner dominio real)
- `title`
- `meta name="description"`
- `meta og:*` y `twitter:*` segun branding final

## 5. Analytics (eventos ya instrumentados)
Utilidad:
- `src/utils/analytics.js`

Comportamiento:
- Hace push a `window.dataLayer`
- Si existe `window.gtag`, envia `gtag('event', ...)`

Eventos principales:
- `hero_cta_click`
- `sticky_cta_click`
- `map_click`
- `calendar_click`
- `rsvp_start`
- `rsvp_submit_attempt`
- `rsvp_submit_success`
- `rsvp_submit_error`
- `rsvp_external_click`
- `support_whatsapp_click`

## 6. Payload del webhook RSVP
El formulario envia JSON a `rsvp.webhookUrl` con:
- `fullName`
- `email`
- `attending`
- `guests`
- `note`
- `source` (valor: `wedding-landing-page`)
- `submittedAt` (ISO)

## 7. Assets
- Hero: `public/images/hero-mobile.webp`, `public/images/hero-desktop.webp`
- Slider: `src/assets/images/slider-*.webp`
- Musica: `src/assets/music/wedding-song.mp3`
- Favicon: `public/favicon/favicono.png`

## 8. Checklist de salida a produccion
1. Completar todos los links reales en `src/content/siteData.js`.
2. Actualizar fechas reales en `countdown` y `ceremony.calendarEvent`.
3. Configurar `canonical` y `og:url` en `index.html` con dominio final.
4. Verificar formulario RSVP con webhook real.
5. Ejecutar:
   - `npm run lint`
   - `npm run build`
6. Probar mobile real (320px-430px) y desktop.

## 9. Opcional: desactivar musica
Si no quieres musica:
- Quitar `MusicPlayerButton` en `src/App.jsx`.
- Quitar el hook `useAudioPlayer` de `src/App.jsx`.
- Quitar el import del mp3 en `src/App.jsx`.
