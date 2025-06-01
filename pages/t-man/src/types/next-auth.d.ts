import { LoginResponse } from '@/app/login/models/login-response';

declare module 'next-auth' {
  export interface User extends Result<LogiResponse> {}

  export interface CredentialsConfig<C extends Record<string, CredentialInput> = Record<string, CredentialInput>>
    extends CommonProviderOptions {
    type: 'credentials';
    credentials: C;
    authorize: (
      credentials: Record<keyof C, string> | undefined,
      req: Pick<RequestInternal, 'body' | 'query' | 'headers' | 'method'>,
    ) => Awaitable<Result<LoginResponse> | null>;
  }

  export interface Session {
    user: User;
    token: string;
    refreshToken: string;
    expiredTime: number;
  }
}

declare module 'next-auth/jwt' {
  export interface DefaultJWT {
    token: string;
    refreshToken: string;
    user: User;
    expiredTime: number;
  }
}
