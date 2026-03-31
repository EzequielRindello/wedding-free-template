# Backlog + Estado real de implementacion (formato tickets Jira)

Fecha: 2026-03-30  
Proyecto: wedding-free-template  
Objetivo: proponer mejoras reales para una landing de boda, priorizadas y listas para planificar.

## Estado de implementacion actual (frontend + backend simple)

Actualizado: 2026-03-30

- WED-101 [DONE]
- WED-102 [DONE]
- WED-103 [DONE]
- WED-104 [DONE]
- WED-105 [DONE]
- WED-106 [DONE]
- WED-107 [DONE]
- WED-108 [DONE]
- WED-109 [DONE]
- WED-110 [DONE]
- WED-111 [DONE]

Resumen: ya se implemento el bloque grande de producto con frontend completo y backend simple. Incluye RSVP avanzado, confirmacion persistente, travel, agenda extendida, regalos, privacidad, SEO dinamico, fallback offline, API Node + Prisma (SQLite) y panel admin para gestionar RSVP/Song Requests.

### Alcance fullstack disponible hoy

- API publica: altas de RSVP y SongRequest.
- API admin con token: listar, editar y eliminar RSVP/SongRequest.
- Panel admin frontend en `/admin` (o `?admin=1`) conectado al CRUD admin.
- Capabilities por token (`/api/admin/capabilities`) para mostrar/ocultar funciones en UI.
- Soporte de token readonly opcional para acceso de solo lectura.
- Scripts de desarrollo fullstack: `dev:api`, `dev:full`, `db:generate`, `db:push`, `db:studio`.

## Criterios usados para recomendar

- Relevancia para invitados: reducir preguntas por WhatsApp y mejorar claridad del evento.
- Viabilidad técnica: cambios implementables en la base actual React + Vite + siteData centralizado.
- Impacto en conversión: más confirmaciones RSVP completas y menos abandono.
- Mantenibilidad: mantener modo demo y configuración simple para quien use la plantilla.

## Referencias externas consideradas

- The Knot: funcionalidades más esperadas por invitados en una wedding website (RSVP, agenda, dress code, lodging/travel, privacidad).
- Google Search Central SEO Starter Guide: títulos, snippets, canonicals, contenido útil y discoverability.
- web.dev (Core Web Vitals / CLS): evitar saltos de layout con tamaños reservados en imágenes y bloques dinámicos.
- GOV.UK Design System (Confirmation pages): confirmaciones con referencia, próximos pasos y contacto.

---

## WED-101 [DONE] - RSVP con cupos por grupo y nombres de acompañantes

Tipo: Story  
Prioridad: Alta  
Estimación: 8 puntos

### Problema
Hoy el RSVP acepta una cantidad total de personas, pero no modela bien grupos familiares ni nombres de acompañantes.

### Implementación propuesta
1. Extender src/content/siteData.js con reglas configurables:
   - maxGuestsPerInvite
   - requireGuestNames
   - requireDietaryInfo
2. Actualizar src/components/RsvpForm.jsx para:
   - Mostrar campos dinámicos de nombres según cantidad de invitados.
   - Validar rangos y campos obligatorios antes de enviar.
3. Incluir payload estructurado de acompañantes en envío webhook.
4. Agregar eventos en src/utils/analytics.js:
   - rsvp_validation_error
   - rsvp_guest_details_completed

### Criterios de aceptación
1. Cuando una persona marca asistencia y cantidad mayor a 1, se solicitan nombres de acompañantes.
2. Si faltan datos requeridos, el formulario no se envía y muestra errores claros.
3. El webhook recibe los datos de acompañantes en formato consistente.
4. Si el webhook está vacío, sigue funcionando el modo demo sin romper la UX.

Estado implementado: completo en frontend mock.

---

## WED-102 [DONE] - Pantalla de confirmación RSVP con referencia y próximos pasos

Tipo: Story  
Prioridad: Alta  
Estimación: 5 puntos

### Problema
La confirmación actual muestra éxito genérico, pero no da referencia ni pasos siguientes concretos.

### Implementación propuesta
1. Crear componente de confirmación reutilizable:
   - src/components/RsvpConfirmation.jsx
2. En src/components/RsvpForm.jsx, reemplazar bloque de éxito por estado con:
   - Código de referencia (si llega del backend) o fallback local.
   - Mensaje de próximos pasos (ejemplo: cambios por WhatsApp, fecha límite).
   - CTA para agregar evento al calendario.
3. Guardar la confirmación en localStorage para evitar pérdida al recargar.
4. Instrumentar evento analytics:
   - rsvp_confirmation_view

### Criterios de aceptación
1. Tras envío exitoso, el usuario ve una confirmación con referencia.
2. La confirmación indica claramente qué hacer si necesita cambios.
3. Si recarga dentro de la misma sesión, la confirmación sigue visible.

