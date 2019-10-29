import styled from 'react-emotion';
import { Flex } from './Core';
import { applyDefaultStyles } from './Core';

export default applyDefaultStyles(styled(Flex)`
  min-height: 0;
  ${({ theme }) => theme.row};
  ${({ center, theme }) => (center ? theme.center : ``)};
  ${({ flexStrink }) => (flexStrink || !isNaN(flexStrink) ? `flex-shrink: ${flexStrink}` : ``)};
`);
