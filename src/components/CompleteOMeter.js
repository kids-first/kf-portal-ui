import * as React from 'react';
import { css } from 'react-emotion';
import { compose } from 'recompose';
import { withTheme } from 'emotion-theming';
import DonutChart from 'react-svg-donut-chart';
import { get } from 'lodash';

import { ROLES } from 'common/constants';

const CompleteOMeter = compose(withTheme)(({ theme, role, percentage }) => (
  <div
    css={`
      width: 310px;
      ${theme.column};
      align-items: center;
    `}
  >
    <div
      css={`
        margin-left: -20px;
      `}
    >
      <div
        className={css`
          ${theme.column} color: ${theme.active};
          background: #f4f5f8;
          text-align: center;
          justify-content: center;
          height: 116px;
          width: 116px;
          border-radius: 50%;
        `}
      >
        {get(ROLES.reduce((acc, { type, icon }) => ({ ...acc, [type]: icon }), {}), role, () => {})(
          {
            height: '27px',
            fill: theme.active,
          },
        )}
        <span
          css={`
            padding: 8px 0;
            font-size: 24px;
            font-weight: 500px;
            line-height: 0.75;
          `}
        >
          {Math.ceil(percentage * 100)}%
        </span>
        <span
          css={`
            font-size: 12px;
            font-weight: 300;
          `}
        >
          Complete
        </span>{' '}
      </div>
      <div
        className={css`
          width: 166px;
          margin-top: -137px;
          margin-left: -23px;
        `}
      >
        <DonutChart
          data={[
            { value: 100 - percentage * 100, stroke: '#cdd0d9' },
            { value: percentage * 100, stroke: theme.highlight },
          ]}
        />
      </div>
    </div>
  </div>
));

export default CompleteOMeter;
