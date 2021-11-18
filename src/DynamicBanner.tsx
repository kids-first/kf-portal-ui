import React, { FunctionComponent } from 'react';
import { Alert } from 'antd';

import { bannerMessage, bannerType, bannerUrl } from 'common/injectGlobals';

import { isFeatureEnabled } from './common/featuresToggles';

const SHOW_DYNAMIC_INFO_BANNER = 'SHOW_DYNAMIC_INFO_BANNER';

export const hideDynamicInfoBannerForDisplay = () =>
  localStorage.setItem(SHOW_DYNAMIC_INFO_BANNER, 'false');

export const showDynamicInfoBanner = () =>
  isFeatureEnabled('showDynamicBanner') &&
  localStorage.getItem(SHOW_DYNAMIC_INFO_BANNER) !== 'false';

const parseBannerType = (): 'success' | 'info' | 'warning' | 'error' | undefined => {
  switch (bannerType) {
    case 'success':
    case 'info':
    case 'warning':
    case 'error':
      return bannerType;
    default:
      return undefined;
  }
};

const DynamicInfoBanner: FunctionComponent = () => (
  <Alert
    message={
      <div>
        {bannerMessage + ' '}
        <a href={bannerUrl} target="_blank" rel="noopener noreferrer">
          Kids First forum.
        </a>
      </div>
    }
    type={parseBannerType()}
    banner={true}
    closable
    onClose={hideDynamicInfoBannerForDisplay}
  />
);

export default DynamicInfoBanner;
