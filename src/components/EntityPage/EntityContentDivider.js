import { withTheme } from 'emotion-theming';

import styled from 'react-emotion';

export default withTheme(styled('hr')`
  border: 0px;
  border-top: 2px dotted ${({ theme }) => theme.greyScale5};
  width: 100%;
`);
