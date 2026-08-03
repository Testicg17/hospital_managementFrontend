export const buildWhatsAppUrl = (phone, source = 'Public website') => {
  const cleanPhone = String(phone || '').replace(/[^0-9]/g, '');
  const message = [
    'Hello Eva Fertility & Laparoscopy team,',
    '',
    'My name is ______.',
    `I am contacting you from: ${source}.`,
    'I would like to book an appointment. Please guide me with the available time.',
  ].join('\n');

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
};
