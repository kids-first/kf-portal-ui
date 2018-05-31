import React from 'react';
import { get } from 'lodash';
import { ROLES } from 'common/constants';

import { css } from 'emotion';
import { withTheme } from 'emotion-theming';
import { compose } from 'recompose';
import { injectState } from 'freactal/lib/inject';

const enhance = compose(withTheme, injectState);

const roleLookup = ROLES.reduce((acc, { type, ...x }) => ({ ...acc, [type]: x }), {});

const RoleIconButton = ({ className = '', children, theme, state: { loggedInUser } }) => {
  const userRole = get(loggedInUser, ['roles', 0]);
  const RoleIcon = get(roleLookup, [userRole, 'icon'], null);
  const background = get(roleLookup, [userRole, 'color'], null);

  return (
    <div
      css={`
        display: flex;
        height: 42px;
        border-radius: 21px;
        background-color: ${background};
        color: white;
        font-size: 14px;
        font-weight: 300;
        line-height: 1.86;
        letter-spacing: 0.2px;
        text-align: left;
        text-transform: capitalize;
        padding: 0 16px 0 0;
        ${className};
      `}
    >
      <RoleIcon
        height="45px"
        fill="#fff"
        css={css`
          margin-right: 11px;
          flex: none;
        `}
      />
      <div
        css={`
          justify-content: space-between;
          display: flex;
          align-items: center;
          width: 100%;
        `}
      >
        <div
          css={`
            font-weight: 500;
          `}
        >
          {userRole}
        </div>
        {children}
      </div>
    </div>
  );
};

export default enhance(RoleIconButton);
