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

  // When true, the username/password login form is rendered and OIDC is hidden (exclusive toggle).
  // Set to false (default) to show only OIDC/non-password methods (production/workshop behaviour).
  // Set to true for environments where DSpace OIDC is disabled and password auth is required (demo).
  showPasswordLogin?: boolean;
}
