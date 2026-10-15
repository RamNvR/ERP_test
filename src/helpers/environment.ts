export const environment = {
  baseURL: process.env.BASE_URL ?? 'https://cloud.idurarapp.com',
  apiBaseURL: process.env.API_BASE_URL ?? 'https://server.idurarapp.com',
  email: process.env.APP_EMAIL,
  password: process.env.APP_PASSWORD,
  defaultLanguage: process.env.DEFAULT_LANGUAGE ?? 'english',
};

export const hasCredentials = Boolean(environment.email && environment.password);