Estado implementado: completo en frontend mock.

---

## WED-103 [DONE] - Sección de hospedaje y transporte

Tipo: Story  
Prioridad: Alta  
Estimación: 8 puntos

### Problema
Falta información clave para invitados de fuera de la ciudad (hoteles, traslados, tiempos de viaje).

### Implementación propuesta
1. Añadir nuevo bloque en src/content/siteData.js:
   - travel.title
   - travel.hotels[] (nombre, distancia, link de reserva)
   - travel.transport[] (opciones, horarios, punto de encuentro)
   - travel.notes
2. Crear componente src/components/TravelInfo.jsx.
3. Integrar el componente en src/App.jsx después de Ceremony o EventLogistics.
4. Añadir estilos en src/global.css.
5. Trackear clicks externos a hoteles/transportes.

### Criterios de aceptación
1. Se muestran al menos 2 opciones de alojamiento y 1 de transporte cuando están configuradas.
2. Si no hay datos configurados, la sección se oculta sin romper layout.
3. Los links externos abren en nueva pestaña y se registran en analytics.

Estado implementado: completo en frontend mock.

---

## WED-104 [DONE] - Agenda extendida multi-evento

Tipo: Story  
Prioridad: Media  
Estimación: 8 puntos

### Problema
La agenda actual es lineal y limitada. Muchas bodas incluyen civil, ceremonia, recepción y after.

### Implementación propuesta
1. Evolucionar ceremony.timeline a eventSchedule.events[] en src/content/siteData.js con:
   - type (civil, ceremonia, fiesta, after)
   - dateTime
   - venue
   - address
   - mapUrl
2. Crear componente src/components/EventSchedule.jsx con visual de agenda por bloques.
3. Mantener compatibilidad con timeline actual para no romper instalaciones existentes.
4. Reusar utilidades src/utils/calendarLinks.js para permitir agregar cada bloque al calendario.

### Criterios de aceptación
1. Si hay eventSchedule.events, se renderiza agenda extendida.
2. Si no hay eventSchedule.events, se mantiene el comportamiento actual.
3. Cada bloque puede tener CTA de mapa y calendario.

Estado implementado: completo en frontend mock (con compatibilidad al timeline actual).

---

## WED-105 [DONE] - Sección dedicada de regalos y luna de miel

Tipo: Story  
Prioridad: Media  
Estimación: 5 puntos

### Problema
La información de regalos hoy vive dentro de FAQ, lo que reduce descubrimiento.

### Implementación propuesta
1. Agregar bloque giftRegistry en src/content/siteData.js:
   - title
   - intro
   - cashGift (alias, titular, entidad)
   - externalLinks[]
2. Crear src/components/GiftRegistry.jsx.
3. Insertar componente antes de FAQ en src/App.jsx.
4. Mantener FAQ para dudas frecuentes, sin datos bancarios largos.

### Criterios de aceptación
1. La sección de regalos aparece solo si está configurada.
2. Alias y datos de transferencia son fáciles de copiar desde mobile.
3. FAQ queda enfocada en preguntas operativas.

Estado implementado: completo en frontend mock.

---

## WED-106 [DONE] - Modo privacidad del sitio (password + indexación)

Tipo: Story  
Prioridad: Media  
Estimación: 8 puntos

### Problema
Algunas parejas prefieren restringir acceso y evitar indexación pública.

### Implementación propuesta
1. Agregar flags de privacidad en src/content/siteData.js:
   - privacy.enabled
   - privacy.password
   - privacy.allowIndexing
2. Crear pantalla de acceso simple en frontend:
   - src/components/PrivateAccessGate.jsx
3. Persistir acceso válido en sessionStorage.
4. Manejar meta robots dinámicamente en index.html + runtime helper (si allowIndexing false, usar noindex,nofollow).
5. Documentar limitación: protección básica cliente, no reemplaza seguridad backend.

### Criterios de aceptación
1. Si privacy.enabled está activo, la landing no se muestra sin contraseña correcta.
2. Si allowIndexing es false, la página publica robots noindex.
3. La UX de acceso funciona correctamente en mobile.

Estado implementado: completo para frontend mock (acceso por clave en cliente + robots dinamico).

---

## WED-107 [DONE] - Embudo de analítica de conversión RSVP

Tipo: Story  
Prioridad: Alta  
Estimación: 5 puntos

### Problema
Hay tracking de eventos sueltos, pero no un embudo claro para medir abandono.

### Implementación propuesta
1. Definir funnel estándar:
   - landing_view
   - cta_rsvp_click
   - rsvp_start
   - rsvp_submit_attempt
   - rsvp_submit_success
2. Unificar nomenclatura en src/utils/analytics.js y componentes que ya trackean eventos.
3. Agregar parámetros consistentes:
   - section
   - deviceType
   - hasWebhook
