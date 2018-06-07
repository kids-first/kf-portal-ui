import styled from 'react-emotion';
import { justifyContent } from 'styled-system';

export default styled('div')`
  ${({ theme }) => theme.row};
  ${({ buffer }) => (buffer ? `margin-top: 10px;` : ``)};
  ${({ center, theme }) => (center ? theme.center : ``)};
  ${justifyContent};
`;
