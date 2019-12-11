import React from 'react';
import { Field } from 'formik';

import { input, buttonsDiv } from 'theme/tempTheme.module.css';
import { styleComponent } from 'components/Utils/index';

export const FieldInput = ({ children, className, ...props }) => (
  <Field className={`${input} ${className}`} {...props}>
    {children}
  </Field>
);

export const ButtonsDiv = styleComponent('div', buttonsDiv);
