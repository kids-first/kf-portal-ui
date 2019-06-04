import styled from 'react-emotion';

export default styled('textarea')`
  ${({ theme }) => theme.input};
  ${({ theme }) => theme.textarea};
`;