4. Documentar dashboard sugerido (GA4/Looker) en GUIA_CONFIGURACION.md.

### Criterios de aceptación
1. Todos los pasos del funnel generan eventos con nombres consistentes.
2. Se puede calcular tasa de conversión completa de RSVP.
3. El tracking no rompe la app si gtag no existe.

Estado implementado: completo en frontend.
Incluye documentacion de funnel y dashboard sugerido en GUIA_CONFIGURACION.md.

---

## WED-108 [DONE] - SEO técnico y social sharing dinámico

Tipo: Story  
Prioridad: Media  
Estimación: 8 puntos

### Problema
La metadata está hardcodeada y no escala bien para cada pareja/dominio.

### Implementación propuesta
1. Mover campos SEO a src/content/siteData.js:
   - seo.title
   - seo.description
   - seo.canonicalUrl
   - seo.ogImage
2. Actualizar index.html para usar placeholders gestionables en build.
3. Añadir validación en GUIA_CONFIGURACION.md para evitar canonical inválido.
4. Implementar JSON-LD Event básico (fecha, lugar, nombre del evento).
5. Confirmar compatibilidad con nota del repo sobre canonical absoluto.

### Criterios de aceptación
1. Title, description, canonical y OG se pueden cambiar sin tocar múltiples archivos.
2. No se rompe build por canonical relativo.
3. Rich results test no arroja errores críticos para JSON-LD Event.

Estado implementado: completo en frontend.
Decision tomada: estrategia runtime via src/utils/seo.js con validacion de canonical absoluto y fallback seguro.

---

## WED-109 [DONE] - Mejora de performance mobile (LCP/CLS)

Tipo: Story  
Prioridad: Alta  
Estimación: 8 puntos

### Problema
Hay riesgo de CLS/LCP subóptimos por contenido dinámico y carga de fuentes/imágenes.

### Implementación propuesta
1. Reservar dimensiones explícitas en imágenes de galería y hero para reducir CLS.
2. Revisar carga de fuentes (preconnect ya existe) y definir estrategia de fallback.
3. Optimizar render del splash y secciones críticas para priorizar primer contenido visible.
4. Crear checklist de verificación con Lighthouse Mobile (LCP, CLS, INP).
5. Agregar script npm run perf:check con recomendaciones documentadas.

### Criterios de aceptación
1. CLS <= 0.1 en pruebas Lighthouse mobile de referencia.
2. Hero no produce saltos visuales al cargar.
3. Se documenta procedimiento reproducible de medición.

Estado implementado: completo en frontend.
Incluye:
1. Script reproducible npm run perf:check.
2. Baseline mobile en perf/baseline.mobile.json.
3. Checklist de medicion en GUIA_CONFIGURACION.md.

Nota de resultado actual:
- LCP medido en baseline actual: 3.33s (por encima de 2.5s recomendado).
- CLS medido: 0.023 (dentro de objetivo <= 0.1).
- INP en lab: null (sin interaccion sintetica relevante en corrida actual).

---

## WED-110 [DONE] - Resiliencia de red: fallback offline para navegación

Tipo: Story  
Prioridad: Baja  
Estimación: 5 puntos

### Problema
Si la conexión falla, la experiencia queda en error de navegador sin contexto.

### Implementación propuesta
1. Crear offline.html con mensaje de estado y botón reintentar.
2. Registrar service worker mínimo para servir offline.html en fallos de navegación.
3. Mostrar aviso en formularios cuando no hay conexión antes de enviar RSVP.
4. Documentar cómo desactivar esta feature para instalaciones simples.

### Criterios de aceptación
1. Al quedar offline y navegar, se muestra página propia de fallback.
2. Cuando vuelve internet, el usuario puede recargar y continuar.
3. El fallback no interfiere con desarrollo local.

Estado implementado: completo en frontend mock.

---

## Roadmap restante (post fullstack inicial)

Sprint R1 (optimizacion incremental):
- Seguir iterando LCP para acercarlo a <= 2.5s sin perder UX visual.

Sprint R2 (mejoras de operacion admin):
- Filtros y busqueda en panel admin.
- Export CSV de RSVP.
- Vista de detalle para restricciones alimentarias y acompanantes.

Sprint R3 (hardening backend):
- Endurecer seguridad de admin (rotacion de token, rate limit, logs).
- Restringir CORS para dominio de produccion.
- Agregar tests de endpoints criticos.

## Notas finales

- Todas las propuestas están pensadas para mantener la filosofía del proyecto: plantilla fácil de personalizar.
- Ninguna feature depende obligatoriamente de backend, pero varias ganan mucho valor con API real.
- Prioridad alta recomendada para todo lo que reduzca fricción en RSVP y dudas logísticas.
