export interface ExternalScript {
  name: string;
  src: string;
}

export enum ExternalScriptsNames {
  DIMENSIONS = 'dimensions-embed',
}

export enum ExternalScriptsStatus {
  LOADED = 'loaded',
  ALREADY_LOADED = 'already loaded',
  NOT_LOADED = 'not loaded',
}

export const ExternalScriptsList: ExternalScript[] = [
  {
    name: ExternalScriptsNames.DIMENSIONS,
    src: 'https://badge.dimensions.ai/badge.js',

  },
];
