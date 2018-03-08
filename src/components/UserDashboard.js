import * as React from 'react';
import { get } from 'lodash';
import { css } from 'react-emotion';
import DonutChart from 'react-svg-donut-chart';
import { compose, branch, renderComponent } from 'recompose';
import { Link, withRouter } from 'react-router-dom';
import { injectState } from 'freactal';
import styled from 'react-emotion';
import PencilIcon from 'react-icons/lib/fa/pencil';
import CogIcon from 'react-icons/lib/fa/cog';

import { withTheme } from 'emotion-theming';
import { ROLES } from 'common/constants';

import Gravtar from 'uikit/Gravatar';
import RightIcon from 'react-icons/lib/fa/angle-right';
import { CAVATICA, GEN3 } from 'common/constants';
import CheckIcon from 'react-icons/lib/fa/check-circle';
import ExternalLink from 'uikit/ExternalLink';

const SettingsButton = ({ egoId, theme, ...props }) => (
  <Link
    to={{
      pathname: `/user/${egoId}`,
      hash: '#settings',
    }}
    css={`
      ${theme.hollowButton};
      text-transform: uppercase;
      font-weight: 500;
    `}
    {...props}
  >
    <CogIcon
      css={`
        padding-right: 5px;
      `}
    />{' '}
    Settings & Privacy
  </Link>
);

const EditButton = ({ egoId, theme, ...props }) => (
  <Link
    to={{
      pathname: `/user/${egoId}`,
      hash: '#aboutMe',
    }}
    css={`
      ${theme.hollowButton};
      text-transform: uppercase;
      font-weight: 500;
    `}
    {...props}
  >
    <PencilIcon
      css={`
        padding-right: 5px;
      `}
    />{' '}
    Edit Profile
  </Link>
);

const StyledH2 = styled('h2')`
  font-family: Montserrat;
  font-size: 28px;
  font-weight: 400;
  letter-spacing: 0.4px;
  color: ${({ theme }) => theme.primaryHover};
  margin: 0px;
`;

const StyledH3 = styled('h3')`
  font-family: Montserrat;
  font-size: 20px;
  font-weight: 300;
  line-height: 1;
  letter-spacing: 0.3px;
  text-align: left;
  color: ${({ theme }) => theme.primaryHover};
  margin: 0;
`;

const StyledH4 = styled('h4')`
  font-family: Montserrat;
  font-size: 20px;
  font-weight: 300;
  line-height: 1;
  letter-spacing: 0.3px;
  text-align: left;
  color: ${({ theme }) => theme.primaryHover};
  margin: 0;
`;

const SpacedSpan = styled('span')`
  padding-top: 8px;
`;

export default compose(
  injectState,
  withRouter,
  withTheme,
  branch(({ state: { loggedInUser } }) => !loggedInUser, renderComponent(() => <div />)),
)(({ state: { loggedInUser, integrationTokens, percentageFilled }, theme }) => (
  <div
    css={`
      ${theme.row};
      height: 100%;
    `}
  >
    <div
      css={`
        ${theme.column};
        width: 411px;
        height: 100%;
        background-image: linear-gradient(rgba(64, 76, 154, 0.25), rgba(64, 76, 154, 0.25)),
          linear-gradient(to bottom, #1d78b9, #009bb8 52%, #02b0ed);
        box-shadow: 0 0 4.8px 0.2px #a0a0a3;
        padding-top: 40px;
        justify-content: flex-start;
        align-content: space-around;
        align-items: center;
        color: #fff;
        font-family: Montserrat;
        font-size: 14px;
      `}
    >
      <div
        css={`
          ${theme.column};
          align-items: center;
          width: 202px;
          height: 202px;
        `}
      >
        <div
          className={css`
            width: 202px;
          `}
        >
          <DonutChart
            data={[
              { value: 100 - percentageFilled * 100, stroke: '#cdd0d9' },
              { value: percentageFilled * 100, stroke: theme.highlight },
            ]}
          />
        </div>
        <Gravtar
          email={loggedInUser.email || ''}
          size={125}
          css={`
            border-radius: 50%;
            padding: 2px;
            background-color: #fff;
            border: 1px solid #cacbcf;
            margin-top: -170px;
          `}
        />
      </div>
      <div>
        {get(
          ROLES.reduce((acc, { type, icon }) => ({ ...acc, [type]: icon }), {}),
          get(loggedInUser.roles, 0),
          () => {},
        )({ height: '45px', fill: '#fff' })}
        <div
          css={`
            ${theme.pill};
            display: flex;
            justify-content: space-around;
            text-transform: capitalize;
            width: 250px;
            height: 24px;
            margin-top: -45px;
            padding-left: 45px;
          `}
        >
          <div
            css={`
              font-weight: 500;
            `}
          >
            {loggedInUser.roles}
          </div>
          <div>
            <span
              css={`
                font-weight: 500;
              `}
            >
              {(percentageFilled * 100).toFixed(0)}%
            </span>{' '}
            Complete
          </div>
        </div>
      </div>
      <SpacedSpan
        css={`
          text-decoration: underline;
        `}
      >{`${loggedInUser.title} ${loggedInUser.firstName} ${loggedInUser.lastName}`}</SpacedSpan>
      <SpacedSpan>{loggedInUser.jobTitle}</SpacedSpan>
      <SpacedSpan>{loggedInUser.institution}</SpacedSpan>
      <SpacedSpan>{[loggedInUser.city, loggedInUser.state].filter(Boolean).join(', ')}</SpacedSpan>
      <SpacedSpan>{loggedInUser.country}</SpacedSpan>
      <div
        css={`
          margin: 50px 0;
          text-decoration: underline;
        `}
      >
        {loggedInUser.email}
      </div>
      <div
        css={`
          display: flex;
        `}
      >
        <EditButton egoId={loggedInUser.egoId} theme={theme} />
        <SettingsButton egoId={loggedInUser.egoId} theme={theme} />
      </div>
    </div>
    <div
      css={`
        ${theme.column};
        flex-grow: 1;
        padding: 40px;
      `}
    >
      <StyledH2>Welcome back, {loggedInUser.firstName}!</StyledH2>
      <StyledH3>Saved queries go here</StyledH3>
      <div
        css={`
          border-radius: 30px;
          background-color: #f4f5f8;
          border: solid 1px #e0e1e6;
          padding: 10px 50px;
          ${theme.row};
          align-items: center;
          justify-content: space-between;
        `}
      >
        <div
          css={`
            ${theme.column};
            width: 285px;
          `}
        >
          <StyledH4>Download Controlled Data</StyledH4>
          gen3 placeholder
        </div>
        <div
          css={`
            ${theme.cloumn};
            width: 285px;
          `}
        >
          <StyledH4>Analyze Data</StyledH4>
          {integrationTokens[CAVATICA] ? (
            <div
              css={`
                color: ${theme.active};
                padding: 10px;
              `}
            >
              <CheckIcon size={20} />
              <span> Connected</span> to{' '}
              <ExternalLink href="http://cavatica.org/">Cavatica</ExternalLink>.
            </div>
          ) : (
            <div>
              Analyze data quickly by connecting your Kids First account to{' '}
              <ExternalLink href="http://cavatica.org/">Cavatica</ExternalLink>.
            </div>
          )}
        </div>
        <div>
          <Link
            to={{
              pathname: `/user/${loggedInUser.egoId}`,
              hash: '#settings',
            }}
            css={theme.actionButton}
          >
            Settings <RightIcon />
          </Link>
        </div>
      </div>
    </div>
  </div>
));
