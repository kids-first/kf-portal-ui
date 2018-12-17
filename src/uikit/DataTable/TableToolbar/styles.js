import styled from 'react-emotion';

import { applyDefaultStyles } from 'uikit/Core';
import Row from 'uikit/Row';

export const Toolbar = styled(Row)`
  justify-content: space-between;
  border: 1px solid ${({ theme }) => theme.greyScale5};
  padding: 3px 4px;
  align-items: center;
`;

export const PaginationStatus = applyDefaultStyles(styled('div')`
  margin-left: 5px;
  font-size: 12px;
  font-family: ${({ theme }) => theme.fonts.default};
  color: ${({ theme }) => theme.greyScale9};
`);

export const ToolbarGroup = applyDefaultStyles(styled(Row)``);
