declare namespace NodeJS {
  export interface ProcessEnv {
    // Environment
    NODE_ENV: string;

    // Database
    DATABASE_URL: string;
    DATABASE_DIRECT_URL: string;

    // Auth.js
    AUTH_SECRET: string;
    AUTH_URL: string;

    // OAuth Providers - Google
    AUTH_GOOGLE_ID: string;
    AUTH_GOOGLE_SECRET: string;

    // Google Calendar Integration
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    GOOGLE_REDIRECT_URI: string;

    // Google API Credentials (JSON string)
    GOOGLE_API_CREDENTIALS: string;

    // Encryption
    ENCRYPTION_KEY: string;

    // Email Settings
    EMAIL_FROM: string;
    EMAIL_FROM_NAME: string;
    EMAIL_SERVER_HOST: string;
    EMAIL_SERVER_PORT: string;
    EMAIL_SERVER_USER: string;
    EMAIL_SERVER_PASSWORD: string;

    // NextAuth & App URLs
    NEXT_PUBLIC_APP_URL: string;
    NEXT_PUBLIC_WEBAPP_URL: string;

    // Availability Config
    NEXT_AVAILABILITY_SCHEDULE_INTERVAL: string;

    // Logger Level
    NEXT_PUBLIC_LOGGER_LEVEL: string;

    // Security & Hostname Config
    ALLOWED_HOSTNAMES: string;
    RESERVED_SUBDOMAINS: string;

    // Support
    SUPORT_WHATSAPP_NUMBER: string;
  }
}
