const siteData = {
  couple: {
    names: 'Sofia & Mateo',
    heroSubtitle: '¡NOS CASAMOS!',
    splashButtonLabel: 'Entrar',
    heroPrimaryCtaLabel: 'Confirmar asistencia',
    heroSecondaryCtaLabel: 'Como llegar'
  },
  stickyCta: {
    primaryLabel: 'RSVP',
    secondaryLabel: 'Ubicación'
  },
  countdown: {
    targetDate: '2027-04-03T20:30:00',
    displayDate: '03 • ABRIL • 2027',
    introText: '¡Ya falta poco para celebrar juntos!'
  },
  ceremony: {
    sectionId: 'ceremony',
    title: 'Ceremonia y Fiesta',
    venueName: 'Puerto Norte Design Hotel',
    addressLines: ['Av. Luis Cándido Carballo 148', 'Rosario, Santa Fe'],
    mapUrl: 'https://maps.google.com/?q=Puerto+Norte+Design+Hotel+Rosario',
    wazeUrl: 'https://www.waze.com/ul?ll=-32.934976,-60.655363&navigate=yes',
    mapCta: 'Google Maps',
    wazeCta: 'Waze',
    mapUnavailableText: 'Configurá los links de mapas en src/content/siteData.js si querés cambiarlos.',
    calendarCta: 'Agregar a Google Calendar',
    icsCta: 'Descargar calendario',
    icsFileName: 'boda-sofia-mateo.ics',
    calendarUnavailableText: 'Configurá la fecha y datos del evento para habilitar el calendario.',
    calendarEvent: {
      title: 'Casamiento de Sofia y Mateo',
      startDateTime: '2027-04-03T20:30:00-03:00',
      endDateTime: '2027-04-04T04:30:00-03:00',
      location: 'Puerto Norte Design Hotel, Av. Luis Cándido Carballo 148, Rosario, Santa Fe',
      description: 'Ceremonia y fiesta de casamiento de Sofia y Mateo.'
    },
    timeline: [
      {
        time: '19:45',
        name: 'Recepción'
      },
      {
        time: '20:30',
        name: 'Ceremonia'
      },
      {
        time: '22:00',
        name: 'Cena y brindis'
      },
      {
        time: '00:30',
        name: 'Fiesta'
      }
    ],
    note: 'Agenda sujeta a ajustes de último momento.'
  },
  logistics: {
    sectionId: 'logistics',
    title: 'Info clave para el gran día',
    subtitle: 'Queremos que llegues, disfrutes y vuelvas tranquilo.',
    items: [
      {
        title: 'Estacionamiento',
        description: 'Hay cochera en el hotel y estacionamiento medido en calles cercanas.'
      },
      {
        title: 'Menú y alergias',
        description: 'Avisanos por RSVP si necesitás menú vegetariano, celíaco o sin lactosa.'
      },
      {
        title: 'Dress code',
        description: 'Elegante sport. Recomendamos calzado cómodo para disfrutar la pista.'
      },
      {
        title: 'Puntualidad',
        description: 'La ceremonia comienza puntual, ideal llegar 20 minutos antes.'
      }
    ],
    includesTitle: 'La invitación incluye',
    includes: [
      'Recepción y cena completa',
      'Barra de tragos con y sin alcohol',
      'Mesa dulce y brindis',
      'Fiesta y cabina de fotos'
    ]
  },
  rsvp: {
    sectionId: 'rsvp',
    title: 'Confirmación de Asistencia',
    subtitle: 'Nos encantaría compartir este momento con vos',
    description: 'Por favor, confirmá tu asistencia antes del 15 de marzo de 2027.',
    supportText: 'Tu presencia hará este día inolvidable.',
    deadlineText: 'Cupos limitados. Confirmá antes del 15/03/2027.',
    submitLabel: 'Enviar confirmación',
    submittingLabel: 'Enviando...',
    successTitle: '¡Gracias por confirmar!',
    successMessage: 'Recibimos tu respuesta. Si tenés cambios, escribinos por WhatsApp.',
    errorMessage: 'No pudimos enviar tu confirmación. Probá nuevamente en unos minutos.',
    localModeText: 'Modo demo activo: para guardar respuestas en un backend real, completá webhookUrl.',
    webhookUrl: '',
    formUrl: 'https://forms.gle/1M7jvLkgQJr4zR8T8',
    externalCtaLabel: 'Abrir formulario externo',
    formUnavailableText: 'Configurá el formulario RSVP en src/content/siteData.js si querés cambiarlo.'
  },
  trust: {
    sectionId: 'trust',
    title: 'Queremos que vengas sin dudas',
    storyTitle: 'Nuestra historia',
    storyText: 'Nos conocimos en 2019 entre amigos y desde ese día elegimos compartir cada paso juntos.',
    hostsTitle: 'Familias anfitrionas',
    hosts: ['Familia Alvarez', 'Familia Rinaldi'],
    authenticityNote: 'Este evento es privado y toda la información oficial se publica en esta landing.',
    rsvpProgressLabel: 'Confirmados hasta hoy',
    confirmedGuests: 84,
    targetGuests: 120,
    supportCtaLabel: 'Resolver dudas por WhatsApp',
    supportWhatsappUrl: 'https://wa.me/5493415550142',
    supportFallbackText: 'Configurá el WhatsApp de soporte en src/content/siteData.js.'
  },
  faq: {
    title: 'Dudas Frecuentes',
    items: [
      {
        id: 'dress-code',
        title: 'Dress code',
        content: 'Elegante sport. Traé calzado cómodo para bailar.'
      },
      {
        id: 'ninos',
        title: '¿Pueden asistir niños?',
        content: 'Este evento será solo para adultos.'
      },
      {
        id: 'regalo',
        title: 'Regalos',
        content: 'Si querés regalarnos algo, podés colaborar con nuestra luna de miel.',
        details: [
          {
            label: 'Alias',
            value: 'SOFIAYMATEO.BODA'
          },
          {
            label: 'Datos',
            value: 'Sofía Alvarez - Mercado Pago'
          }
        ]
      }
    ]
  },
  songRequest: {
    title: '¡Que no falte tu tema favorito!',
    description: 'Ayudanos a armar la playlist de la noche.',
    ctaLabel: 'Sugerir canción',
    formUrl: 'https://forms.gle/2nSf9V8sJkYxQdJ59',
    formUnavailableText: 'Configurá el formulario de canciones en src/content/siteData.js si querés cambiarlo.'
  },
  social: {
    title: 'Contactanos',
    contacts: [
      {
        name: 'Sofía',
        instagramUrl: 'https://www.instagram.com/sofia.alvarez',
        whatsappUrl: 'https://wa.me/5493415550101'
      },
      {
        name: 'Mateo',
        instagramUrl: 'https://www.instagram.com/mateo.rinaldi',
        whatsappUrl: 'https://wa.me/5493415550102'
      }
    ],
    linksUnavailableText: 'Completá los links de redes en src/content/siteData.js si querés cambiarlos.',
    footerMessage: 'Gracias por ser parte de nuestra historia.',
    footerDate: 'Sábado • 03 Abril • 2027'
  }
};

export default siteData;
