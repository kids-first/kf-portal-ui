import React from 'react';
import { withTheme } from 'emotion-theming';
import { compose } from 'recompose';

const Heading = compose(withTheme)(({ theme, className = '', ...rest }) => (
  <div {...rest} className={`${theme.heading} ${className}`} />
));

export default Heading;
