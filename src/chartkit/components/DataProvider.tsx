import { FunctionComponent, ReactElement, useEffect, useState } from 'react';
import { Api } from 'store/apiTypes';

export interface State {
  isLoading: boolean;
  error: Error | null;
  data: any;
}

type OwnProps = {
  url: string;
  transform?: Function;
  children: (s: State) => ReactElement;
};

type Props = OwnProps & Api;

const DataProvider: FunctionComponent<Props> = ({
  api,
  url = '',
  transform = (x: any) => x,
  children,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async function fetchThenTransformData() {
      setIsLoading(true);
      try {
        const rawData = await api({ method: 'get', url: url });
        const data = transform(rawData);
        setData(data);
      } catch (e) {
        setError(e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [api, url, transform]);

  return children({ isLoading, data, error });
};

export default DataProvider;
