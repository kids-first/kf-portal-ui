import * as React from 'react';
import { compose } from 'recompose';
import { injectState } from 'freactal';

import { Flex } from 'uikit/Core';
import { withApi } from 'services/api';
import { ContentContainer } from 'theme/tempTheme';

import '../../EntityPage.css';

const enhance = compose(injectState, withApi);

const ParticipantActionBar = ({ children }) => (
  <Flex className="entityParticipant-actionBar">
    <ContentContainer className="entityParticipant-actionBar-container">
      {children}
    </ContentContainer>
  </Flex>
);

export default enhance(ParticipantActionBar);
