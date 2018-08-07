import styled from 'react-emotion';
import { Flex } from './Core';
import { applyDefaultStyles } from './Core';

export default applyDefaultStyles(styled(Flex)`
  ${({ theme }) => theme.row};
  ${({ center, theme }) => (center ? theme.center : ``)};
`);
