import styled from 'react-emotion';
import { Flex } from './Core';
import { position, flex, alignItems, justifyContent } from 'styled-system';

export default styled(Flex)`
  ${({ theme }) => theme.column};
  ${({ center, theme }) => (center ? theme.center : ``)};
  ${({ scrollY }) => (scrollY ? `overflow-y: scroll` : ``)};
  ${position};
  ${alignItems};
  ${justifyContent};
  ${flex};
`;
