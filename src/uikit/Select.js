import styled from 'react-emotion';
import { applyDefaultStyles } from './Core';

export default applyDefaultStyles(styled('select')`
  ${({ theme }) => theme.select};
  ${({ theme }) => theme.input};
`);
