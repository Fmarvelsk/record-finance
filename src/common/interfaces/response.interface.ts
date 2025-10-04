import { CUSTOM_ERROR_CODE } from '../constants';

export interface ApiResponse<T = void> {
  successful: boolean;
  message: string;
  data?: T | null;
  metadata?: Record<string, unknown>;
  errorCode?: CUSTOM_ERROR_CODE;
  devErrorMessage?: string;
  userErrorMessage?: string;
}
