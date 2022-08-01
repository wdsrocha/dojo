declare global {
  namespace NodeJS {
    interface ProcessEnv {
      CODEFORCES_CLIENT_PASSWORD: string;
      CODEFORCES_CLIENT_USERNAME: string;
      NODE_ENV: 'development' | 'production';
      SPOJ_CLIENT_PASSWORD: string;
      SPOJ_CLIENT_USERNAME: string;
      URI_BOT_EMAIL: string;
      URI_BOT_PASSWORD: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
