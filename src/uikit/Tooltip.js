import 'react-tippy/dist/tippy.css';
import React from 'react';
import { injectGlobal } from 'emotion';
import { Tooltip } from 'react-tippy';
import theme from '../theme/defaultTheme';

injectGlobal`
  .tippy-tooltip {
    box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 1px 5px 0 rgba(0,0,0,0.12), 0 3px 1px -2px rgba(0,0,0,0.2);
    text-align: left;
  }
  .tippy-tooltip, .tippy-tooltip > * {
    background-color: white !important;
    color: ${theme.greyScale2};
  }
  .tippy-tooltip[data-interactive] {
    padding: 0;
  }
`;

export default props => <Tooltip {...props} />;
