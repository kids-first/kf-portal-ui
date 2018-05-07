import * as React from 'react';
import { css } from 'emotion';
import { compose } from 'recompose';
import { withTheme } from 'emotion-theming';

const CompleteOMeter = compose(withTheme)(({ theme, percentage, className }) => (
  <div
    className={`${theme.column} ${css`
      background: #f4f5f8;
      height: 100%;
      justify-content: center;
      align-items: center;
      line-height: 1;
    `} ${className}`}
  >
    <span
      css={`
        color: ${theme.active};
        font-size: 24px;
        font-weight: 500;
      `}
    >
      {Math.trunc(percentage * 100)}%
    </span>
    <span
      css={`
        color: #74757d;
        font-size: 12px;
        font-weight: 300;
      `}
    >
      Complete
    </span>
  </div>
));

export default CompleteOMeter;
