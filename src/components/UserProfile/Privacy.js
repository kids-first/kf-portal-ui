import * as React from 'react';
import { css } from 'emotion';
import { compose } from 'recompose';
import { withTheme } from 'emotion-theming';

export default compose(withTheme)(({ profile, theme, submit, mode, setMode }) => (
  <div
    className={`${theme.column} ${css`
      width: 70%;
      padding: 0 2em;
    `}`}
  >
    privacy - tbd
  </div>
));
