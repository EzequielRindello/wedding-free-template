const isValidDateString = (value) => {
  const parsed = new Date(value);
  return !Number.isNaN(parsed.getTime());
};

const toGoogleDate = (value) => {
  const iso = new Date(value).toISOString();
  return `${iso.replace(/[-:]/g, '').split('.')[0]}Z`;
};

const toIcsDate = (value) => {
  const iso = new Date(value).toISOString();
  return `${iso.replace(/[-:]/g, '').split('.')[0]}Z`;
};

const escapeIcsText = (value) => String(value || '')
  .replace(/\\/g, '\\\\')
  .replace(/;/g, '\\;')
  .replace(/,/g, '\\,')
  .replace(/\n/g, '\\n');

export const buildGoogleCalendarUrl = (eventData) => {
  if (!eventData?.title || !isValidDateString(eventData.startDateTime) || !isValidDateString(eventData.endDateTime)) {
    return '';
  }

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: eventData.title,
    dates: `${toGoogleDate(eventData.startDateTime)}/${toGoogleDate(eventData.endDateTime)}`,
    details: eventData.description || '',
    location: eventData.location || ''
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

export const buildIcsDataUri = (eventData) => {
  if (!eventData?.title || !isValidDateString(eventData.startDateTime) || !isValidDateString(eventData.endDateTime)) {
    return '';
  }

  const stamp = toIcsDate(new Date());
  const uid = `${stamp}@wedding-invite`;

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Wedding Invite//Landing Page//ES',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${toIcsDate(eventData.startDateTime)}`,
    `DTEND:${toIcsDate(eventData.endDateTime)}`,
    `SUMMARY:${escapeIcsText(eventData.title)}`,
    `LOCATION:${escapeIcsText(eventData.location || '')}`,
    `DESCRIPTION:${escapeIcsText(eventData.description || '')}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ];

  return `data:text/calendar;charset=utf-8,${encodeURIComponent(lines.join('\r\n'))}`;
};
