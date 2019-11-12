import { Link as LinkBase } from 'react-router-dom';

import { styleComponent } from 'components/Utils';

import styles from './Core.module.css';

export const applyDefaultStyles = Component => styleComponent(Component);

export const Box = styleComponent('div');
export const Flex = styleComponent('div', styles.flex);
export const Link = styleComponent(LinkBase, styles.link);
export const ExternalLink = styleComponent('a', styles.link);
export const Section = styleComponent('section', styles.section);
export const Span = styleComponent('span', styles.span);
export const Div = styleComponent('div', styles.div);
export const Paragraph = styleComponent('p', styles.paragraph);
