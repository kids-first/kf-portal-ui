import React from 'react';
import { ThemeProvider } from 'emotion-theming';
import { storiesOf } from '@storybook/react';
import theme from '../src/theme/defaultTheme';
import {HeadingH2} from '../src/uikit/Typography';

storiesOf('Typography', module).add('Headings', () => (
  <ThemeProvider theme={theme}>
    <React.Fragment>
      <HeadingH2 >Heading 2</HeadingH2>
    </React.Fragment>
  </ThemeProvider>
));
