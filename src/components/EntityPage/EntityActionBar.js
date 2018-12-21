import * as React from 'react';
import { compose } from 'recompose';
import { injectState } from 'freactal';
import { withTheme } from 'emotion-theming';

import styled from 'react-emotion';
import { Flex } from 'uikit/Core';
import Row from 'uikit/Row';

import { withApi } from 'services/api';

const enhance = compose(
  injectState,
  withTheme,
  withApi,
);

const ActionBar = styled(Flex)`
  height: 56px;
  width: 100%;

  box-shadow: 0 0 4.9px 0.1px ${({ theme }) => theme.shadow};
  border-top: solid 1px #${({ theme }) => theme.borderGrey};
  background-color: ${({ theme }) => theme.white};

  align-items: center;
  justify-content: flex-end;
  flex-direction: column;
`;

const ContentContainer = styled(Row)`
  ${({ theme }) => theme.contentContainer};
  height: 100%;
`;

const EntityActionBar = ({ children }) => (
  <ActionBar>
    <ContentContainer>{children}</ContentContainer>
  </ActionBar>
);

export default enhance(EntityActionBar);
