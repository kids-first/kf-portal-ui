import styled from 'react-emotion';
import { Flex } from './Core';
import { position } from 'styled-system';

export default styled(Flex)`
  ${({ theme }) => theme.column};
  ${({ center, theme }) => (center ? theme.center : ``)};
  ${({ scrollY }) => (scrollY ? `overflow-y: scroll` : ``)};
  ${position};
`;
