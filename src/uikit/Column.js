import styled from 'react-emotion';

export default styled('div')`
  ${({ theme }) => theme.column};
  ${({ center, theme }) => (center ? theme.center : ``)};
`;
