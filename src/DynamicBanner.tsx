import React, { FunctionComponent } from 'react';
import { Alert } from 'antd';

import { bannerActivity, bannerMessage, bannerUrl } from 'common/injectGlobals';

import style from './DynamicBanner.module.scss';

const SHOW_DYNAMIC_INFO_BANNER = 'SHOW_DYNAMIC_INFO_BANNER';

export const hideDynamicInfoBannerForDisplay = () =>
  localStorage.setItem(SHOW_DYNAMIC_INFO_BANNER, 'false');

export const showDynamicInfoBanner = () =>
  bannerActivity && localStorage.getItem(SHOW_DYNAMIC_INFO_BANNER) !== 'false';

const DynamicInfoBanner: FunctionComponent = () => (
  <Alert
    message={
      <div className={style.messageContainer}>
        {bannerMessage + ' '}
        <a className={style.forumLink} href={bannerUrl} target="_blank" rel="noopener noreferrer">
          Kids First forum.
        </a>
      </div>
    }
    type="warning"
    banner={true}
    closable
    onClose={hideDynamicInfoBannerForDisplay}
  />
);

export default DynamicInfoBanner;
