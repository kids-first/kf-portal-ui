import * as React from 'react';
import { compose } from 'recompose';
import { withTheme } from 'emotion-theming';

export default compose(withTheme)(({ profile, theme, submit, mode, setMode }) => (
  <div
    css={`
      ${theme.column} width: 70%;
      padding: 0 2em;
    `}
  >
    privacy - tbd
  </div>
));
