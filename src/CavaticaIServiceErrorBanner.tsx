/* this component is genuinely temporary */
import React from 'react';
import { Alert } from 'antd';

const SHOW_CAVATICA_SERVICE_ERROR_BANNER = 'SHOW_CAVATICA_SERVICE_ERROR_BANNER';

const hideCavaticaServiceErrorBanner = () =>
  localStorage.setItem(SHOW_CAVATICA_SERVICE_ERROR_BANNER, 'false');

const isBannerExplicitlyHidden = () =>
  localStorage.getItem(SHOW_CAVATICA_SERVICE_ERROR_BANNER) === 'false';

const CavaticaServiceErrorBanner = () => {
  if (isBannerExplicitlyHidden()) {
    return null;
  }

  return (
    <Alert
      message={
        'The Kids First Data Resource Portal is currently experiencing an error' +
        ' where files from the File Repository cannot be analyzed in CAVATICA.' +
        ' Our team is aware of this issue and working to fix it.'
      }
      type="warning"
      closable
      onClose={hideCavaticaServiceErrorBanner}
    />
  );
};

export default CavaticaServiceErrorBanner;
