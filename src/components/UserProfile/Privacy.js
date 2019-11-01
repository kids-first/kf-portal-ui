import * as React from 'react';
import { compose } from 'recompose';
import { withTheme } from 'emotion-theming';

import { flexColumn } from 'src/theme/tempTheme.module.css';

export default compose(withTheme)(({ profile, theme, submit, mode, setMode }) => (
  <div
    css={`
      ${flexColumn}
      width: 70%;
      padding: 0 2em;
    `}
  >
    privacy - tbd
  </div>
));
