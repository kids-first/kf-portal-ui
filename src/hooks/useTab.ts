import history from 'services/history';
import { parse, stringify } from 'query-string';

const HASH_KEY = 'view';

function useTab(tabKeys: string[], defaultTabKey: string): [string, (k: string) => void] {
  const location = history.location;
  const parsedUrlHash = parse(location.hash);
  const hashValue = (parsedUrlHash[HASH_KEY] || '') as string;
  const tabKey = tabKeys.includes(hashValue) ? hashValue : defaultTabKey;

  function setTabKey(key: string) {
    const mustUpdateSearchParams = key !== hashValue;
    if (mustUpdateSearchParams) {
      history.push({
        ...location,
        hash: stringify({ ...parsedUrlHash, [HASH_KEY]: key }),
      });
    }
  }

  return [tabKey, setTabKey];
}

export default useTab;
