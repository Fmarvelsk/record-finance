import { ApiResponse } from '../interfaces/response.interface';

export function successApiResponse<T>(
  res: Partial<ApiResponse<T>>,
): ApiResponse<T> {
  const successRes: ApiResponse<T> = {
    successful: true,
    message: res.message ?? 'Successful!',
    data: res.data ?? null,
  };

  if (res.metadata) successRes.metadata = res.metadata;

  return successRes;
}

export function errorApiResponse(res: Partial<ApiResponse>): ApiResponse {
  const errorRes: ApiResponse = {
    successful: false,
    message: res.message ?? 'An Error Occurred',
    errorCode: res.errorCode,
    devErrorMessage: res.devErrorMessage,
  };

  if (res.userErrorMessage) errorRes.userErrorMessage = res.userErrorMessage;

  return errorRes;
}
