import React from 'react';
import { applyDefaultStyles } from './Core';

import { input, select } from '../theme/tempTheme.module.css';

export default applyDefaultStyles(({ children, className = '', style = {}, ...props }) => (
  <select className={`${select} ${input} ${className}`} {...props}>
    {children}
  </select>
));
