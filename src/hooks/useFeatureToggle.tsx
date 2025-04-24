import { useEffect, useState } from 'react';
import { isBoolTrue } from 'helpers';

import useQueryParams from 'hooks/useQueryParams';

const FEATURE_TOGGLE_PREFIX = 'REACT_APP_FT_';

const isEnabledFromStorage = (name: string) => isBoolTrue(localStorage.getItem(name));
const isEnabledFromFlags = (name: string, paramFlag: string | null) =>
  isBoolTrue(paramFlag) || isBoolTrue(process.env[`${FEATURE_TOGGLE_PREFIX}${name}`]);

const useFeatureToggle = (name: string) => {
  const queryParams = useQueryParams();
  const [isEnabled, setEnabled] = useState(false);

  const hideFeature = () => {
    setEnabled(false);
    localStorage.setItem(name, 'false');
  };

  const persistentFeature = () => {
    setEnabled(true);
    localStorage.setItem(name, 'true');
  };

  useEffect(() => {
    const paramFlag = queryParams.get(name);
    const isCached = localStorage.getItem(name) !== null;

    setEnabled(isCached ? isEnabledFromStorage(name) : isEnabledFromFlags(name, paramFlag));
    // eslint-disable-next-line
  }, []);

  return {
    isEnabled,
    hideFeature,
    persistentFeature,
    clear: () => {
      setEnabled(false);
      localStorage.removeItem(name);
    },
  };
};

export default useFeatureToggle;
