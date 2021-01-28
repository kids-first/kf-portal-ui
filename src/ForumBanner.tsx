import React, { FunctionComponent } from 'react';
import { Alert, Badge } from 'antd';
import './ForumBanner.scss';

const SHOW_FORUM_BANNER = 'SHOW_FORUM_BANNER';

export const removeForumBanner = () => localStorage.removeItem(SHOW_FORUM_BANNER);
export const showForumBanner = () => localStorage.getItem(SHOW_FORUM_BANNER) === 'true';
export const setForumBannerForDisplay = () => localStorage.setItem(SHOW_FORUM_BANNER, 'true');

const ForumBanner: FunctionComponent = () => (
  <Alert
    message={
      <div className={'message-container'}>
        <Badge count={'New'} className={'new-badge'} style={{ backgroundColor: '#52c41a' }} />
        Discuss the Kids First Portal and datasets with members of the Data Resource Center and
        other users.
        <a
          className={'forum-link'}
          href={'https://forum.kidsfirstdrc.org/login'}
          target="_blank"
          rel="noopener noreferrer"
        >
          Visit the Kids First forum.
        </a>
      </div>
    }
    type="info"
    closable
    onClose={removeForumBanner}
  />
);

export default ForumBanner;
