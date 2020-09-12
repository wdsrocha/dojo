declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BOT_EMAIL: string;
      BOT_PASSWORD: string;
    }
  }
}

export {};
