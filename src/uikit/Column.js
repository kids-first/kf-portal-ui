import styled from 'react-emotion';
import { Flex } from './Core';

export default styled(Flex)`
  ${({ theme }) => theme.column};
  ${({ center, theme }) => (center ? theme.center : ``)};
`;
