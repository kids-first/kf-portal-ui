import styled from 'react-emotion';

import { applyDefaultStyles } from 'uikit/Core';
import Row from 'uikit/Row';

export const Toolbar = styled(Row)`
  justify-content: space-between;
`;

export const PaginationStatus = applyDefaultStyles(styled('div')``);
export const ToolbarButtonGroup = applyDefaultStyles(styled('div')``);
