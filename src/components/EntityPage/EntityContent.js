import * as React from 'react';

import styled from 'react-emotion';
import Column from '../../uikit/Column';

const Container = styled(Column)`
  ${({ theme }) => theme.contentContainer}
  padding: 10px 0;
`;

export default ({ children }) => <Container>{children}</Container>;
