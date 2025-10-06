import { BuildConfig } from '../config/build-config.interface';

export const environment: Partial<BuildConfig> = {
  production: true,

  serverLocation: 'https://backend.deepblue-documents.lib.umich.edu/server',

  // Angular Universal settings
  universal: {
    preboot: true,
    async: true,
    time: false
  }
};
