import * as React from 'react';
import { compose } from 'recompose';
import { injectState } from 'freactal';
import { withTheme } from 'emotion-theming';

import styled from 'react-emotion';
import { Flex } from 'uikit/Core';

import { withApi } from 'services/api';
import { ContentContainer } from 'theme/tempTheme';

const enhance = compose(
  injectState,
  withTheme,
  withApi,
);

const ActionBar = styled(Flex)`
  height: 62px;
  width: 100%;

  box-shadow: 0 4.9px 4.9px -4.9px ${({ theme }) => theme.lighterShadow};
  border: solid 1px ${({ theme }) => theme.greyScale5};
  background-color: ${({ theme }) => theme.white};

  align-items: center;
  justify-content: flex-end;
  flex-direction: column;
`;

const ParticipantActionBar = ({ children }) => (
  <ActionBar>
    <ContentContainer
      style={{
        alignItems: 'center',
        justifyContent: 'flex-start',
        height: '100%',
      }}
    >
      {children}
    </ContentContainer>
  </ActionBar>
);

export default enhance(ParticipantActionBar);
