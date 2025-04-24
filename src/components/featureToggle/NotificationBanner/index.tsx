import { useEffect } from 'react';
import { Alert, AlertProps } from 'antd';
import parseHTML from 'html-react-parser';

import useFeatureToggle from 'hooks/useFeatureToggle';

type OwnProps = Omit<AlertProps, 'afterClose'> & {
  featureToggleKey: string;
};

const NotificationBanner = ({ featureToggleKey, ...rest }: OwnProps) => {
  const { isEnabled, hideFeature, persistentFeature } = useFeatureToggle(featureToggleKey);

  useEffect(() => {
    if (!rest.closable) {
      persistentFeature();
    }
  }, []);

  return (
    <>
      {isEnabled && (
        <Alert
          {...rest}
          message={typeof rest.message === 'string' ? parseHTML(rest.message) : rest.message}
          afterClose={hideFeature}
        />
      )}
    </>
  );
};

export default NotificationBanner;
