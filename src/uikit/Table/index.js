import styled from 'react-emotion';
import { applyDefaultStyles } from '../Core';

export const TableHeader = applyDefaultStyles(styled('th')`
  font-size: 13px;
  font-family: ${({ theme }) => theme.fonts.default};
  font-weight: 700;
  color: ${({ theme }) => theme.secondary};
`);

export const TableRow = applyDefaultStyles(styled('tr')`
  font-size: 13px;
  font-family: ${({ theme }) => theme.fonts.default};
  font-weight: 700;
  color: ${({ theme }) => theme.secondary};
`);
