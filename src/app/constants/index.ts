const MARKADO_URL = process.env.MARKADO_URL || (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://app.markado.com');

export {MARKADO_URL};
