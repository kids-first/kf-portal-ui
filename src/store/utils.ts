import { AxiosError } from 'axios';

export const handleThunkApiReponse = <T>(config: {
  error: AxiosError | undefined;
  data: T;
  reject: (error: string) => any;
  onSuccess?: () => void;
  onError?: (error: AxiosError) => void;
}): T => {
  if (config.error) {
    if (config.onError) {
      config.onError(config.error);
    }

    return config.reject(config.error?.message);
  }

  if (config.onSuccess) {
    config.onSuccess();
  }

  return config.data;
};
