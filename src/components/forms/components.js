import React from 'react';
import { Field } from 'formik';
// import { width, space } from 'styled-system';

import { input } from 'src/theme/tempTheme.module.css';

export const FieldInput = ({ children, className, ...props }) => (
  // ${width};
  // ${space};
  <Field className={`${input} ${className}`} {...props}>
    {children}
  </Field>
);
