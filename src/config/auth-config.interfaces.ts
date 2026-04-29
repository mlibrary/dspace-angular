import { Config } from './config.interface';

export interface AuthTarget {
  host: string;
  page: string;
}

export interface AuthConfig extends Config {
  target?: AuthTarget;

  ui: {
    // The amount of time before the idle warning is shown
    timeUntilIdle: number;
    // The amount of time the user has to react after the idle warning is shown before they are logged out.
    idleGracePeriod: number;
  };

  rest: {
    // If the rest token expires in less than this amount of time, it will be refreshed automatically.
    // This is independent from the idle warning.
    timeLeftBeforeTokenRefresh: number;
  };

  // When true, the username/password login form is rendered and non-password authentication methods are hidden.
  // Set to false (default) to show non-password authentication methods instead of the password form
  // (for example OIDC in production/workshop environments).
  // Set to true for environments where password auth is required and non-password methods should not be shown (demo).
  showPasswordLogin?: boolean;
}
