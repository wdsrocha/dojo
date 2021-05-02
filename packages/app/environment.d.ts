declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_API_BASE_URL: string;
      BOT_EMAIL: string;
      BOT_PASSWORD: string;
    }
  }
}

export {};
