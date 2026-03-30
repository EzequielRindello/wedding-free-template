const siteData = {
  couple: {
    names: 'Juan & Pepita',
    heroSubtitle: '¡NOS CASAMOS!',
    splashButtonLabel: 'Entrar',
    heroPrimaryCtaLabel: 'Confirmar asistencia',
    heroSecondaryCtaLabel: 'Como llegar'
  },
  stickyCta: {
    primaryLabel: 'Confirmar asistencia',
    secondaryLabel: 'Como llegar'
  },
  countdown: {
    targetDate: '2027-04-03T21:30:00',
    displayDate: '03 • ABRIL • 2027',
    introText: '¡Listos para festejar juntos! Faltan...'
  },
  ceremony: {
    sectionId: 'ceremony',
    title: 'Ceremonia y Fiesta',
    venueName: 'Salón de Eventos "Club de Pepito"',
    addressLines: ['San Juan 1124', 'Rosario, Santa Fe'],
    mapUrl: '',
    wazeUrl: '',
    mapCta: 'Google Maps',
    wazeCta: 'Waze',
    mapUnavailableText: 'Configurá los links de mapas en src/content/siteData.js.',
    calendarCta: 'Agregar a Google Calendar',
    icsCta: 'Descargar calendario',
    icsFileName: 'evento-boda.ics',
    calendarUnavailableText: 'Configurá la fecha y datos del evento para habilitar el calendario.',
    calendarEvent: {
      title: 'Casamiento de Juan y Pepita',
      startDateTime: '2027-04-03T21:30:00-03:00',
      endDateTime: '2027-04-04T04:00:00-03:00',
      location: 'Salón de Eventos Club de Pepito, San Juan 1124, Rosario, Santa Fe',
      description: 'Ceremonia y fiesta de casamiento de Juan y Pepita.'
    },
    timeline: [
      {
        time: '21:30',
        name: 'Inicio de ceremonia'
      },
      {
        time: '04:00',
        name: 'Finalización de la fiesta'
      }
    ],
    note: 'Cerca de la fecha se definirán los detalles'
  },
  rsvp: {
    sectionId: 'rsvp',
    title: 'Confirmación de Asistencia',
    subtitle: 'Esperamos que puedas acompañarnos en este momento tan especial',
    description: 'Por favor, confirmanos tu asistencia antes del XX de xxxx de 20XX.',
    supportText: 'Tu presencia hará de este día algo inolvidable.',
    deadlineText: 'Cupos limitados. Confirmá antes del XX de xxxx.',
    submitLabel: 'Enviar confirmacion',
    submittingLabel: 'Enviando...',
    successTitle: '¡Gracias por confirmar!',
    successMessage: 'Recibimos tu respuesta. Si hay cambios, podes contactarnos por WhatsApp.',
    errorMessage: 'No pudimos enviar tu confirmacion. Probá nuevamente en unos minutos.',
    localModeText: 'Modo demo activo: para guardar respuestas en un servicio real, completá webhookUrl.',
    webhookUrl: '',
    formUrl: '',
    externalCtaLabel: 'Abrir formulario externo',
    formUnavailableText: 'Configurá el formulario RSVP en src/content/siteData.js.'
  },
  faq: {
    title: 'Dudas Frecuentes',
    items: [
      {
        id: 'dress-code',
        title: 'Dress Code',
        content: 'Elegante sport. Te recomendamos calzado cómodo para disfrutar toda la noche.'
      },
      {
        id: 'tarjeta',
        title: 'Tarjeta',
        content: 'Valor por persona: $xxxx.'
      },
      {
        id: 'regalo',
        title: 'Regalo',
        content: 'Si querés hacernos un regalo, podés colaborar con nuestra luna de miel.',
        details: [
          {
            label: 'Alias',
            value: 'tu.alias'
          },
          {
            label: 'Datos',
            value: 'Pepita - Mercado Pago'
          }
        ]
      }
    ]
  },
  songRequest: {
    title: '¡Que no falte tu tema favorito!',
    description: 'Ayudanos a armar tu playlist.',
    ctaLabel: 'Sugerir canción',
    formUrl: '',
    formUnavailableText: 'Configurá el formulario de canciones en src/content/siteData.js.'
  },
  social: {
    title: 'Contactanos',
    contacts: [
      {
        name: 'Nombre 1',
        instagramUrl: '',
        whatsappUrl: ''
      },
      {
        name: 'Nombre 2',
        instagramUrl: '',
        whatsappUrl: ''
      }
    ],
    linksUnavailableText: 'Completá los links de redes en src/content/siteData.js.',
    footerMessage: '¡Gracias por acompañarnos en este día tan especial!',
    footerDate: 'Tu • Fecha • 20XX'
  }
};

export default siteData;
