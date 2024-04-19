import { BuildConfig } from '../config/build-config.interface';

export const environment: Partial<BuildConfig> = {
  production: true,

  serverLocation: 'http://localhost:8080/server',

  // Angular Universal settings
  universal: {
    preboot: true,
    async: true,
    time: false
  }
};
