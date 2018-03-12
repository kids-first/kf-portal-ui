import React from 'react';
import { get } from 'lodash';
import DonutChart from 'react-svg-donut-chart';
import { ROLES } from 'common/constants';
import Gravtar from 'uikit/Gravatar';
import { SpacedSpan } from './styles';
import EditButton from './EditButton';
import SettingsButton from './SettingsButton';

export default ({ theme, percentageFilled, loggedInUser }) => (
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
        css={`
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
    >{`${loggedInUser.firstName} ${loggedInUser.lastName}`}</SpacedSpan>
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
);
