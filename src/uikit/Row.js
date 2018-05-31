import styled from 'react-emotion';

export default styled('div')`
  ${({ theme }) => theme.row};
  ${({ buffer }) => (buffer ? `margin-top: 10px;` : ``)};
  ${({ center, theme }) => (center ? theme.center : ``)};
`;
