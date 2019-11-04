import React from 'react';

import { Link as LinkBase } from 'react-router-dom';
// import {
//   space,
//   width,
//   height,
//   fontSize,
//   color,
//   lineHeight,
//   fontWeight,
//   borders,
//   borderRadius,
//   alignItems,
//   justifyContent,
//   flexGrow,
//   flexWrap,
//   flexBasis,
//   flexDirection,
//   justifySelf,
//   alignSelf,
//   maxWidth,
//   complexStyle,
//   hover,
//   textAlign,
//   position,
//   left,
//   right,
//   display,
// } from 'styled-system';

import styles from './Core.module.css';

// const applyProp = (name, value) => (value ? `${name}: ${value};` : ``);
// const overflow = ({ overflow }) => applyProp(`overflow`, overflow);
// const overflowY = ({ overflowY }) => applyProp(`overflow-y`, overflowY);

// [NEXT] replicate what `` and `applyDefaultStyles` is doing, somehow
export const applyDefaultStyles = Component => ({ children, ...props }) => (
  <Component {...props}>{children}</Component>
);

// [NEXT] `applyDefaultStyles` and `complexStyle` does nothing!!!

// const baseStyles = complexStyle({
//   prop: 'baseStyle',
//   key: 'baseStyles',
// });
// export const applyDefaultStyles = (
//   Component,
//   customShouldFowardProp = { shouldForwardProp: null },
// ) => styled(Component, {
//   shouldForwardProp: customShouldFowardProp.shouldForwardProp,
// })`
//   ${baseStyles}
//   ${space}
//   ${width}
//   ${height}
//   ${fontSize}
//   ${fontWeight}
//   ${color}
//   ${maxWidth}
//   ${justifySelf}
//   ${alignSelf}
//   ${borders}
//   ${borderRadius}
//   ${lineHeight}
//   ${overflow}
//   ${overflowY}
//   ${hover}
//   ${textAlign}
//   ${position}
//   ${left}
//   ${right}
//   ${display}
// `;

// const boxStyles = complexStyle({
//   prop: 'boxStyle',
//   key: 'boxStyles',
// });
// export const Box = styled(applyDefaultStyles('div'))`
//   ${boxStyles};
// `;
// [NEXT] replicate what `styled` and `applyDefaultStyles` is doing, somehow
export const Box = ({ children, ...props }) => <div {...props}>{children}</div>;

// const flexStyles = complexStyle({
//   prop: 'flexStyle',
//   key: 'flexStyles',
// });
// export const Flex = styled(Box)`
//   display: flex;
//   ${flexStyles};
//   ${alignItems};
//   ${justifyContent};
//   ${flexWrap};
//   ${flexBasis};
//   ${flexDirection};
//   ${flexGrow};
// `;
export const Flex = ({ children, ...props }) => (
  <div className={styles.flex} {...props}>
    {children}
  </div>
);

// const linkStyles = complexStyle({
//   prop: 'linkStyle',
//   key: 'linkStyles',
// });
// export const Link = styled(applyDefaultStyles(LinkBase))`
//   ${linkStyles};
//   &:hover {
//     color: ${({ theme }) => theme.highlight};
//   }
// `;
export const Link = ({ children, className = '', ...props }) => (
  <LinkBase className={`${styles.link} ${className}`} {...props}>
    {children}
  </LinkBase>
);

// export const ExternalLink = styled(applyDefaultStyles('a'))`
//   ${linkStyles};
//   &:hover {
//     color: ${({ theme }) => theme.highlight};
//   }
// `;
export const ExternalLink = ({ children, className = '', ...props }) => (
  <a className={`${styles.link} ${className}`} {...props}>
    {children}
  </a>
);

// export const Section = applyDefaultStyles(styled('section')`
//   font-family: ${({ theme }) => theme.fonts.details};
//   color: ${({ theme }) => theme.greyScale1};
//   font-size: 14px;
//   line-height: 2.57;
//   letter-spacing: 0.2px;
// `);
export const Section = ({ children, className = '', ...props }) => (
  <section className={`${styles.section} ${className}`} {...props}>
    {children}
  </section>
);

// export const Span = applyDefaultStyles(styled('span')`
//   font-family: ${({ theme }) => theme.fonts.details};
// `);
export const Span = ({ children, className = '', ...props }) => (
  <span className={`${styles.span} ${className}`} {...props}>
    {children}
  </span>
);

// export const Div = applyDefaultStyles(styled('div')`
//   font-family: ${({ theme }) => theme.fonts.details};
// `);
export const Div = ({ children, className = '', ...props }) => (
  <div className={`${styles.div} ${className}`} {...props}>
    {children}
  </div>
);

// export const Paragraph = applyDefaultStyles(styled('p')`
//   margin: 0;
//   font-family: ${({ theme }) => theme.fonts.details};
//   line-height: 28px;
//   font-size: 15px;
//   color: ${({ theme }) => theme.greyScale1};
// `);
export const Paragraph = ({ children, className = '', ...props }) => (
  <p className={`${styles.paragraph} ${className}`} {...props}>
    {children}
  </p>
);
