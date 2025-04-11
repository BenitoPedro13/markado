declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: string;
    DATABASE_URL: string;
    AUTH_SECRET: string;
    AUTH_URL: string;
    AUTH_GOOGLE_ID: string;
    AUTH_GOOGLE_SECRET: string;
  }
}