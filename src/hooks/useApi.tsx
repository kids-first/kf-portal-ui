// eslint-disable-next-line react-hooks/exhaustive-deps
import { useState, useEffect } from 'react';
import { AxiosRequestConfig } from 'axios';
import { sendRequest } from 'services/api';

interface OwnProps {
  config: AxiosRequestConfig;
  skip?: boolean;
}

const useApi = <T,>({ config, skip = false }: OwnProps) => {
  const [result, setResult] = useState<T>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>('');
  const [refreshIndex, setRefreshIndex] = useState(0);

  const refresh = () => {
    setRefreshIndex(refreshIndex + 1);
  };

  useEffect(() => {
    let cancelled = false;
    if (skip) {
      setLoading(false);
    } else {
      setLoading(true);
      setError(undefined);

      sendRequest<T>({
        ...config,
        method: config.method ? config.method : 'GET',
      }).then(({ data, error }) => {
        if (error) {
          setLoading(false);
          setError(error.message);
        } else if (!cancelled) {
          setResult(data);
          setLoading(false);
        }
      });
    }
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line
  }, [JSON.stringify(config), refreshIndex]);

  return { result, loading, error, refresh };
};

export default useApi;
