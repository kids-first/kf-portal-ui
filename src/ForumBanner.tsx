import React, { FunctionComponent } from 'react';
import { Alert, Badge } from 'antd';
import style from './ForumBanner.module.css';
import styleThemeColors from 'style/themes/default/colors.module.scss';

const SHOW_FORUM_BANNER = 'SHOW_FORUM_BANNER';

export const removeForumBanner = () => localStorage.removeItem(SHOW_FORUM_BANNER);
export const showForumBanner = () => localStorage.getItem(SHOW_FORUM_BANNER) === 'true';
export const setForumBannerForDisplay = () => localStorage.setItem(SHOW_FORUM_BANNER, 'true');

const ForumBanner: FunctionComponent = () => (
  <Alert
    message={
      <div className={style.messageContainer}>
        <Badge
          count={'New'}
          className={style.newBadge}
          style={{ backgroundColor: styleThemeColors.badgeNewColor }}
        />
        Discuss the Kids First Portal and datasets with members of the Data Resource Center and
        other users.
        <a
          className={style.forumLink}
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
