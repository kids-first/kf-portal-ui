import styled from 'react-emotion';
import { Flex } from './Core';
import { justifyContent, space, alignItems } from 'styled-system';

export default styled(Flex)`
  ${({ theme }) => theme.row};
  ${({ center, theme }) => (center ? theme.center : ``)};
  ${justifyContent};
  ${alignItems};
  ${space};
`;
