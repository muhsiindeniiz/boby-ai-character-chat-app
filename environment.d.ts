namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_DEPLOY_ENV: 'production' | 'test' | 'development';
    NEXT_PUBLIC_APP_URL: string;
    NEXT_PUBLIC_SUPABASE_URL: string;
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: string;
    GROQ_API_KEY: string;
  }
}

declare module 'groq-sdk' {
  export default class Groq {
    constructor(config: { apiKey: string });
    chat: {
      completions: {
        create: (params: any) => Promise<any>;
      };
    };
    models: {
      list: () => Promise<any>;
    };
  }
}