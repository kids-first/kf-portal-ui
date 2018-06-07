import styled from 'react-emotion';
import { Flex } from './Core';
import { justifyContent } from 'styled-system';

export default styled(Flex)`
  ${({ theme }) => theme.row};
  ${({ buffer }) => (buffer ? `margin-top: 10px;` : ``)};
  ${({ center, theme }) => (center ? theme.center : ``)};
  ${justifyContent};
`;
