export interface WordEntry {
  arabic: string;
  transliteration: string;
  meaning: string;
  nuance: string;
  reference: string;
  category?: string;
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}