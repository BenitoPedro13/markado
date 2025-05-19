const MARKADO_URL = process.env.MARKADO_URL || (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://app.markado.co');

// Extract just the domain part from the URL
const MARKADO_DOMAIN = MARKADO_URL.includes('://') 
  ? MARKADO_URL.split('://')[1].replace(/\/$/, '') 
  : MARKADO_URL.replace(/\/$/, '');

export {MARKADO_URL, MARKADO_DOMAIN};
