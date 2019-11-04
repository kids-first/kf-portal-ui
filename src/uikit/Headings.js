import React from 'react';

import styles from './Core.module.css';

/**
 * Headings: Standard
 */
// const BaseHeading = ({ theme, ...props }) => css`
//   color: ${props.color ? props.color : theme.secondary};
//   margin: 0;
//   padding: 0;
//   font-weight: 500;
//   line-height: 0.71;
//   letter-spacing: 0.4px;
//   font-family: ${theme.fonts.default};
//   text-decoration: none;
// `;

// export const H1 = applyDefaultStyles(styled('h1')`
//   ${BaseHeading};
//   font-size: 28px;
// `);
export const H1 = ({ children, className = '', ...props }) => (
  <h1 className={`${styles.heading1} ${className}`} {...props}>
    {children}
  </h1>
);

// export const H2 = applyDefaultStyles(styled('h2')`
//   ${BaseHeading};
//   font-size: 22px;
// `);
export const H2 = ({ children, className = '', ...props }) => (
  <h2 className={`${styles.heading2} ${className}`} {...props}>
    {children}
  </h2>
);

// export const H3 = applyDefaultStyles(styled('h3')`
//   ${BaseHeading};
//   font-size: 16px;
//   line-height: 1;
//   letter-spacing: 0.3px;
// `);
export const H3 = ({ children, className = '', ...props }) => (
  <h3 className={`${styles.heading3} ${className}`} {...props}>
    {children}
  </h3>
);

// export const H4 = applyDefaultStyles(styled('h4')`
//   font-family: ${({ theme }) => theme.fonts.details};
//   font-size: 13px;
//   font-style: italic;
//   line-height: 1.85;
//   text-align: left;
//   color: ${({ theme }) => theme.greyScale9};
//   margin: 0;
//   padding: 0;
//   font-weight: normal;
// `);
export const H4 = ({ children, className = '', ...props }) => (
  <h4 className={`${styles.heading4} ${className}`} {...props}>
    {children}
  </h4>
);

export const FileRepoH3 = ({ children, style = {}, ...props }) => (
  <H3
    style={{
      fontSize: '16px',
      ...style,
    }}
    {...props}
  >
    {children}
  </H3>
);

/**
 * Headings: Join/Login
 */
// const BaseJoinHeading = ({ theme }) => css`
//   font-family: ${theme.fonts.default};
//   color: ${theme.secondary};
//   font-weight: 500;
// `;

// export const JoinH2 = applyDefaultStyles(styled('h2')`
//   ${BaseJoinHeading};
//   font-size: 28px;
//   line-height: 0.87;
//   letter-spacing: 0.4px;
//   text-align: center;
// `);

// export const JoinH3 = applyDefaultStyles(styled('h3')`
//   ${BaseJoinHeading};
//   font-size: 16px;
//   line-height: 1.44;
//   letter-spacing: 0;
// `);
