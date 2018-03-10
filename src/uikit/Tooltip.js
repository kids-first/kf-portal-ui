import 'react-tippy/dist/tippy.css';
import React from 'react';
import { compose } from 'recompose';
import { injectGlobal } from 'emotion';
import { Tooltip } from 'react-tippy';
import { ThemeProvider } from 'emotion-theming';
import theme from '../theme/defaultTheme';
import { injectState } from 'freactal';
import { provideLoggedInUser, provideModalState, provideToast } from 'stateProviders';

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

const enhance = compose(provideLoggedInUser, provideModalState, provideToast, injectState);

export default props => (
  <Tooltip
    {...props}
    html={React.createElement(
      enhance(() => <ThemeProvider theme={theme}>{props.html}</ThemeProvider>),
    )}
  />
);
